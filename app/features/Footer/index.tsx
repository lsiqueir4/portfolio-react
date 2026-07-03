export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-purple-500/10
        bg-zinc-950
      "
    >
      <div
        className="
          border-t
          border-purple-500/10
          px-6
          py-4
          text-center
        "
      >
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Leandro Siqueira. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}