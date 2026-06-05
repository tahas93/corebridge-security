import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getByKey(key: string) {
    const cacheKey = `content:${key}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const entry = await this.prisma.contentEntry.findUnique({ where: { key } });
    if (!entry) throw new NotFoundException(`Content key not found: ${key}`);
    await this.redis.set(cacheKey, entry.value, 600);
    return entry.value;
  }

  async getBundle() {
    const cacheKey = 'content:bundle';
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const entries = await this.prisma.contentEntry.findMany();
    const bundle: Record<string, unknown> = {};

    for (const entry of entries) {
      const parts = entry.key.split('.');
      let cursor: Record<string, unknown> = bundle;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!cursor[part] || typeof cursor[part] !== 'object') {
          cursor[part] = {};
        }
        cursor = cursor[part] as Record<string, unknown>;
      }
      cursor[parts[parts.length - 1]] = entry.value;
    }

    await this.redis.set(cacheKey, bundle, 300);
    return bundle;
  }

  async upsert(key: string, value: unknown) {
    await this.prisma.contentEntry.upsert({
      where: { key },
      create: { key, value: value as never },
      update: { value: value as never },
    });
    await this.redis.del(`content:${key}`);
    await this.redis.del('content:bundle');
    return { key, value };
  }
}
