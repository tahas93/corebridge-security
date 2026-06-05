import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string) {
    const query = q.trim();
    if (!query) return { pages: [], blogs: [], services: [], solutions: [], menus: [], resources: [] };

    const [pages, blogs, services, solutions, menuItems, resources] = await Promise.all([
      this.prisma.page.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
      }),
      this.prisma.blogPost.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 20,
      }),
      this.prisma.service.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 20,
      }),
      this.prisma.solution.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 20,
      }),
      this.prisma.menuItem.findMany({
        where: { label: { contains: query, mode: 'insensitive' } },
        take: 20,
      }),
      this.prisma.resource.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 20,
      }),
    ]);

    return { pages, blogs, services, solutions, menus: menuItems, resources };
  }
}
