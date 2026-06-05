import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SolutionsService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async list(publishedOnly = true) {
    const key = `solutions:${publishedOnly}`;
    const cached = await this.redis.get(key);
    if (cached) return cached;
    const data = await this.prisma.solution.findMany({
      where: publishedOnly ? { status: ContentStatus.PUBLISHED } : undefined,
      orderBy: { order: 'asc' },
    });
    await this.redis.set(key, data, 300);
    return data;
  }

  async upsert(id: string | undefined, data: Record<string, unknown>) {
    const result = id
      ? await this.prisma.solution.update({ where: { id }, data: data as never })
      : await this.prisma.solution.create({ data: data as never });
    await this.redis.invalidatePattern('solutions:*');
    return result;
  }
}
