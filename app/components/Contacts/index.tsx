import { Phone, Mail } from "lucide-react";

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
        bg-zinc-950
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          rounded-2xl
          border
          border-purple-500
          bg-zinc-400-100
          p-10
          shadow-lg
        "
      >
        <h1 className="mb-10 text-4xl font-bold text-white">
          Entre em Contato
        </h1>

        <div className="space-y-8">
          <div
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-zinc-800
              p-5
              transition
              hover:border-green-500
              hover:bg-zinc-900
            "
          >
            <div className="rounded-full bg-green-500/10 p-3">
              <Phone className="text-green-500" size={28} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                WhatsApp
              </h2>

              <p className="text-zinc-400">
                +55 (11) 95666-3035
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-zinc-800
              p-5
              transition
              hover:border-purple-500
              hover:bg-zinc-900
            "
          >
            <div className="rounded-full bg-purple-500/10 p-3">
              <Mail className="text-purple-500" size={28} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Email
              </h2>

              <p className="text-zinc-400">
                l.gsiqueira997@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}