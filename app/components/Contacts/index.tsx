import { Phone, Mail, ExternalLink } from "lucide-react";

export default function Contacts() {
  return (
    <section
      id="contacts"
      className="
        min-h-screen
        px-6
        py-20
        flex
        items-center
        justify-center
        bg-purple-950/80
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-2xl
          border
          border-purple-500/30
          bg-gray-950
          p-10
          shadow-2xl
        "
      >
        <h1 className="mb-3 text-4xl font-bold text-white">
          Entre em Contato
        </h1>

        <p className="mb-10 text-zinc-400 font-medium">
          Estou disponível para oportunidades, projetos freelance e
          networking. Entre em contato pelos canais abaixo.
        </p>

        <div className="space-y-6">
          <a
            href="https://wa.me/5511956663035"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-purple-800
              bg-purple-950/80
              p-5
              transition-all
              duration-300
              hover:border-purple-500
              hover:bg-purple-800
              hover:shadow-lg
              hover:shadow-purple-500/10
            "
          >
            <div
              className="
                rounded-full
                bg-purple-700/10
                p-3
                border
                border-green-500
              "
            >
              <Phone
                size={28}
                className="text-green-500"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                WhatsApp
              </h2>

              <p className="text-zinc-400 font-medium hover:font-bold transition-all">
                +55 (11) 95666-3035
              </p>
            </div>
          </a>

          <a
            href="mailto:l.gsiqueira997@gmail.com"
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-purple-800
              bg-purple-950/80
              p-5
              transition-all
              duration-300
              hover:border-purple-500
              hover:bg-purple-800
              hover:shadow-lg
              hover:shadow-purple-500/10
            "
          >
            <div
              className="
                rounded-full
                bg-purple-700/10
                p-3
                border
                border-purple-400
              "
            >
              <Mail
                size={28}
                className="text-purple-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Email
              </h2>

              <p className="text-zinc-400 font-medium hover:font-bold transition-all">
                l.gsiqueira997@gmail.com
              </p>
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/l-siqueiraa/"
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-purple-800
              bg-purple-950/80
              p-5
              transition-all
              duration-300
              hover:border-purple-500
              hover:bg-purple-800
              hover:shadow-lg
              hover:shadow-purple-500/10
            "
          >
            <div
              className="
                rounded-full
                bg-purple-700/10
                p-3
                border
                border-blue-600
              "
            >
              <ExternalLink
                size={28}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Linkedin
              </h2>

              <p className="text-zinc-400 font-medium hover:font-bold transition-all">
                Leandro Siqueira
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}