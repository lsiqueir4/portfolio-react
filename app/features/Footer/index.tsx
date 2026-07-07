import { useTranslation } from "react-i18next";
import { CONTACTS } from "~/constants";

export default function Footer() {
  const { t } = useTranslation();

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
          {t("footer.rights", { year: new Date().getFullYear(), name: CONTACTS.fullName })}
        </p>
      </div>
    </footer>
  );
}
