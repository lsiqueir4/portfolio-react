import { Sun, Moon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="
        relative
        rounded-xl
        border
        border-border-subtle/10
        p-2.5
        text-muted
        transition-all
        duration-300
        hover:border-border-subtle/30
        hover:bg-accent/10
        hover:text-accent-hover
      "
    >
      <Sun
        size={18}
        className="rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={18}
        className="absolute inset-2.5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}
