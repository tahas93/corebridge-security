import type { PageCategory, PageSectionType, PageStatus } from '../constants/sections';
import type { SeoMeta } from './seo';

export interface PageSection {
  id: string;
  type: PageSectionType;
  order: number;
  data: Record<string, unknown>;
  reusableSectionId?: string | null;
}

export interface PageRevision {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changeSummary?: string;
  sections: PageSection[];
  seo: SeoMeta;
}

export interface CmsPage {
  id: string;
  name: string;
  slug: string;
  status: PageStatus;
  category: PageCategory;
  author?: string;
  featuredImage?: string;
  publishDate?: string;
  seo: SeoMeta;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
