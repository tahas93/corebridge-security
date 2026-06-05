"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCmsContent, useCmsPath } from "@/providers/CmsContentProvider";

export default function Navbar() {
  const { headerMenu } = useCmsContent();
  const primaryNav = headerMenu.items;
  const brandName = useCmsPath<string>("common.brandName");
  const navCtas = useCmsPath<Record<string, string>>("navigation.ctas");
  const primaryNavAria = useCmsPath<string>("common.aria.primaryNav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink-900/10 bg-surface-100/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label={primaryNavAria}
        className="container-page flex h-16 items-center justify-between sm:h-20"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2"
          aria-label={navCtas?.sentinelHome}
        >
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight">
            {brandName}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-ink-900"
                      : "text-slate-700 hover:text-ink-900",
                  ].join(" ")}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-ink-900/5 ring-1 ring-ink-900/10"
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="btn-ghost text-xs">
            {navCtas?.clientPortal}
          </Link>
          <Link href="/contact" className="btn-primary text-xs">
            {navCtas?.bookBriefing}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-ink-900/5 text-ink-900 lg:hidden"
          aria-label={
            open ? navCtas?.closeMenu : navCtas?.openMenu
          }
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{navCtas?.toggleNav}</span>
          <div className="relative h-4 w-5">
            <span
              className={[
                "absolute left-0 top-0 h-0.5 w-5 bg-ink-900 transition-all duration-300",
                open ? "translate-y-1.5 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 top-1.5 h-0.5 w-5 bg-ink-900 transition-all duration-300",
                open ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 top-3 h-0.5 w-5 bg-ink-900 transition-all duration-300",
                open ? "-translate-y-1.5 -rotate-45" : "",
              ].join(" ")}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={[
          "lg:hidden",
          "fixed inset-x-0 top-16 z-40 origin-top transform transition-all duration-300 sm:top-20",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <div className="container-page">
          <div className="glass-strong rounded-3xl p-4 shadow-2xl">
            <ul className="flex flex-col">
              {primaryNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium",
                        active
                          ? "bg-ink-900/[0.06] text-ink-900"
                          : "text-ink-800 hover:bg-ink-900/[0.04]",
                      ].join(" ")}
                    >
                      {item.label}
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-col gap-2 px-2 pb-2">
              <Link href="/contact" className="btn-ghost w-full">
                {navCtas?.clientPortal}
              </Link>
              <Link href="/contact" className="btn-primary w-full">
                {navCtas?.bookBriefing}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
