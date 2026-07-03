import { Phone, Mail, ExternalLink } from "lucide-react";
import { CONTACTS } from "~/constants" ;

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
        bg-zinc-950
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
            bg-purple-500/10
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
            bg-purple-700/10
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
        <div
          className="
            mx-auto
            mb-6
            h-px
            w-24
            bg-gradient-to-r
            from-transparent
            via-purple-500
            to-transparent
          "
        />

        <div
          className="
            rounded-3xl
            border
            border-purple-500/10
            bg-zinc-900/40
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
              text-white
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
              text-zinc-400
              sm:mb-10
              sm:text-base
            "
          >
            Estou disponível para oportunidades, projetos freelance e
            networking. Entre em contato pelos canais abaixo.
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
                border-purple-500/10
                bg-zinc-950/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-500/30
                hover:bg-zinc-900/70
                hover:shadow-lg
                hover:shadow-purple-500/10
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
                <Phone
                  size={24}
                  className="text-green-500 sm:h-7 sm:w-7"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  WhatsApp
                </h2>

                <p
                  className="
                    break-words
                    text-sm
                    font-medium
                    text-zinc-400
                    transition-colors
                    duration-300
                    group-hover:text-zinc-300
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
                border-purple-500/10
                bg-zinc-950/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-500/30
                hover:bg-zinc-900/70
                hover:shadow-lg
                hover:shadow-purple-500/10
                sm:gap-4
                sm:p-5
              "
            >
              <div
                className="
                  flex-shrink-0
                  rounded-full
                  border
                  border-purple-400
                  bg-purple-500/10
                  p-2.5
                  transition-all
                  duration-300
                  group-hover:scale-110
                  sm:p-3
                "
              >
                <Mail
                  size={24}
                  className="text-purple-400 sm:h-7 sm:w-7"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Email
                </h2>

                <p
                  className="
                    break-all
                    text-sm
                    font-medium
                    text-zinc-400
                    transition-colors
                    duration-300
                    group-hover:text-zinc-300
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
                border-purple-500/10
                bg-zinc-950/50
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-500/30
                hover:bg-zinc-900/70
                hover:shadow-lg
                hover:shadow-purple-500/10
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
                <ExternalLink
                  size={24}
                  className="text-blue-500 sm:h-7 sm:w-7"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Linkedin
                </h2>

                <p
                  className="
                    text-sm
                    font-medium
                    text-zinc-400
                    transition-colors
                    duration-300
                    group-hover:text-zinc-300
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