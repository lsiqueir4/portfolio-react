import { Phone, Mail, ExternalLink } from "lucide-react";
import Section from "~/shared/Section";
import { CONTACTS } from "~/constants";

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="
        relative
        overflow-hidden
        flex
        min-h-[80vh]
        items-center
        justify-center
        bg-surface
        px-4
        py-16
        sm:px-6
        sm:py-20
        lg:px-8
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-0
            top-20
            h-80
            w-80
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-96
            w-96
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          w-full
          max-w-2xl
        "
      >
        <Section align="center" />

        <div
          className="
            rounded-3xl
            border
            border-border-subtle/10
            bg-surface-elevated/40
            p-5
            backdrop-blur-sm
            shadow-2xl
            sm:p-8
            lg:p-10
          "
        >
          <h1
            className="
              mb-3
              text-3xl
              font-bold
              text-on-surface
              sm:text-4xl
            "
          >
            Entre em Contato
          </h1>

          <p
            className="
              mb-8
              text-sm
              font-medium
              text-muted
              sm:mb-10
              sm:text-base
            "
          >
            Estou disponível para oportunidades, projetos freelance e networking. Entre em contato
            pelos canais abaixo.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <a
              href={CONTACTS.whatsappRedirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-border-subtle/10
                bg-surface/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-border-subtle/30
                hover:bg-surface-elevated/70
                hover:shadow-lg
                hover:shadow-accent/10
                sm:gap-4
                sm:p-5
              "
            >
              <div
                className="
                  flex-shrink-0
                  rounded-full
                  border
                  border-green-500
                  bg-green-500/10
                  p-2.5
                  transition-all
                  duration-300
                  group-hover:scale-110
                  sm:p-3
                "
              >
                <Phone size={24} className="text-green-500 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-on-surface sm:text-lg">WhatsApp</h2>

                <p
                  className="
                    break-words
                    text-sm
                    font-medium
                    text-muted
                    transition-colors
                    duration-300
                    group-hover:text-muted-hover
                    sm:text-base
                  "
                >
                  {CONTACTS.formattedPhone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACTS.email}`}
              className="
                group
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-border-subtle/10
                bg-surface/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-border-subtle/30
                hover:bg-surface-elevated/70
                hover:shadow-lg
                hover:shadow-accent/10
                sm:gap-4
                sm:p-5
              "
            >
              <div
                className="
                  flex-shrink-0
                  rounded-full
                  border
                  border-accent-hover
                  bg-accent/10
                  p-2.5
                  transition-all
                  duration-300
                  group-hover:scale-110
                  sm:p-3
                "
              >
                <Mail size={24} className="text-accent-hover sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-on-surface sm:text-lg">Email</h2>

                <p
                  className="
                    break-all
                    text-sm
                    font-medium
                    text-muted
                    transition-colors
                    duration-300
                    group-hover:text-muted-hover
                    sm:text-base
                  "
                >
                  {CONTACTS.email}
                </p>
              </div>
            </a>

            <a
              href={CONTACTS.linkedinRedirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-border-subtle/10
                bg-surface/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-border-subtle/30
                hover:bg-surface-elevated/70
                hover:shadow-lg
                hover:shadow-accent/10
                sm:gap-4
                sm:p-5
              "
            >
              <div
                className="
                  flex-shrink-0
                  rounded-full
                  border
                  border-blue-500
                  bg-blue-500/10
                  p-2.5
                  transition-all
                  duration-300
                  group-hover:scale-110
                  sm:p-3
                "
              >
                <ExternalLink size={24} className="text-blue-500 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-on-surface sm:text-lg">Linkedin</h2>

                <p
                  className="
                    text-sm
                    font-medium
                    text-muted
                    transition-colors
                    duration-300
                    group-hover:text-muted-hover
                    sm:text-base
                  "
                >
                  {CONTACTS.fullName}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
