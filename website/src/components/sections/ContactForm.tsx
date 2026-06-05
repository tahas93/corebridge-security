'use client';

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons/CyberIcons";
import { useContent } from "@/lib/content-client";

export default function ContactForm() {
  const content = useContent() as Record<string, any>;
  const interests = content.forms.contact.areasOptions as string[];
  const requiredMark = content.forms.symbols.required as string;
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="gradient-border-soft reveal relative overflow-hidden rounded-3xl bg-surface-100/70 p-8 sm:p-10"
      noValidate
      aria-describedby="contact-status"
    >
      <h2 className="font-display text-2xl font-bold tracking-tight">
        {content.forms.contact.heading}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {content.forms.contact.intro}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label={content.forms.contact.fields.firstName} required requiredMark={requiredMark} autoComplete="given-name" />
        <Field id="lastName" label={content.forms.contact.fields.lastName} required requiredMark={requiredMark} autoComplete="family-name" />
        <Field
          id="email"
          label={content.forms.contact.fields.email}
          type="email"
          required
          requiredMark={requiredMark}
          autoComplete="email"
        />
        <Field id="company" label={content.forms.contact.fields.company} required requiredMark={requiredMark} autoComplete="organization" />
        <Field id="title" label={content.forms.contact.fields.title} autoComplete="organization-title" />
        <Field id="phone" label={content.forms.contact.fields.phone} type="tel" autoComplete="tel" />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink-800">
          {content.forms.contact.areasLegend}
        </legend>
        <p className="mt-1 text-xs text-slate-500">{content.forms.contact.areasHelp}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {interests.map((i) => (
            <label
              key={i}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink-900/10 bg-ink-900/[0.04] px-3 py-1.5 text-xs text-ink-800 transition-colors hover:bg-ink-900/[0.08] has-[:checked]:border-brand-cyan/60 has-[:checked]:bg-brand-cyan/10 has-[:checked]:text-brand-blue"
            >
              <input
                type="checkbox"
                name="interests"
                value={i}
                className="peer sr-only"
              />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500 peer-checked:bg-cyan-300" />
              {i}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="message" className="text-sm font-semibold text-ink-800">
          {content.forms.contact.messageLabel}
          <span aria-hidden className="ml-1 text-rose-600">
            {content.forms.symbols.required}
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={content.forms.contact.messagePlaceholder}
          className="mt-2 w-full rounded-2xl border border-ink-900/10 bg-ink-900/[0.04] px-4 py-3 text-sm text-ink-900 placeholder:text-slate-500 focus:border-brand-cyan/60 focus:outline-none"
        />
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-ink-900/20 bg-ink-900/10 accent-brand-purple"
        />
        <label htmlFor="consent" className="text-xs text-slate-600">
          {content.forms.contact.consentPrefix}{" "}
          <a href="#" className="text-brand-cyan hover:underline">
            {content.forms.contact.consentLink}
          </a>
          .
        </label>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary"
        >
          {status === "loading" ? content.forms.contact.sending : content.forms.contact.send}
          {status !== "loading" && <ArrowRightIcon className="h-4 w-4" />}
        </button>
        <p
          id="contact-status"
          role="status"
          aria-live="polite"
          className="text-xs"
        >
          {status === "success" ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckIcon className="h-3.5 w-3.5" />
              {content.forms.contact.success}
            </span>
          ) : (
            <span className="text-slate-500">
              {content.forms.contact.idle}
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  autoComplete,
  requiredMark,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  requiredMark?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-rose-600">
            {requiredMark}
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-full border border-ink-900/10 bg-ink-900/[0.04] px-4 py-2.5 text-sm text-ink-900 placeholder:text-slate-500 focus:border-brand-cyan/60 focus:outline-none"
      />
    </div>
  );
}
