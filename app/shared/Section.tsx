import type { ReactNode } from "react";

type SectionAlign = "left" | "center";

type SectionProps = {
  align?: SectionAlign;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: ReactNode;
};

const defaultTitleClasses = "mb-6 text-3xl font-extrabold text-on-surface sm:text-4xl md:text-5xl";
const defaultSubtitleClasses =
  "max-w-3xl text-base leading-relaxed font-medium text-muted sm:text-lg";

export default function Section({
  align = "left",
  eyebrow,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  children,
}: SectionProps) {
  const dividerClasses = [
    align === "center" ? "mx-auto" : "",
    "mb-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <div className={dividerClasses} />

      {eyebrow && (
        <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-accent-hover">
          {eyebrow}
        </span>
      )}

      {title && <h1 className={titleClassName ?? defaultTitleClasses}>{title}</h1>}

      {subtitle && <p className={subtitleClassName ?? defaultSubtitleClasses}>{subtitle}</p>}

      {children}
    </div>
  );
}
