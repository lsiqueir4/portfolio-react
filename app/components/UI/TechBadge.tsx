import type { IconType } from "react-icons";

type TechBadgeProps = {
  Icon: IconType;
  name: string;
};

export default function TechBadge({
  Icon,
  name,
}: TechBadgeProps) {
  return (
    <div
      className="
        inline-flex items-center gap-2
        rounded-full
        border border-purple-500/20
        bg-purple-500/10
        px-2.5 py-1.5
        sm:px-3 sm:py-2
        transition-all
        hover:border-purple-400/40
        hover:bg-purple-500/20
      "
    >
      <Icon className="shrink-0 text-purple-300 text-base sm:text-lg" />

      <span
        className="
          text-xs
          sm:text-sm
          font-medium
          text-zinc-300
          whitespace-nowrap
        "
      >
        {name}
      </span>
    </div>
  );
}