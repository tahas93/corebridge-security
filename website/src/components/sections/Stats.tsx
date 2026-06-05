import StatCounter from "@/components/ui/StatCounter";
import { getStats } from "@/lib/data";
import { getCmsPath } from "@/lib/cms-path";
import { getSiteContent } from "@/lib/cms-loader";

export default async function Stats() {
  const content = await getSiteContent();
  const heading = getCmsPath<string>(content, "home.stats.heading");
  const stats = await getStats();

  return (
    <section aria-labelledby="stats-heading" className="section relative">
      <div className="container-page">
        <h2 id="stats-heading" className="sr-only">
          {heading}
        </h2>
        <div className="gradient-border-soft relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18),_transparent_60%)]"
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCounter
                key={s.label}
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                label={s.label}
                description={s.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
