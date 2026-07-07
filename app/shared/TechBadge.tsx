import type { IconType } from "react-icons";

type TechBadgeProps = {
  Icon: IconType;
  name: string;
};

export default function TechBadge({ Icon, name }: TechBadgeProps) {
  return (
    <div
      className="
        inline-flex items-center gap-2
        rounded-full
        border border-border-subtle/20
        bg-accent/10
        px-2.5 py-1.5
        sm:px-3 sm:py-2
        transition-all
        hover:border-accent-hover/40
        hover:bg-accent/20
      "
    >
      <Icon className="shrink-0 text-accent-hover text-base sm:text-lg" />

      <span
        className="
          text-xs
          sm:text-sm
          font-medium
          text-muted
          whitespace-nowrap
        "
      >
        {name}
      </span>
    </div>
  );
}
