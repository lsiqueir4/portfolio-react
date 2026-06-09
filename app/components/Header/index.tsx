import type { ReactNode } from "react";
import { Download, Send } from "lucide-react";

type HeaderButtonProps = {
  children: ReactNode;
  href?: string;
};

function HeaderButton({
  children,
  href = "#",
}: HeaderButtonProps) {
  return (
    <li>
      <a
        href={href}
        className="
          relative
          text-sm
          font-medium
          text-zinc-200
          transition
          hover:text-purple-400
          after:absolute
          after:-bottom-1
          after:left-0
          after:h-[2px]
          after:w-0
          after:bg-purple-400
          after:transition-all
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
      className="
        flex items-center gap-2
        rounded-lg
        bg-purple-500
        px-5 py-2.5
        text-sm font-medium text-white
        transition
        hover:bg-purple-400
        hover:scale-105
      "
    >
      {icon}
      {children}
    </a>
  );
}

export function Header() {
  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-white/10
        bg-purple-950/80
        backdrop-blur
      "
    >
      <nav
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-5
        "
      >
        <h1 className="text-lg font-bold text-white">
          Leandro.dev
        </h1>

        <ul className="hidden items-center gap-8 md:flex">
          <HeaderButton href="#hero">
            Início
          </HeaderButton>

          <HeaderButton href="#projetos">
            Projetos
          </HeaderButton>

          <HeaderButton href="#formacao">
            Formação
          </HeaderButton>

          <HeaderButton href="#experiencias">
            Experiências
          </HeaderButton>

          <HeaderButton href="#certificacoes">
            Certificações
          </HeaderButton>
        </ul>

        <div className="flex items-center gap-4">
          <a
            href="#contacts"
            className="
              hidden
              items-center gap-2
              text-sm font-medium text-zinc-200
              transition
              hover:text-purple-400
              md:flex
            "
          >
            <Send size={18} />
            Contato
          </a>

          <ActionButton
            href="/cv.pdf"
            icon={<Download size={18} />}
          >
            Baixar CV
          </ActionButton>
        </div>
      </nav>
    </header>
  );
}