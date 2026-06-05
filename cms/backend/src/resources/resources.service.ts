import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.resource.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
    });
  }
}
