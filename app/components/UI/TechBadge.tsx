import type { IconType } from "react-icons";

export default function TechBadge({
  Icon,
  name,
}: {
  Icon: IconType;
  name: string;
}) {
  return (
    <div
      className="
        flex items-center gap-2
        rounded-full
        border border-purple-500/20
        bg-purple-500/10
        px-3 py-2
        transition-all
        hover:border-purple-400/40
        hover:bg-purple-500/20
      "
    >
      <Icon size={18} className="text-purple-300" />
      <span className="text-sm font-bold text-zinc-300">{name}</span>
    </div>
  );
}