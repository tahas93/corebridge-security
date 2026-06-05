'use client';

import Link from "next/link";
import CyberBackground from "@/components/visual/CyberBackground";
import GlowButton from "@/components/ui/GlowButton";
import { ArrowRightIcon } from "@/components/icons/CyberIcons";
import { useContent } from "@/lib/content-client";

export default function NotFound() {
  const content = useContent() as Record<string, any>;
  return (
    <section className="relative isolate overflow-hidden pb-32 pt-40">
      <CyberBackground variant="hero" />
      <div className="container-page text-center">
        <span className="eyebrow">{content.errors.notFound.eyebrow}</span>
        <h1 className="mt-6 font-display text-display-2xl font-bold tracking-tight">
          {content.errors.notFound.titlePrefix}{" "}
          <span className="gradient-text">{content.errors.notFound.titleHighlight}</span>
          {content.errors.notFound.titleSuffix}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
          {content.errors.notFound.description}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <GlowButton href="/">
            {content.errors.notFound.backHome}
            <ArrowRightIcon className="h-4 w-4" />
          </GlowButton>
          <Link href="/contact" className="btn-ghost">
            {content.errors.notFound.contactSupport}
          </Link>
        </div>
      </div>
    </section>
  );
}
