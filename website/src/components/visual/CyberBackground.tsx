type Props = {
  variant?: "hero" | "subtle" | "section";
  className?: string;
};

export default function CyberBackground({
  variant = "hero",
  className = "",
}: Props) {
  const intensity = variant === "hero" ? 1 : variant === "section" ? 0.6 : 0.35;
  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      ].join(" ")}
    >
      <div
        className="absolute inset-0 grid-bg mask-fade-b animate-grid-pan"
        style={{ opacity: 0.55 * intensity }}
      />
      <div
        className="absolute -top-40 left-1/2 h-[40rem] w-[80rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,121,181,0.2), transparent 70%)",
          opacity: intensity,
        }}
      />
      <div
        className="absolute -bottom-32 -left-20 h-[28rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,75,135,0.18), transparent 70%)",
          opacity: intensity,
        }}
      />
      <div
        className="absolute -right-20 top-20 h-[28rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,150,214,0.18), transparent 70%)",
          opacity: intensity,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,251,250,0)_0%,_rgba(246,251,250,0.6)_60%,_rgba(246,251,250,1)_100%)]" />
    </div>
  );
}
