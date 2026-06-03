import type { ReactNode } from "react";

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
          justify-center
          px-6
          py-5
        "
      >
        <ul className="flex flex-wrap items-center gap-8">
          <HeaderButton href="#inicio">
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

          <HeaderButton href="#contatos">
            Entre em contato
          </HeaderButton>
        </ul>
      </nav>
    </header>
  );
}