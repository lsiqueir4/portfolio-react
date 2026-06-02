function HeaderButton({ children }) {
  return (
    <li>
      <a
        href="#"
        className="rounded-lg text-xl bordertext-white hover:text-purple-500 transition"
      >
        {children}
      </a>
    </li>
  ); 
}

export function Header() {
  return (
    <header className="bg-purple-950 px-10 py-5">
        <nav>
          <ul className="items-center flex gap-10 justify-center">
            <HeaderButton>Início</HeaderButton>
            <HeaderButton>Projetos</HeaderButton>
            <HeaderButton>Formação</HeaderButton>
            <HeaderButton>Experiencias</HeaderButton>
            <HeaderButton>Certificações</HeaderButton>
            <HeaderButton>Contatos</HeaderButton>
          </ul>
        </nav>
    </header>
  );
}