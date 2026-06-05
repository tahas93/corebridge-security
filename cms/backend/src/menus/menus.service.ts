import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MenusService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getByKey(key: string) {
    const cacheKey = `menu:${key}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const menu = await this.prisma.menu.findUnique({
      where: { key },
      include: {
        items: { orderBy: { order: 'asc' } },
      },
    });
    if (!menu) throw new NotFoundException(`Menu not found: ${key}`);

    const tree = this.buildTree(menu.items);
    const result = { id: menu.id, key: menu.key, name: menu.name, items: tree };
    await this.redis.set(cacheKey, result, 600);
    return result;
  }

  async upsert(key: string, name: string, items: { label: string; href: string; description?: string; parentId?: string; order: number }[]) {
    const menu = await this.prisma.menu.upsert({
      where: { key },
      create: { key, name },
      update: { name },
    });
    await this.prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
    if (items.length) {
      await this.prisma.menuItem.createMany({
        data: items.map((i) => ({
          menuId: menu.id,
          label: i.label,
          href: i.href,
          description: i.description,
          parentId: i.parentId,
          order: i.order,
        })),
      });
    }
    await this.redis.del(`menu:${key}`);
    return this.getByKey(key);
  }

  private buildTree(
    items: { id: string; label: string; href: string; description: string | null; parentId: string | null; order: number }[],
  ) {
    const map = new Map<string, Record<string, unknown>>();
    const roots: Record<string, unknown>[] = [];

    for (const item of items) {
      map.set(item.id, {
        id: item.id,
        label: item.label,
        href: item.href,
        description: item.description ?? undefined,
        order: item.order,
        children: [] as Record<string, unknown>[],
      });
    }

    for (const item of items) {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        (map.get(item.parentId)!.children as Record<string, unknown>[]).push(node);
      } else {
        roots.push(node);
      }
    }

    const sort = (nodes: Record<string, unknown>[]) => {
      nodes.sort((a, b) => (a.order as number) - (b.order as number));
      nodes.forEach((n) => sort(n.children as Record<string, unknown>[]));
    };
    sort(roots);
    return roots;
  }
}
