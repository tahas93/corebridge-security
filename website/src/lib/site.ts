import { getHeaderMenu, getSiteContent, getSiteSettings } from './cms-loader';

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export async function getSiteConfig() {
  const settings = (await getSiteSettings()) as Record<string, unknown>;
  return {
    name: settings.companyName as string,
    tagline: settings.tagline as string,
    description: settings.description as string,
    url: settings.url as string,
    email: settings.email as string,
    phone: settings.phone as string,
    address: settings.address as string,
    social: settings.social as Record<string, string>,
  } as const;
}

export async function getPrimaryNav(): Promise<NavItem[]> {
  const menu = (await getHeaderMenu()) as { items: NavItem[] };
  return flattenMenu(menu.items);
}

function flattenMenu(items: NavItem[]): NavItem[] {
  return items.map(({ label, href, description }) => ({ label, href, description }));
}

export async function getContentSiteSeo() {
  const content = await getSiteContent();
  const site = (content.site ?? {}) as Record<string, unknown>;
  return (site.seo ?? {}) as Record<string, unknown>;
}
