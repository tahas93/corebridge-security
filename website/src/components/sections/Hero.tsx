'use client';

import Link from "next/link";
import CyberBackground from "@/components/visual/CyberBackground";
import Particles from "@/components/visual/Particles";
import GlowButton from "@/components/ui/GlowButton";
import DashboardIllustration from "@/components/visual/DashboardIllustration";
import {
  ArrowRightIcon,
  PlayIcon,
  ShieldIcon,
} from "@/components/icons/CyberIcons";

type HeroStat = { label: string; value: string };

type HeroData = {
  chip: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: HeroStat[];
  scrollHint: string;
};

export default function Hero({ data }: { data: Record<string, unknown> }) {
  const hero = data as HeroData;
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pb-24 pt-32 sm:pt-40 lg:pt-48"
    >
      <CyberBackground variant="hero" />
      <Particles className="opacity-80" />

      <div className="container-page relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="chip reveal">
              <ShieldIcon className="h-3.5 w-3.5 text-brand-cyan" />
              {hero.chip}
            </span>

            <h1
              id="hero-heading"
              className="reveal mt-6 font-display text-display-2xl font-bold tracking-tight text-balance"
            >
              {hero.titlePrefix}{" "}
              <span className="gradient-text">{hero.titleHighlight}</span>
            </h1>

            <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl">
              {hero.description}
            </p>

            <div className="reveal mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <GlowButton href="/contact">
                {hero.primaryCta}
                <ArrowRightIcon className="h-4 w-4" />
              </GlowButton>
              <GlowButton href="/case-studies" variant="ghost">
                <PlayIcon className="h-4 w-4 text-brand-cyan" />
                {hero.secondaryCta}
              </GlowButton>
            </div>

            <dl className="reveal mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-ink-900/10 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-600">
                  {hero.stats[0].label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink-900">
                  {hero.stats[0].value}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-600">
                  {hero.stats[1].label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink-900">
                  {hero.stats[1].value}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-slate-600">
                  {hero.stats[2].label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink-900">
                  {hero.stats[2].value}
                </dd>
              </div>
            </dl>
          </div>

          <div className="reveal lg:col-span-5">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl"
              />
              <DashboardIllustration />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative scroll hint */}
      <div className="container-page mt-20 hidden justify-center lg:flex">
        <Link
          href="#trusted"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-600 transition-colors hover:text-brand-cyan"
        >
          {hero.scrollHint}
          <span className="inline-block h-8 w-px bg-gradient-to-b from-slate-400/80 to-transparent group-hover:from-cyan-300" />
        </Link>
      </div>
    </section>
  );
}
