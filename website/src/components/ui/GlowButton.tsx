import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Common = {
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  children: ReactNode;
};

type LinkProps = Common &
  { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonProps = Common &
  { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type GlowButtonProps = LinkProps | ButtonProps;

function classes(variant: Common["variant"] = "primary", extra?: string) {
  const base =
    variant === "ghost"
      ? "btn-ghost"
      : variant === "outline"
        ? "btn-outline"
        : "btn-primary";
  return [base, extra].filter(Boolean).join(" ");
}

export default function GlowButton(props: GlowButtonProps) {
  if ("href" in props && props.href) {
    const { href, variant, className, children, ...rest } = props;
    return (
      <Link href={href} className={classes(variant, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, className, children, ...rest } = props as ButtonProps;
  return (
    <button type="button" className={classes(variant, className)} {...rest}>
      {children}
    </button>
  );
}
