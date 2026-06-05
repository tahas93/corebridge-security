import '../src/config/resolve-env';
import { PrismaClient, PageStatus, ContentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PERMISSIONS, ROLE_PERMISSIONS, ROLES } from '@corebridge/shared';

const prisma = new PrismaClient();

function loadJson(relativePath: string) {
  const paths = [
    join(__dirname, '../../../website/src/content', relativePath),
    join(__dirname, '../../../../website/src/content', relativePath),
  ];
  for (const p of paths) {
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf-8'));
  }
  throw new Error(`Missing seed file: ${relativePath}`);
}

function flattenContent(obj: Record<string, unknown>, prefix = ''): { key: string; value: unknown }[] {
  const entries: { key: string; value: unknown }[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      entries.push(...flattenContent(v as Record<string, unknown>, key));
    } else {
      entries.push({ key, value: v });
    }
  }
  return entries;
}

async function seedRoles() {
  const permissions = Object.values(PERMISSIONS);
  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      create: { key, description: key },
      update: {},
    });
  }

  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      create: { name: roleName, description: roleName },
      update: {},
    });
    const permissionRecords = await prisma.permission.findMany({
      where: { key: { in: perms } },
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: permissionRecords.map((p) => ({ roleId: role.id, permissionId: p.id })),
    });
  }
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@corebridge.security';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!Secure123';
  const role = await prisma.role.findUnique({ where: { name: ROLES.SUPER_ADMIN } });
  if (!role) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: 'Super Admin',
      passwordHash,
      roles: { create: [{ roleId: role.id }] },
    },
    update: { passwordHash },
  });
}

async function seedContentEntries() {
  const commonBundle = loadJson('common.json');
  const header = loadJson('header.json');
  const home = loadJson('home.json');
  const pages = loadJson('pages.json');
  const footer = loadJson('footer.json');
  const forms = loadJson('forms.json');
  const errors = loadJson('errors.json');
  const datasets = loadJson('datasets.json');
  const tooltips = loadJson('tooltips.json');

  const bundles = {
    'common.brandName': commonBundle.common?.brandName ?? commonBundle,
    'common.language': commonBundle.common?.language,
    'common.skipToContent': commonBundle.common?.skipToContent,
    'common.homeLabel': commonBundle.common?.homeLabel,
    'common.aria': commonBundle.common?.aria,
    'common.loading': commonBundle.common?.loading,
    'common.status': commonBundle.common?.status,
    site: commonBundle.site,
    navigation: header,
    home,
    pages,
    forms,
    footer,
    errors,
    datasets,
    tooltips,
  };

  for (const [key, value] of Object.entries(bundles)) {
    if (value === undefined) continue;
    await prisma.contentEntry.upsert({
      where: { key },
      create: { key, value: value as never },
      update: { value: value as never },
    });
  }
}

async function seedSettings() {
  const commonBundle = loadJson('common.json');
  const site = commonBundle.site;
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      companyName: commonBundle.common?.brandName ?? 'Sentinel',
      tagline: site.tagline,
      description: site.description,
      url: site.url,
      email: site.email,
      phone: site.phone,
      address: site.address,
      social: site.social,
      seo: site.seo,
    },
    update: {
      companyName: commonBundle.common?.brandName ?? 'Sentinel',
      tagline: site.tagline,
      description: site.description,
      url: site.url,
      email: site.email,
      phone: site.phone,
      address: site.address,
      social: site.social,
    },
  });
}

async function seedMenus() {
  const header = loadJson('header.json');
  await prisma.menu.upsert({
    where: { key: 'header' },
    create: { key: 'header', name: 'Header Navigation' },
    update: {},
  });
  const menu = await prisma.menu.findUnique({ where: { key: 'header' } });
  if (!menu) return;
  await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
  await prisma.menuItem.createMany({
    data: (header.primary as { label: string; href: string; description?: string }[]).map(
      (item, order) => ({
        menuId: menu.id,
        label: item.label,
        href: item.href,
        description: item.description,
        order,
      }),
    ),
  });

  const footer = loadJson('footer.json');
  await prisma.menu.upsert({
    where: { key: 'footer' },
    create: { key: 'footer', name: 'Footer Navigation' },
    update: {},
  });
  const footerMenu = await prisma.menu.findUnique({ where: { key: 'footer' } });
  if (footerMenu && footer.columns) {
    await prisma.menuItem.deleteMany({ where: { menuId: footerMenu.id } });
    let order = 0;
    for (const col of footer.columns as { title: string; links: { label: string; href: string }[] }[]) {
      for (const link of col.links) {
        await prisma.menuItem.create({
          data: {
            menuId: footerMenu.id,
            label: link.label,
            href: link.href,
            description: col.title,
            order: order++,
          },
        });
      }
    }
  }
}

async function seedServicesAndSolutions() {
  const datasets = loadJson('datasets.json');
  for (const [index, s] of (datasets.services as Record<string, unknown>[]).entries()) {
    await prisma.service.upsert({
      where: { slug: String(s.id) },
      create: {
        slug: String(s.id),
        title: String(s.title),
        description: String(s.description),
        features: s.bullets ?? [],
        benefits: [],
        bullets: s.bullets ?? [],
        icon: String(s.icon ?? ''),
        accent: String(s.accent ?? 'blue'),
        status: ContentStatus.PUBLISHED,
        order: index,
      },
      update: {
        title: String(s.title),
        description: String(s.description),
        features: s.bullets ?? [],
        bullets: s.bullets ?? [],
        status: ContentStatus.PUBLISHED,
        order: index,
      },
    });
  }

  for (const [index, s] of (datasets.solutions as Record<string, unknown>[]).entries()) {
    await prisma.solution.upsert({
      where: { slug: String(s.id) },
      create: {
        slug: String(s.id),
        title: String(s.title),
        tagline: String(s.tagline ?? ''),
        overview: String(s.description),
        features: [],
        industries: [],
        benefits: [],
        outcomes: s.outcomes ?? [],
        icon: String(s.icon ?? ''),
        status: ContentStatus.PUBLISHED,
        order: index,
      },
      update: {
        title: String(s.title),
        overview: String(s.description),
        outcomes: s.outcomes ?? [],
        status: ContentStatus.PUBLISHED,
        order: index,
      },
    });
  }

  for (const cs of datasets.caseStudies as Record<string, unknown>[]) {
    await prisma.caseStudy.upsert({
      where: { slug: String(cs.slug) },
      create: {
        slug: String(cs.slug),
        industry: String(cs.industry),
        title: String(cs.title),
        excerpt: String(cs.excerpt),
        challenge: String(cs.excerpt),
        solution: String(cs.excerpt),
        results: String(cs.excerpt),
        metrics: cs.metrics ?? [],
        tags: (cs.tags as string[]) ?? [],
        accent: String(cs.accent ?? 'blue'),
        status: ContentStatus.PUBLISHED,
      },
      update: { status: ContentStatus.PUBLISHED },
    });
  }
}

async function seedPages() {
  const pages = loadJson('pages.json');
  const home = loadJson('home.json');

  const staticPages = [
    { slug: 'home', name: 'Home', category: 'home', seo: pages.home?.metadata ?? { title: 'Home', description: '' } },
    { slug: 'about', name: 'About', category: 'about', seo: pages.about?.metadata },
    { slug: 'services', name: 'Services', category: 'services', seo: pages.services?.metadata },
    { slug: 'solutions', name: 'Solutions', category: 'solutions', seo: pages.solutions?.metadata },
    { slug: 'case-studies', name: 'Case Studies', category: 'case_studies', seo: pages.caseStudies?.metadata },
    { slug: 'contact', name: 'Contact', category: 'contact', seo: pages.contact?.metadata },
  ];

  for (const p of staticPages) {
    const meta = p.seo ?? { title: p.name, description: '' };
    const page = await prisma.page.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        status: PageStatus.PUBLISHED,
        publishedAt: new Date(),
        seoTitle: meta.title,
        seoDescription: meta.description,
        seoKeywords: meta.keywords ?? [],
      },
      update: {
        status: PageStatus.PUBLISHED,
        seoTitle: meta.title,
        seoDescription: meta.description,
      },
    });

    if (p.slug === 'home') {
      await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
      const sections = [
        { type: 'hero', order: 0, data: home.hero },
        { type: 'trusted_by', order: 1, data: home.trustedBy },
        { type: 'stats', order: 2, data: home.stats },
        { type: 'services_grid', order: 3, data: home.services },
        { type: 'solutions_showcase', order: 4, data: home.solutions },
        { type: 'testimonials', order: 5, data: home.testimonials },
        { type: 'partners', order: 6, data: home.partners },
        { type: 'cta_banner', order: 7, data: home.ctaBanner ?? {} },
        { type: 'newsletter', order: 8, data: home.newsletter },
      ];
      await prisma.pageSection.createMany({
        data: sections.map((s) => ({
          pageId: page.id,
          type: s.type,
          order: s.order,
          data: s.data as never,
        })),
      });
    }
  }
}

async function main() {
  await seedRoles();
  await seedAdmin();
  await seedSettings();
  await seedContentEntries();
  await seedMenus();
  await seedServicesAndSolutions();
  await seedPages();
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
