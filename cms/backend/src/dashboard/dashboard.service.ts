import { Injectable } from '@nestjs/common';
import { PageStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async stats() {
    const [
      totalPages,
      publishedPages,
      draftPages,
      menus,
      mediaFiles,
      blogPosts,
      caseStudies,
      securityServices,
      recentPages,
      recentAudit,
    ] = await Promise.all([
      this.prisma.page.count(),
      this.prisma.page.count({ where: { status: PageStatus.PUBLISHED } }),
      this.prisma.page.count({ where: { status: PageStatus.DRAFT } }),
      this.prisma.menu.count(),
      this.prisma.mediaAsset.count(),
      this.prisma.blogPost.count(),
      this.prisma.caseStudy.count(),
      this.prisma.service.count(),
      this.prisma.page.findMany({ take: 5, orderBy: { updatedAt: 'desc' }, select: { id: true, name: true, updatedAt: true } }),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return {
      totalPages,
      publishedPages,
      draftPages,
      menus,
      mediaFiles,
      blogPosts,
      caseStudies,
      securityServices,
      recentUpdates: recentPages.map((p) => ({
        id: p.id,
        type: 'page',
        title: p.name,
        at: p.updatedAt.toISOString(),
      })),
      userActivity: recentAudit.map((a) => ({
        id: a.id,
        action: a.action,
        user: a.user?.name ?? a.user?.email ?? 'System',
        at: a.createdAt.toISOString(),
      })),
    };
  }
}
