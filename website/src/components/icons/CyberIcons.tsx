import type { ReactNode } from "react";

type IconProps = {
  className?: string;
  title?: string;
};

function Base({
  children,
  title,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 4 6v6c0 5 3.6 8.3 8 9 4.4-.7 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.5" r="1.25" />
  </Base>
);

export const KeyIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="M10.8 12.2 21 2m-4 4 3 3m-6-1 3 3" />
  </Base>
);

export const CloudIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 18a5 5 0 1 1 1.2-9.86A6 6 0 0 1 20 11.5 4.5 4.5 0 0 1 17.5 20H7Z" />
    <path d="M9.5 14.5 11 16l4-4" />
  </Base>
);

export const ServerIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
  </Base>
);

export const EyeScanIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
);

export const RadarIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M12 3v9l6 5" />
  </Base>
);

export const BugIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="8" y="8" width="8" height="11" rx="4" />
    <path d="M12 8V6a3 3 0 0 0-3-3M12 8V6a3 3 0 0 1 3-3M4 12h4m8 0h4M5 7l3 2m11-2-3 2M5 17l3-2m11 2-3-2" />
  </Base>
);

export const NetworkIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M12 7v4M12 11 6 17M12 11l6 6" />
  </Base>
);

export const ZeroTrustIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 4 6v6c0 5 3.6 8.3 8 9 4.4-.7 8-4 8-9V6l-8-3Z" />
    <path d="M8 14h8M8 11h8" />
  </Base>
);

export const AiBrainIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h6a3 3 0 0 0 3-3 3 3 0 0 0 2-5 3 3 0 0 0-2-5 3 3 0 0 0-3-3H9Z" />
    <path d="M9 8v8m6-8v8M12 8v8" />
  </Base>
);

export const FingerprintIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 12a6 6 0 0 1 12 0v3M9 21c-.7-1.8-1-3.6-1-5.5V12a4 4 0 0 1 8 0v3.5c0 1.7.4 3.4 1 5M12 13v2.5M5 9a8 8 0 0 1 14 0" />
  </Base>
);

export const ChipIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </Base>
);

export const AlertIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v5M12 18v.01" />
  </Base>
);

export const SparkleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </Base>
);

export const CodeShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 4 6v6c0 5 3.6 8.3 8 9 4.4-.7 8-4 8-9V6l-8-3Z" />
    <path d="m10 11-2 2 2 2m4-4 2 2-2 2" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12 5 5L20 7" />
  </Base>
);

export const PlayIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 5v14l12-7L7 5Z" />
  </Base>
);

export const QuoteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 7h4v6c0 2.2-1.8 4-4 4M14 7h4v6c0 2.2-1.8 4-4 4" />
  </Base>
);
