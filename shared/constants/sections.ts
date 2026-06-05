export const PAGE_SECTION_TYPES = [
  'hero',
  'trusted_by',
  'stats',
  'services_grid',
  'solutions_showcase',
  'testimonials',
  'partners',
  'cta_banner',
  'newsletter',
  'page_hero',
  'rich_text',
  'faq',
  'compliance_certifications',
  'case_studies',
  'industries',
  'contact_form',
  'custom_html',
] as const;

export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];

export const PAGE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

export const PAGE_CATEGORIES = [
  'home',
  'about',
  'services',
  'solutions',
  'compliance',
  'blog',
  'resources',
  'case_studies',
  'contact',
  'careers',
  'landing',
  'generic',
] as const;

export type PageCategory = (typeof PAGE_CATEGORIES)[number];
