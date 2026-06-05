import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Stats from '@/components/sections/Stats';
import ServicesGrid from '@/components/sections/ServicesGrid';
import SolutionsShowcase from '@/components/sections/SolutionsShowcase';
import Testimonials from '@/components/sections/Testimonials';
import Partners from '@/components/sections/Partners';
import CtaBanner from '@/components/sections/CtaBanner';
import Newsletter from '@/components/sections/Newsletter';

type Section = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

async function renderSection(section: Section) {
  const data = section.data;
  switch (section.type) {
    case 'hero':
      return <Hero key={section.id} data={data} />;
    case 'trusted_by':
      return <TrustedBy key={section.id} data={data} />;
    case 'stats':
      return <Stats key={section.id} data={data} />;
    case 'services_grid':
      return <ServicesGrid key={section.id} data={data} />;
    case 'solutions_showcase':
      return <SolutionsShowcase key={section.id} data={data} />;
    case 'testimonials':
      return <Testimonials key={section.id} data={data} />;
    case 'partners':
      return <Partners key={section.id} data={data} />;
    case 'cta_banner':
      return <CtaBanner key={section.id} data={data} />;
    case 'newsletter':
      return <Newsletter key={section.id} data={data} />;
    case 'rich_text':
      return (
        <section key={section.id} className="section">
          <div
            className="container-page prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: String(section.data.body ?? '') }}
          />
        </section>
      );
    default:
      return null;
  }
}

export default async function SectionRenderer({ sections }: { sections: Section[] }) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const rendered = await Promise.all(sorted.map((section) => renderSection(section)));
  return <>{rendered}</>;
}
