import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis | null = null;

  getClient(): Redis | null {
    const url = process.env.REDIS_URL;
    if (!url) return null;
    if (!this.client) {
      this.client = new Redis(url, { maxRetriesPerRequest: 2, lazyConnect: true });
      this.client.connect().catch(() => {
        this.client = null;
      });
    }
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const redis = this.getClient();
    if (!redis) return null;
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    const redis = this.getClient();
    if (!redis) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* cache optional */
    }
  }

  async del(key: string): Promise<void> {
    const redis = this.getClient();
    if (!redis) return;
    try {
      await redis.del(key);
    } catch {
      /* ignore */
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const redis = this.getClient();
    if (!redis) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(...keys);
    } catch {
      /* ignore */
    }
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }
}
