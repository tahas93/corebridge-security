import {
  AiBrainIcon,
  AlertIcon,
  BugIcon,
  ChipIcon,
  CloudIcon,
  CodeShieldIcon,
  EyeScanIcon,
  FingerprintIcon,
  LockIcon,
  RadarIcon,
  ShieldIcon,
  ZeroTrustIcon,
} from '@/components/icons/CyberIcons';
import { cmsApi } from '@/services/cms';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: IconType;
  accent: 'blue' | 'purple' | 'cyan';
};

export type SolutionItem = {
  id: string;
  title: string;
  description: string;
  tagline: string;
  outcomes: string[];
  Icon: IconType;
};

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description?: string;
};

export type Logo = { name: string; mark: string };

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type CaseStudy = {
  slug: string;
  industry: string;
  title: string;
  excerpt: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  accent: 'blue' | 'purple' | 'cyan';
};

const serviceIcons = {
  RadarIcon,
  CloudIcon,
  FingerprintIcon,
  BugIcon,
  AlertIcon,
  ShieldIcon,
} as const;

const solutionIcons = {
  ZeroTrustIcon,
  EyeScanIcon,
  LockIcon,
  ChipIcon,
  AiBrainIcon,
  CodeShieldIcon,
} as const;

type CmsService = {
  slug: string;
  title: string;
  description: string;
  bullets?: string[];
  features?: string[];
  icon?: string;
  accent?: string;
};

type CmsSolution = {
  slug: string;
  title: string;
  tagline?: string;
  overview: string;
  outcomes?: string[];
  icon?: string;
};

export async function getServices(): Promise<ServiceItem[]> {
  const items = (await cmsApi.getServices()) as CmsService[];
  return items.map((item) => ({
    id: item.slug,
    title: item.title,
    description: item.description,
    bullets: (item.bullets ?? item.features ?? []) as string[],
    Icon: serviceIcons[(item.icon as keyof typeof serviceIcons) ?? 'ShieldIcon'],
    accent: (item.accent as ServiceItem['accent']) ?? 'blue',
  }));
}

export async function getSolutions(): Promise<SolutionItem[]> {
  const items = (await cmsApi.getSolutions()) as CmsSolution[];
  return items.map((item) => ({
    id: item.slug,
    title: item.title,
    tagline: item.tagline ?? '',
    description: item.overview,
    outcomes: (item.outcomes ?? []) as string[],
    Icon: solutionIcons[(item.icon as keyof typeof solutionIcons) ?? 'ShieldIcon'],
  }));
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const items = await cmsApi.getCaseStudies();
  return (items as CaseStudy[]).map((item) => ({
    ...item,
    accent: item.accent as CaseStudy['accent'],
  }));
}

export async function getStats(): Promise<Stat[]> {
  const bundle = await cmsApi.getContentBundle();
  const datasets = (bundle.datasets ?? {}) as { stats?: Stat[] };
  return datasets.stats ?? [];
}

export async function getTrustedLogos(): Promise<Logo[]> {
  const bundle = await cmsApi.getContentBundle();
  const datasets = (bundle.datasets ?? {}) as { trustedLogos?: Logo[] };
  return datasets.trustedLogos ?? [];
}

export async function getPartnerLogos(): Promise<Logo[]> {
  const bundle = await cmsApi.getContentBundle();
  const datasets = (bundle.datasets ?? {}) as { partnerLogos?: Logo[] };
  return datasets.partnerLogos ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const bundle = await cmsApi.getContentBundle();
  const datasets = (bundle.datasets ?? {}) as { testimonials?: Testimonial[] };
  return datasets.testimonials ?? [];
}
