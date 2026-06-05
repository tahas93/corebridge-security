'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { QuoteIcon } from "@/components/icons/CyberIcons";
import type { Testimonial } from "@/lib/data";

type Props = {
  testimonials: Testimonial[];
  copy: Record<string, string>;
  carouselAria: string;
};

export default function TestimonialsCarousel({ testimonials, copy, carouselAria }: Props) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const timer = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => go(index + 1), 6500);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [index, paused, go]);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titlePrefix}{" "}
              <span className="gradient-text">{copy.titleHighlight}</span> {copy.titleSuffix}
            </>
          }
        />

        <div
          className="relative mx-auto mt-14 max-w-4xl"
          aria-roledescription="carousel"
          aria-label={carouselAria}
        >
          <div className="gradient-border-soft relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <QuoteIcon
              className="absolute -right-6 -top-6 h-32 w-32 text-ink-900/[0.05]"
              aria-hidden
            />
            <div className="relative min-h-[220px]">
              {testimonials.map((t, i) => (
                <figure
                  key={t.name}
                  aria-hidden={i !== index}
                  className={[
                    "absolute inset-0 transition-all duration-700 ease-out",
                    i === index
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0",
                  ].join(" ")}
                >
                  <blockquote className="font-display text-xl leading-relaxed text-ink-900 sm:text-2xl">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4">
                    <span
                      aria-hidden
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-bold text-white shadow-glow"
                    >
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                      <p className="text-xs text-slate-600">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-ink-900/[0.04] text-ink-900 transition-colors hover:bg-ink-900/[0.08]"
              aria-label={copy.previousAria}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <div className="flex items-center gap-2" role="tablist">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${copy.dotAriaPrefix} ${i + 1}`}
                  onClick={() => go(i)}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-8 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan"
                      : "w-3 bg-ink-900/15 hover:bg-ink-900/30",
                  ].join(" ")}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-ink-900/[0.04] text-ink-900 transition-colors hover:bg-ink-900/[0.08]"
              aria-label={copy.nextAria}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
