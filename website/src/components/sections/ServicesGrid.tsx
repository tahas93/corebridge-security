import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon, CheckIcon } from "@/components/icons/CyberIcons";
import { getCmsPath } from "@/lib/cms-path";
import { getSiteContent } from "@/lib/cms-loader";
import { getServices } from "@/lib/data";

const accentMap = {
  blue: "from-brand-blue/30 to-brand-blue/0 text-brand-blue",
  purple: "from-brand-purple/30 to-brand-purple/0 text-brand-purple",
  cyan: "from-brand-cyan/30 to-brand-cyan/0 text-brand-cyan",
} as const;

export default async function ServicesGrid() {
  const content = await getSiteContent();
  const copy = getCmsPath<Record<string, string>>(content, "home.services");
  const services = await getServices();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent"
      />
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

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.Icon;
            return (
              <article
                key={service.id}
                className="card group reveal flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={[
                      "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br",
                      accentMap[service.accent],
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {copy.serviceLabel}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {service.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan transition-colors hover:text-brand-blue"
                >
                  {copy.linkLabel}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
