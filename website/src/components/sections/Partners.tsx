import SectionHeading from "@/components/ui/SectionHeading";
import { getCmsPath } from "@/lib/cms-path";
import { getSiteContent } from "@/lib/cms-loader";
import { getPartnerLogos } from "@/lib/data";

export default async function Partners() {
  const content = await getSiteContent();
  const copy = getCmsPath<Record<string, string>>(content, "home.partners");
  const partnerLogos = await getPartnerLogos();

  return (
    <section
      aria-labelledby="partners-heading"
      className="section relative bg-surface-50/60"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titlePrefix}{" "}
              <span className="gradient-text">{copy.titleHighlight}</span>
            </>
          }
          description={copy.description}
        />
        <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {partnerLogos.map((logo) => (
            <li
              key={logo.name}
              className="flex h-20 items-center justify-center rounded-2xl border border-ink-900/5 bg-surface-100/50 font-display text-sm font-bold tracking-[0.14em] text-slate-600"
            >
              {logo.mark}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
