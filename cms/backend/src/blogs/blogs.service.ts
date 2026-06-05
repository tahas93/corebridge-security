import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { publishedAt: 'desc' },
    });
  }
}
