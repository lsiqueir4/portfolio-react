import { useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  Menu,
  Send,
  X,
} from "lucide-react";

type HeaderButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};

function HeaderButton({
  children,
  href = "#",
  onClick,
}: HeaderButtonProps) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        className="
          relative
          text-sm
          font-medium
          text-zinc-300
          transition-all
          duration-300
          hover:text-purple-400
          after:absolute
          after:-bottom-1
          after:left-0
          after:h-[2px]
          after:w-0
          after:bg-purple-400
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

type ActionButtonProps = {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
};

function ActionButton({
  children,
  href = "#",
  icon,
}: ActionButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-purple-500
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        transition-all
        duration-300
        hover:scale-105
        hover:bg-purple-400
        hover:shadow-lg
        hover:shadow-purple-500/30
      "
    >
      {icon}
      {children}
    </a>
  );
}

export function Header() {
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
        border-purple-500/10
        bg-zinc-950/70
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
              text-white
              transition-colors
              hover:text-purple-400
            "
          >
            <span className="text-purple-400">&lt;/&gt;</span>
            Leandro.dev
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              <HeaderButton href="#inicio">
                Início
              </HeaderButton>

              <HeaderButton href="#projetos">
                Projetos
              </HeaderButton>

              <HeaderButton href="#aboutme">
                Quem sou eu
              </HeaderButton>
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
                text-zinc-300
                transition-all
                duration-300
                hover:bg-purple-500/10
                hover:text-purple-400
              "
            >
              <Send size={18} />
              Contato
            </a>

            <ActionButton
              href="https://drive.google.com/uc?export=download&id=1e--yv8KrbVbT4D1aFwRdLmg4lYGYtm7i"
              icon={<Download size={18} />}
            >
              Baixar CV
            </ActionButton>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              rounded-xl
              border
              border-purple-500/10
              p-2.5
              text-zinc-300
              transition-all
              duration-300
              hover:border-purple-500/30
              hover:bg-purple-500/10
              hover:text-purple-400
              md:hidden
            "
            aria-label="Abrir menu"
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        <div
          className={`
            overflow-hidden
            transition-all
            duration-300
            md:hidden
            ${
              isMenuOpen
                ? "mt-4 max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              flex
              flex-col
              gap-2
              rounded-2xl
              border
              border-purple-500/10
              bg-zinc-900/80
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
                text-zinc-300
                transition-all
                duration-300
                hover:bg-purple-500/10
                hover:text-purple-400
              "
            >
              Início
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
                text-zinc-300
                transition-all
                duration-300
                hover:bg-purple-500/10
                hover:text-purple-400
              "
            >
              Projetos
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
                text-zinc-300
                transition-all
                duration-300
                hover:bg-purple-500/10
                hover:text-purple-400
              "
            >
              Quem sou eu
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
                text-zinc-300
                transition-all
                duration-300
                hover:bg-purple-500/10
                hover:text-purple-400
              "
            >
              <Send size={18} />
              Contato
            </a>

            <div className="pt-2">
              <ActionButton
                href="https://drive.google.com/uc?export=download&id=1e--yv8KrbVbT4D1aFwRdLmg4lYGYtm7i"
                icon={<Download size={18} />}
              >
                Baixar CV
              </ActionButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}