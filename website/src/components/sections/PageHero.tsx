'use client';

import Link from "next/link";
import CyberBackground from "@/components/visual/CyberBackground";
import { useContent } from "@/lib/content-client";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: Props) {
  const content = useContent() as Record<string, any>;
  const resolvedCrumbs = crumbs ?? [{ label: content.common.homeLabel as string, href: "/" }];
  return (
    <section
      aria-labelledby="page-hero-heading"
      className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-40"
    >
      <CyberBackground variant="section" />
      <div className="container-page relative">
        <nav
          aria-label={content.common.aria.breadcrumb}
          className="reveal text-xs uppercase tracking-[0.18em] text-slate-600"
        >
          <ol className="flex flex-wrap items-center gap-2">
            {resolvedCrumbs.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink-900">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-slate-500">{c.label}</span>
                )}
                {i < resolvedCrumbs.length - 1 && (
                  <span aria-hidden>{content.tooltips.breadcrumbSeparator}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 max-w-3xl">
          <span className="eyebrow reveal">{eyebrow}</span>
          <h1
            id="page-hero-heading"
            className="reveal mt-5 font-display text-display-xl font-bold tracking-tight text-balance"
          >
            {title}
          </h1>
          {description && (
            <p className="reveal mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="reveal mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
