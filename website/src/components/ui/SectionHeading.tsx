type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: Props) {
  return (
    <div
      className={[
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      ].join(" ")}
    >
      {eyebrow && <span className="eyebrow reveal">{eyebrow}</span>}
      <h2 className="reveal mt-4 font-display text-display-lg font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={[
            "reveal mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg",
            align === "center" ? "mx-auto" : "",
          ].join(" ")}
        >
          {description}
        </p>
      )}
    </div>
  );
}
