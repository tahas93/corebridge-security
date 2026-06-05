import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/icons/CyberIcons";
import { getCmsPath } from "@/lib/cms-path";
import { getSiteContent } from "@/lib/cms-loader";
import { getSolutions } from "@/lib/data";

export default async function SolutionsShowcase() {
  const content = await getSiteContent();
  const copy = getCmsPath<Record<string, string>>(content, "home.solutions");
  const solutions = await getSolutions();

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="section relative bg-surface-50/60"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titlePrefix}{" "}
              <span className="gradient-text">{copy.titleHighlight}</span>
              {copy.titleSuffix}
            </>
          }
          description={copy.description}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {solutions.map((item) => {
            const Icon = item.Icon;
            return (
              <article
                key={item.id}
                className="card reveal group relative overflow-hidden"
              >
                <div className="flex items-start gap-5">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-900/[0.04] text-brand-purple">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
                      {item.tagline}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.outcomes.map((o) => (
                        <li
                          key={o}
                          className="rounded-full bg-ink-900/[0.04] px-3 py-1 text-xs text-slate-700"
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/solutions#${item.id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan"
                    >
                      {copy.linkLabel}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
