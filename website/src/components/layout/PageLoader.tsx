'use client';

"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useContent } from "@/lib/content-client";

export default function PageLoader() {
  const content = useContent() as Record<string, any>;
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 650);
    const h = window.setTimeout(() => setHide(true), 1300);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(h);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      aria-hidden
      className={[
        "fixed inset-0 z-[60] flex items-center justify-center bg-surface-50 transition-opacity duration-500",
        done ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <span className="absolute inset-0 -z-10 animate-ring rounded-full bg-brand-cyan/30" />
          <span className="absolute inset-0 -z-10 animate-ring rounded-full bg-brand-purple/30 [animation-delay:600ms]" />
          <div className="rounded-full bg-surface-100 p-4 shadow-glow">
            <Logo className="h-10 w-10" />
          </div>
        </div>
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-ink-900/10">
          <div className="h-full w-full origin-left animate-[fadeIn_0.6s_ease-out_both] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan [background-size:200%_100%] [animation:shimmer_1.6s_linear_infinite]" />
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-600">
          {content.common.loading.pageLoader}
        </p>
      </div>
    </div>
  );
}
