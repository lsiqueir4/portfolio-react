import { useLanguage } from "~/hooks/useLanguage";

export function LanguageToggle() {
  const [language, setLanguage] = useLanguage();
  const isPt = language === "pt";

  return (
    <div
      role="group"
      aria-label="Selecionar idioma"
      className="
        flex
        items-center
        gap-1
        rounded-xl
        border
        border-border-subtle/10
        p-2.5
        text-sm
        font-semibold
        transition-all
        duration-300
        hover:border-border-subtle/30
      "
    >
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        aria-label="Português"
        aria-pressed={isPt}
        suppressHydrationWarning
        className={`
          rounded-md
          px-1
          transition-colors
          duration-300
          hover:bg-accent/10
          hover:text-accent-hover
          ${isPt ? "text-accent-hover" : "text-muted"}
        `}
      >
        PT
      </button>
      <span className="text-muted/40">|</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="English"
        aria-pressed={!isPt}
        suppressHydrationWarning
        className={`
          rounded-md
          px-1
          transition-colors
          duration-300
          hover:bg-accent/10
          hover:text-accent-hover
          ${!isPt ? "text-accent-hover" : "text-muted"}
        `}
      >
        EN
      </button>
    </div>
  );
}
