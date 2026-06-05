import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async get() {
    const cached = await this.redis.get('settings');
    if (cached) return cached;

    let settings = await this.prisma.siteSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          id: 'default',
          companyName: 'Sentinel',
          tagline: 'Enterprise Cybersecurity',
          description: '',
          url: 'https://example.com',
          email: 'contact@example.com',
          phone: '',
          address: '',
          social: {},
        },
      });
    }
    const result = this.map(settings);
    await this.redis.set('settings', result, 600);
    return result;
  }

  async update(data: Prisma.SiteSettingsUpdateInput) {
    const settings = await this.prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        companyName: String(data.companyName ?? 'Sentinel'),
        tagline: String(data.tagline ?? ''),
        description: String(data.description ?? ''),
        url: String(data.url ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        address: String(data.address ?? ''),
        social: (data.social as Prisma.InputJsonValue) ?? {},
      },
      update: data,
    });
    await this.redis.del('settings');
    return this.map(settings);
  }

  private map(s: {
    companyName: string;
    tagline: string;
    description: string;
    url: string;
    email: string;
    phone: string;
    address: string;
    supportEmail: string | null;
    salesEmail: string | null;
    social: unknown;
    announcementBar: string | null;
    securityAlertBanner: string | null;
    logoUrl: string | null;
    footerCopyright: string | null;
    certifications: unknown;
    complianceBadges: unknown;
  }) {
    return {
      companyName: s.companyName,
      tagline: s.tagline,
      description: s.description,
      url: s.url,
      email: s.email,
      phone: s.phone,
      address: s.address,
      supportEmail: s.supportEmail,
      salesEmail: s.salesEmail,
      social: s.social,
      announcementBar: s.announcementBar,
      securityAlertBanner: s.securityAlertBanner,
      logoUrl: s.logoUrl,
      footerCopyright: s.footerCopyright,
      certifications: s.certifications,
      complianceBadges: s.complianceBadges,
    };
  }
}
