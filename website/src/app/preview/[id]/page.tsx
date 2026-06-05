import SectionRenderer from '@/components/cms/SectionRenderer';
import { cmsApi } from '@/services/cms';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const page = (await cmsApi.getPage('home', {
    preview: true,
    pageId: params.id,
  })) as {
    sections: { id: string; type: string; order: number; data: Record<string, unknown> }[];
  };

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-20 z-[60] bg-amber-500/90 py-2 text-center text-sm font-semibold text-ink-900">
        Preview mode — unpublished content
      </div>
      <SectionRenderer sections={page.sections} />
    </div>
  );
}
