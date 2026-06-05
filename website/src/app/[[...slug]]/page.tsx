import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SectionRenderer from '@/components/cms/SectionRenderer';
import JsonLd from '@/components/seo/JsonLd';
import { cmsApi } from '@/services/cms';
import { getSiteConfig } from '@/lib/site';

type PageProps = {
  params: { slug?: string[] };
};

function resolveSlug(slug?: string[]) {
  if (!slug?.length) return 'home';
  return slug.join('/');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const page = (await cmsApi.getPage(resolveSlug(params.slug))) as {
      seo: { title: string; description: string; keywords?: string[] };
    };
    return {
      title: page.seo.title,
      description: page.seo.description,
      keywords: page.seo.keywords,
    };
  } catch {
    return { title: 'Page Not Found' };
  }
}

export default async function CmsPage({ params }: PageProps) {
  const slug = resolveSlug(params.slug);

  try {
    const page = (await cmsApi.getPage(slug)) as {
      id: string;
      name: string;
      sections: { id: string; type: string; order: number; data: Record<string, unknown> }[];
      seo: { structuredData?: Record<string, unknown> };
    };
    const siteConfig = await getSiteConfig();

    return (
      <>
        {page.seo.structuredData && <JsonLd data={page.seo.structuredData} />}
        {slug === 'home' && (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/favicon.svg`,
              email: siteConfig.email,
              telephone: siteConfig.phone,
              sameAs: Object.values(siteConfig.social),
              description: siteConfig.description,
            }}
          />
        )}
        <SectionRenderer sections={page.sections} />
      </>
    );
  } catch {
    notFound();
  }
}
