import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CaseStudiesService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async list() {
    const cached = await this.redis.get('case-studies');
    if (cached) return cached;
    const data = await this.prisma.caseStudy.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { updatedAt: 'desc' },
    });
    await this.redis.set('case-studies', data, 300);
    return data;
  }
}
