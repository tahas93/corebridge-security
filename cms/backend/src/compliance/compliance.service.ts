import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.complianceFramework.findMany({
      where: { status: ContentStatus.PUBLISHED },
    });
  }
}
