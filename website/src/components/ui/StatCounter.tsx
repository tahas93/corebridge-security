"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  label: string;
  description?: string;
};

export default function StatCounter({
  value,
  suffix,
  prefix,
  duration = 1800,
  decimals = 0,
  label,
  description,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={ref} className="reveal">
      <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="gradient-text">
          {prefix}
          {formatted}
          {suffix}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
        {label}
      </p>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}
    </div>
  );
}
