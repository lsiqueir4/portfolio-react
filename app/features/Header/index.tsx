import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { HeaderButtonProps } from "./types";
import { Download, Menu, Send, X } from "lucide-react";
import { CONTACTS } from "~/constants";
import Button from "~/shared/Button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

function HeaderButton({ children, href = "#", onClick }: HeaderButtonProps) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        className="
          relative
          text-sm
          font-medium
          text-muted
          transition-all
          duration-300
          hover:text-accent-hover
          after:absolute
          after:-bottom-1
          after:left-0
          after:h-[2px]
          after:w-0
          after:bg-accent-hover
          after:transition-all
          after:duration-300
          hover:after:w-full
        "
      >
        {children}
      </a>
    </li>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-border-subtle/10
        bg-surface/70
        backdrop-blur-xl
      "
    >
      <nav
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          px-4
          py-4
          sm:px-6
          lg:px-8
        "
      >
        <div className="flex items-center justify-between">
          <a
            href="#inicio"
            className="
              flex
              items-center
              gap-2
              text-xl
              font-extrabold
              tracking-tight
              text-on-surface
              transition-colors
              hover:text-accent-hover
            "
          >
            <span className="text-accent-hover">&lt;/&gt;</span>
            Leandro.dev
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              <HeaderButton href="#inicio">{t("header.home")}</HeaderButton>

              <HeaderButton href="#projetos">{t("header.projects")}</HeaderButton>

              <HeaderButton href="#aboutme">{t("header.about")}</HeaderButton>
            </ul>

            <a
              href="#contacts"
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-muted
                transition-all
                duration-300
                hover:bg-accent/10
                hover:text-accent-hover
              "
            >
              <Send size={18} />
              {t("header.contact")}
            </a>

            <Button
              variant="primary"
              external
              href={CONTACTS.cvDownloadLink}
              icon={<Download size={18} />}
              className="rounded-xl px-[15px] py-[9px] text-sm font-semibold"
            >
              {t("common.downloadCV")}
            </Button>

            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
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
              md:hidden
            "
            aria-label={t("header.openMenu")}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            md:hidden
            ${isMenuOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div
            className="
              flex
              flex-col
              gap-2
              rounded-2xl
              border
              border-border-subtle/10
              bg-surface-elevated/80
              p-4
              backdrop-blur-md
            "
          >
            <a
              href="#inicio"
              onClick={closeMenu}
              className="
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-muted
                transition-all
                duration-300
                hover:bg-accent/10
                hover:text-accent-hover
              "
            >
              {t("header.home")}
            </a>

            <a
              href="#projetos"
              onClick={closeMenu}
              className="
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-muted
                transition-all
                duration-300
                hover:bg-accent/10
                hover:text-accent-hover
              "
            >
              {t("header.projects")}
            </a>

            <a
              href="#aboutme"
              onClick={closeMenu}
              className="
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-muted
                transition-all
                duration-300
                hover:bg-accent/10
                hover:text-accent-hover
              "
            >
              {t("header.about")}
            </a>

            <a
              href="#contacts"
              onClick={closeMenu}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-muted
                transition-all
                duration-300
                hover:bg-accent/10
                hover:text-accent-hover
              "
            >
              <Send size={18} />
              {t("header.contact")}
            </a>

            <div className="pt-2">
              <Button
                variant="primary"
                external
                href={CONTACTS.cvDownloadLink}
                icon={<Download size={18} />}
                className="rounded-xl px-[15px] py-[9px] text-sm font-semibold"
              >
                {t("common.downloadCV")}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
