'use client';

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { useCmsContent, useContent } from "@/providers/CmsContentProvider";

const socialIcons = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.4h4.56V24H.22zM8.06 8.4h4.36v2.13h.06c.61-1.16 2.11-2.39 4.34-2.39 4.64 0 5.5 3.05 5.5 7.02V24h-4.55v-7.06c0-1.68-.03-3.85-2.34-3.85-2.34 0-2.7 1.83-2.7 3.72V24H8.06z" />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.828l-4.77-6.235L4.8 22H2l7.02-8.02L2 2h6.914l4.36 5.78L18.244 2zm-2.39 18h1.86L8.252 4H6.27l9.585 16z" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  ),
} as const;

export default function Footer() {
  const content = useContent() as Record<string, any>;
  const { settings } = useCmsContent();
  const footer = content.footer as Record<string, any>;
  const columns = footer.columns as { title: string; links: { label: string; href: string }[] }[];
  const social = settings.social as Record<string, string>;

  const socialLinks = {
    LinkedIn: social?.linkedin,
    Twitter: social?.twitter,
    GitHub: social?.github,
    YouTube: social?.youtube,
  } as const;

  const socials = (footer.socials as string[]).map((label) => ({
    label,
    href: socialLinks[label as keyof typeof socialLinks] ?? "#",
    icon: socialIcons[label as keyof typeof socialIcons],
  }));

  return (
    <footer className="relative mt-24 border-t border-ink-900/10 bg-surface-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent"
      />
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Logo className="h-9 w-9" />
              <span className="font-display text-xl font-bold tracking-tight">
                {settings.companyName as string}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
              {settings.description as string}
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p>{settings.address as string}</p>
              <p>
                <a href={`mailto:${settings.email}`} className="link-muted">
                  {settings.email as string}
                </a>
                <span className="mx-2 text-slate-600">{footer.symbols.contactSeparator}</span>
                <a href={`tel:${settings.phone}`} className="link-muted">
                  {settings.phone as string}
                </a>
              </p>
            </div>

            <ul className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-ink-900/5 text-slate-700 transition-all hover:border-brand-cyan/50 hover:text-brand-cyan"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="link-muted">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink-900/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {settings.companyName as string}, Inc.{" "}
            {footer.legal.allRightsReserved}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="#" className="link-muted">
                {footer.legal.privacy}
              </Link>
            </li>
            <li>
              <Link href="#" className="link-muted">
                {footer.legal.terms}
              </Link>
            </li>
            <li>
              <Link href="#" className="link-muted">
                {footer.legal.cookies}
              </Link>
            </li>
            <li>
              <Link href="#" className="link-muted">
                {footer.legal.responsibleDisclosure}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
              {footer.legal.compliance}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
