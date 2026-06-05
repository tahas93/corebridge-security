import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  list() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        mfaEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        roles: { include: { role: true } },
      },
    });
  }

  async create(data: { email: string; name: string; password: string; roleNames: string[] }) {
    this.auth.validatePasswordPolicy(data.password);
    const passwordHash = await bcrypt.hash(data.password, 12);
    const roles = await this.prisma.role.findMany({
      where: { name: { in: data.roleNames } },
    });
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash,
        roles: {
          create: roles.map((r) => ({ roleId: r.id })),
        },
      },
      select: { id: true, email: true, name: true },
    });
  }
}
