'use client';

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons/CyberIcons";

export default function Newsletter({ data }: { data: Record<string, unknown> }) {
  const newsletter = data as Record<string, string>;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage(newsletter.invalidEmail);
      return;
    }
    setStatus("loading");
    setMessage("");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
    setMessage(
      newsletter.successMessage
    );
    setEmail("");
  };

  return (
    <section
      className="section relative"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-page">
        <div className="gradient-border-soft mx-auto max-w-4xl rounded-3xl bg-surface-100/80 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="chip">{newsletter.chip}</span>
              <h2
                id="newsletter-heading"
                className="reveal mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {newsletter.headingPrefix}{" "}
                <span className="gradient-text">{newsletter.headingHighlight}</span>
                {newsletter.headingSuffix}
              </h2>
              <p className="reveal mt-3 text-sm text-slate-600 sm:text-base">
                {newsletter.description}
              </p>
            </div>
            <form
              onSubmit={onSubmit}
              className="lg:col-span-5"
              noValidate
              aria-describedby="newsletter-status"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {newsletter.emailLabel}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.emailPlaceholder}
                  className="w-full rounded-full border border-ink-900/10 bg-ink-900/[0.04] px-5 py-3 text-sm text-ink-900 placeholder:text-slate-500 focus:border-brand-cyan/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary shrink-0"
                >
                  {status === "loading"
                    ? newsletter.subscribing
                    : newsletter.subscribe}
                  {status !== "loading" && (
                    <ArrowRightIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className="mt-3 min-h-[1.25rem] text-xs"
              >
                {status === "success" && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {message}
                  </span>
                )}
                {status === "error" && (
                  <span className="text-rose-600">{message}</span>
                )}
                {status === "idle" && (
                  <span className="text-slate-500">
                    {newsletter.privacyNotice}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
