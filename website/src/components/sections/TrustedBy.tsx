import { getTrustedLogos } from "@/lib/data";

export default async function TrustedBy({ data }: { data: Record<string, unknown> }) {
  const heading = String(data.heading ?? "");
  const trustedLogos = await getTrustedLogos();
  const loop = [...trustedLogos, ...trustedLogos];

  return (
    <section
      id="trusted"
      aria-labelledby="trusted-heading"
      className="relative border-y border-ink-900/5 bg-surface-50/60 py-12"
    >
      <div className="container-page">
        <h2
          id="trusted-heading"
          className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
        >
          {heading}
        </h2>

        <div className="relative mt-8 overflow-hidden mask-fade-x">
          <ul className="flex w-max items-center gap-12 animate-marquee" aria-hidden>
            {loop.map((logo, idx) => (
              <li key={`${logo.name}-${idx}`} className="flex shrink-0 items-center">
                <span className="font-display text-xl font-bold tracking-[0.18em] text-slate-600/80 transition-colors hover:text-ink-900">
                  {logo.mark}
                </span>
              </li>
            ))}
          </ul>
          <ul className="sr-only">
            {trustedLogos.map((logo) => (
              <li key={logo.name}>{logo.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
