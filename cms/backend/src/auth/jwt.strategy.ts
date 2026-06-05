import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-production',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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
    if (!user?.isActive) throw new UnauthorizedException();

    const roles = user.roles.map((r) => r.role.name);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.key),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
      mfaEnabled: user.mfaEnabled,
    };
  }
}
