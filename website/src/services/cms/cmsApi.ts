const CMS_API_URL =
  process.env.CMS_API_URL ??
  process.env.NEXT_PUBLIC_CMS_API_URL ??
  'http://localhost:4000/api';

const REVALIDATE = parseInt(process.env.CMS_REVALIDATE_SECONDS ?? '60', 10);

type FetchOptions = {
  preview?: boolean;
  pageId?: string;
  cache?: RequestCache;
};

async function cmsFetch<T>(path: string, options?: FetchOptions): Promise<T> {
  const url = new URL(path.replace(/^\//, ''), CMS_API_URL.endsWith('/') ? CMS_API_URL : `${CMS_API_URL}/`);
  if (options?.preview) {
    url.searchParams.set('preview', 'true');
    if (options.pageId) url.searchParams.set('id', options.pageId);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: options?.preview ? 0 : REVALIDATE },
      cache: options?.preview ? 'no-store' : options?.cache,
    });

    if (!res.ok) {
      throw new Error(`CMS API error ${res.status}: ${path}`);
    }
    return res.json() as Promise<T>;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' && process.env.CMS_BUILD_FALLBACK !== 'false') {
      console.warn(`[cms] Unavailable (${path}), using empty fallback. Start CMS API for live content.`);
      return {} as T;
    }
    throw error;
  }
}

export const cmsApi = {
  getPage(slug: string, options?: FetchOptions) {
    const normalized = slug.replace(/^\/+|\/+$/g, '') || 'home';
    return cmsFetch(`/pages/slug/${normalized}`, options);
  },

  getPages() {
    return cmsFetch<{ data: unknown[] }>('/pages');
  },

  getMenu(key: string) {
    return cmsFetch(`/menu/${key}`);
  },

  getSettings() {
    return cmsFetch('/settings');
  },

  getServices() {
    return cmsFetch('/services');
  },

  getSolutions() {
    return cmsFetch('/solutions');
  },

  getBlogs() {
    return cmsFetch('/blogs');
  },

  getCaseStudies() {
    return cmsFetch('/case-studies');
  },

  getContent(key: string) {
    return cmsFetch(`/content/${key.replace(/\./g, '/')}`);
  },

  getContentBundle() {
    return cmsFetch<Record<string, unknown>>('/content/bundle');
  },

  getCompliance() {
    return cmsFetch('/compliance');
  },

  getResources() {
    return cmsFetch('/resources');
  },
};

export type CmsApi = typeof cmsApi;
