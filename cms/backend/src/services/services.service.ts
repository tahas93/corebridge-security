import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async list(publishedOnly = true) {
    const key = `services:${publishedOnly}`;
    const cached = await this.redis.get(key);
    if (cached) return cached;
    const data = await this.prisma.service.findMany({
      where: publishedOnly ? { status: ContentStatus.PUBLISHED } : undefined,
      orderBy: { order: 'asc' },
    });
    await this.redis.set(key, data, 300);
    return data;
  }

  async upsert(id: string | undefined, data: Record<string, unknown>) {
    const result = id
      ? await this.prisma.service.update({ where: { id }, data: data as never })
      : await this.prisma.service.create({ data: data as never });
    await this.redis.invalidatePattern('services:*');
    return result;
  }
}
