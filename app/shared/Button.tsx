import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 transition-all duration-300 text-on-surface";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent border border-accent hover:bg-accent-hover hover:scale-105 hover:shadow-lg hover:shadow-accent/30",
  secondary: "border border-accent hover:bg-accent hover:text-on-surface",
};

export default function Button({
  children,
  href = "#",
  variant = "primary",
  icon,
  external = false,
  className = "",
}: ButtonProps) {
  const classes = [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={classes}
    >
      {icon}
      {children}
    </a>
  );
}
