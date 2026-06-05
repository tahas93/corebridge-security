import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, PageStatus, Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PagesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private audit: AuditService,
  ) {}

  private cacheKey(slug: string, preview?: boolean) {
    return preview ? `page:preview:${slug}` : `page:${slug}`;
  }

  async findAll(params: { status?: PageStatus; page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const where: Prisma.PageWhereInput = params.status ? { status: params.status } : {};
    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: { sections: { orderBy: { order: 'asc' } } },
      }),
      this.prisma.page.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findBySlug(slug: string, options?: { preview?: boolean; pageId?: string }) {
    const normalized = slug.replace(/^\/+|\/+$/g, '') || 'home';
    const cacheKey = this.cacheKey(normalized, options?.preview);

    if (!options?.preview) {
      const cached = await this.redis.get(cacheKey);
      if (cached) return cached;
    }

    let page;
    if (options?.preview && options.pageId) {
      page = await this.prisma.page.findUnique({
        where: { id: options.pageId },
        include: { sections: { orderBy: { order: 'asc' } } },
      });
    } else {
      page = await this.prisma.page.findFirst({
        where: {
          slug: normalized,
          status: options?.preview ? undefined : PageStatus.PUBLISHED,
        },
        include: { sections: { orderBy: { order: 'asc' } } },
      });
    }

    if (!page) throw new NotFoundException(`Page not found: ${normalized}`);
    const result = this.mapPage(page);
    if (!options?.preview) await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async create(data: Prisma.PageCreateInput, userId?: string) {
    const page = await this.prisma.page.create({
      data,
      include: { sections: true },
    });
    await this.audit.log({
      action: AuditAction.PAGE_CREATE,
      userId,
      entityType: 'page',
      entityId: page.id,
    });
    return this.mapPage(page);
  }

  async update(id: string, data: Prisma.PageUpdateInput, userId?: string) {
    const page = await this.prisma.page.update({
      where: { id },
      data,
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    await this.redis.invalidatePattern('page:*');
    await this.audit.log({
      action: AuditAction.PAGE_UPDATE,
      userId,
      entityType: 'page',
      entityId: id,
    });
    return this.mapPage(page);
  }

  async saveSections(
    pageId: string,
    sections: { type: string; order: number; data: Record<string, unknown>; reusableSectionId?: string }[],
    userId?: string,
  ) {
    await this.prisma.pageSection.deleteMany({ where: { pageId } });
    await this.prisma.pageSection.createMany({
      data: sections.map((s) => ({
        pageId,
        type: s.type,
        order: s.order,
        data: s.data as Prisma.InputJsonValue,
        reusableSectionId: s.reusableSectionId,
      })),
    });
    const page = await this.prisma.page.findUnique({
      where: { id: pageId },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    if (!page) throw new NotFoundException();
    await this.createRevision(page, userId, 'Section update');
    await this.redis.invalidatePattern('page:*');
    return this.mapPage(page);
  }

  async publish(id: string, userId?: string) {
    const page = await this.prisma.page.update({
      where: { id },
      data: { status: PageStatus.PUBLISHED, publishedAt: new Date() },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    await this.redis.invalidatePattern('page:*');
    await this.audit.log({
      action: AuditAction.PAGE_PUBLISH,
      userId,
      entityType: 'page',
      entityId: id,
    });
    return this.mapPage(page);
  }

  async unpublish(id: string, userId?: string) {
    const page = await this.prisma.page.update({
      where: { id },
      data: { status: PageStatus.DRAFT },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    await this.redis.invalidatePattern('page:*');
    await this.audit.log({
      action: AuditAction.PAGE_UNPUBLISH,
      userId,
      entityType: 'page',
      entityId: id,
    });
    return this.mapPage(page);
  }

  async delete(id: string, userId?: string) {
    await this.prisma.page.delete({ where: { id } });
    await this.redis.invalidatePattern('page:*');
    await this.audit.log({
      action: AuditAction.PAGE_DELETE,
      userId,
      entityType: 'page',
      entityId: id,
    });
    return { deleted: true };
  }

  async revisions(pageId: string) {
    return this.prisma.pageRevision.findMany({
      where: { pageId },
      orderBy: { version: 'desc' },
    });
  }

  async restoreRevision(pageId: string, version: number, userId?: string) {
    const rev = await this.prisma.pageRevision.findUnique({
      where: { pageId_version: { pageId, version } },
    });
    if (!rev) throw new NotFoundException('Revision not found');

    const sections = rev.sections as { type: string; order: number; data: Record<string, unknown> }[];
    await this.saveSections(pageId, sections, userId);
    const seo = rev.seoSnapshot as Record<string, unknown>;
    await this.prisma.page.update({
      where: { id: pageId },
      data: {
        seoTitle: String(seo.title ?? ''),
        seoDescription: String(seo.description ?? ''),
      },
    });

    await this.audit.log({
      action: AuditAction.REVISION_RESTORE,
      userId,
      entityType: 'page',
      entityId: pageId,
      metadata: { version },
    });
    return this.findBySlug(
      (await this.prisma.page.findUnique({ where: { id: pageId } }))!.slug,
      { preview: true, pageId },
    );
  }

  private async createRevision(
    page: { id: string; seoTitle: string; seoDescription: string; sections: { type: string; order: number; data: unknown }[] },
    userId?: string,
    changeSummary?: string,
  ) {
    const last = await this.prisma.pageRevision.findFirst({
      where: { pageId: page.id },
      orderBy: { version: 'desc' },
    });
    const version = (last?.version ?? 0) + 1;
    await this.prisma.pageRevision.create({
      data: {
        pageId: page.id,
        version,
        changeSummary,
        createdById: userId,
        sections: page.sections.map((s) => ({
          type: s.type,
          order: s.order,
          data: s.data,
        })) as Prisma.InputJsonValue,
        seoSnapshot: {
          title: page.seoTitle,
          description: page.seoDescription,
        },
      },
    });
  }

  private mapPage(page: {
    id: string;
    name: string;
    slug: string;
    status: PageStatus;
    category: string;
    featuredImage: string | null;
    publishDate: Date | null;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
    structuredData: unknown;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
    sections?: { id: string; type: string; order: number; data: unknown; reusableSectionId: string | null }[];
  }) {
    return {
      id: page.id,
      name: page.name,
      slug: page.slug,
      status: page.status,
      category: page.category,
      featuredImage: page.featuredImage,
      publishDate: page.publishDate?.toISOString(),
      seo: {
        title: page.seoTitle,
        description: page.seoDescription,
        keywords: page.seoKeywords,
        canonicalUrl: page.canonicalUrl,
        ogTitle: page.ogTitle,
        ogDescription: page.ogDescription,
        ogImage: page.ogImage,
        twitterTitle: page.twitterTitle,
        twitterDescription: page.twitterDescription,
        twitterImage: page.twitterImage,
        structuredData: page.structuredData,
      },
      sections: (page.sections ?? []).map((s) => ({
        id: s.id,
        type: s.type,
        order: s.order,
        data: s.data,
        reusableSectionId: s.reusableSectionId,
      })),
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
      publishedAt: page.publishedAt?.toISOString(),
    };
  }
}
