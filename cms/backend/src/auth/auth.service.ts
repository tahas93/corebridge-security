import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { createHash, randomBytes } from 'crypto';
import { AuditAction } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

const PASSWORD_MIN_LENGTH = 12;
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  validatePasswordPolicy(password: string) {
    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      );
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      throw new BadRequestException(
        'Password must include uppercase, lowercase, and numeric characters',
      );
    }
  }

  async login(email: string, password: string, mfaCode?: string, meta?: { ip?: string; ua?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });
    if (!user?.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.mfaEnabled) {
      if (!mfaCode || !user.mfaSecret) {
        throw new UnauthorizedException('MFA code required');
      }
      const ok = authenticator.verify({ token: mfaCode, secret: user.mfaSecret });
      if (!ok) throw new UnauthorizedException('Invalid MFA code');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.audit.log({
      action: AuditAction.LOGIN,
      userId: user.id,
      ipAddress: meta?.ip,
      userAgent: meta?.ua,
    });

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const hash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: hash, revoked: false, expiresAt: { gt: new Date() } },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: {
                  include: { permissions: { include: { permission: true } } },
                },
              },
            },
          },
        },
      },
    });
    if (!stored?.user?.isActive) throw new UnauthorizedException('Invalid refresh token');
    return this.issueTokens(stored.user);
  }

  async logout(refreshToken: string, userId?: string) {
    if (refreshToken) {
      const hash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: hash },
        data: { revoked: true },
      });
    }
    if (userId) {
      await this.audit.log({ action: AuditAction.LOGOUT, userId });
    }
    return { success: true };
  }

  async setupMfa(userId: string) {
    const secret = authenticator.generateSecret();
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const otpauth = authenticator.keyuri(user.email, 'CoreBridge CMS', secret);
    const qr = await QRCode.toDataURL(otpauth);
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });
    return { secret, qr };
  }

  async enableMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mfaSecret) throw new BadRequestException('Run MFA setup first');
    const ok = authenticator.verify({ token: code, secret: user.mfaSecret });
    if (!ok) throw new BadRequestException('Invalid MFA code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });
    return { enabled: true };
  }

  private async issueTokens(user: {
    id: string;
    email: string;
    name: string;
    mfaEnabled: boolean;
    roles: { role: { name: string; permissions: { permission: { key: string } }[] } }[];
  }) {
    const roles = user.roles.map((r) => r.role.name);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.key),
        ),
      ),
    ];

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
        permissions,
        mfaEnabled: user.mfaEnabled,
      },
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
