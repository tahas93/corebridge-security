'use client';

import GlowButton from "@/components/ui/GlowButton";
import { ArrowRightIcon } from "@/components/icons/CyberIcons";
export default function CtaBanner({ data }: { data: Record<string, unknown> }) {
  const cta = data as Record<string, string>;
  return (
    <section className="section relative" aria-labelledby="cta-heading">
      <div className="container-page">
        <div className="gradient-border relative overflow-hidden rounded-3xl bg-surface-100 p-10 sm:p-14 lg:p-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 grid-bg opacity-50 mask-fade-b"
          />
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-purple/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-cyan/30 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="chip">{cta.chip}</span>
              <h2
                id="cta-heading"
                className="reveal mt-4 font-display text-display-lg font-bold tracking-tight text-balance"
              >
                {cta.headingPrefix}{" "}
                <span className="gradient-text">{cta.headingHighlight}</span>
              </h2>
              <p className="reveal mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                {cta.description}
              </p>
            </div>
            <div className="reveal flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <GlowButton href="/contact">
                {cta.primaryCta}
                <ArrowRightIcon className="h-4 w-4" />
              </GlowButton>
              <GlowButton href="/case-studies" variant="outline">
                {cta.secondaryCta}
              </GlowButton>
              <p className="text-xs text-slate-600">
                {cta.helper}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
