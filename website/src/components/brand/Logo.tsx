'use client';

import { useContent } from "@/lib/content-client";

type LogoProps = {
  className?: string;
  title?: string;
};

export default function Logo({ className, title }: LogoProps) {
  const content = useContent() as Record<string, any>;
  const label = title ?? (content.common as { brandName: string }).brandName;

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="sentinelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#004B87" />
          <stop offset="50%" stopColor="#0079B5" />
          <stop offset="100%" stopColor="#0096D6" />
        </linearGradient>
        <linearGradient id="sentinelShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M20 2 L34 8 V20 C34 28.5 27.5 35 20 38 C12.5 35 6 28.5 6 20 V8 Z"
        fill="url(#sentinelGrad)"
      />
      <path
        d="M20 4 L32 9 V20 C32 27.4 26.3 33.2 20 36 C13.7 33.2 8 27.4 8 20 V9 Z"
        fill="url(#sentinelShine)"
        opacity="0.25"
      />
      <path
        d="M14 20 L18 24 L27 15"
        fill="none"
        stroke="#001F3F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
