export interface ServiceModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  pricingInfo?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: string;
  accent?: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface SolutionModule {
  id: string;
  slug: string;
  title: string;
  overview: string;
  features: string[];
  industries: string[];
  benefits: string[];
  tagline?: string;
  icon?: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export interface ComplianceModule {
  id: string;
  framework: string;
  slug: string;
  overview: string;
  requirements: string[];
  benefits: string[];
  status: 'DRAFT' | 'PUBLISHED';
}

export interface CaseStudyModule {
  id: string;
  slug: string;
  industry: string;
  title: string;
  excerpt: string;
  challenge: string;
  solution: string;
  results: string;
  testimonial?: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author?: string;
  category?: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  status: 'DRAFT' | 'PUBLISHED';
  seo?: Record<string, unknown>;
}

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  type: 'whitepaper' | 'advisory' | 'report' | 'news';
  excerpt: string;
  downloadUrl?: string;
  status: 'DRAFT' | 'PUBLISHED';
}
