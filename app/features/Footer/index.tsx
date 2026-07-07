import { CONTACTS } from "~/constants";

export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-border-subtle/10
        bg-surface
      "
    >
      <div
        className="
          border-t
          border-border-subtle/10
          px-6
          py-4
          text-center
        "
      >
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {CONTACTS.fullName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
