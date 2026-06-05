import { unstable_cache } from 'next/cache';
import { cmsApi } from '@/services/cms';

export type SiteContent = Record<string, unknown>;

export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const bundle = await cmsApi.getContentBundle();
    return bundle as SiteContent;
  },
  ['site-content-bundle'],
  { revalidate: 60 },
);

export const getSiteSettings = unstable_cache(
  async () => cmsApi.getSettings(),
  ['site-settings'],
  { revalidate: 60 },
);

export const getHeaderMenu = unstable_cache(
  async () => cmsApi.getMenu('header'),
  ['menu-header'],
  { revalidate: 60 },
);

export const getFooterMenu = unstable_cache(
  async () => cmsApi.getMenu('footer'),
  ['menu-footer'],
  { revalidate: 60 },
);

export const getCmsDatasets = unstable_cache(
  async () => {
    const bundle = await getSiteContent();
    return (bundle.datasets ?? {}) as Record<string, unknown>;
  },
  ['cms-datasets'],
  { revalidate: 60 },
);
