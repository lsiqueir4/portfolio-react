import profile from "~/assets/profile.png";
import { Download, Send } from "lucide-react";
import TechBadge from "~/shared/TechBadge";
import Button from "~/shared/Button";
import { techs } from "./data";
import { CONTACTS } from "~/constants";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="
        relative
        overflow-hidden
      "
    >
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div
        className="
          relative
          mx-auto
          grid
          min-h-screen
          max-w-7xl
          grid-cols-1
          items-center
          gap-12
          px-4
          py-16
          sm:px-6
          lg:px-8
          lg:py-24
          md:grid-cols-2
        "
      >
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                scale-110
                rounded-full
                bg-accent/20
                blur-3xl
              "
            />

            <img
              src={profile}
              alt={CONTACTS.fullName}
              className="
                relative
                h-64 w-64
                rounded-full
                border-4 border-accent
                object-cover
                shadow-lg shadow-accent/20
                sm:h-80 sm:w-80
                lg:h-96 lg:w-96
              "
            />
          </div>
        </div>

        <div
          className="
            order-2
            flex
            flex-col
            text-center
            md:text-left
          "
        >
          <div
            className="
              mb-4
              inline-flex
              w-fit
              self-center
              rounded-full
              border border-border-subtle/30
              bg-accent/10
              px-4 py-2
              text-sm
              font-medium
              text-accent-hover
              md:self-start
            "
          >
            Disponível para oportunidades
          </div>

          <p className="mb-2 text-sm font-medium text-accent-hover sm:text-base">Olá, eu sou</p>

          <h1
            className="
              text-4xl
              font-extrabold
              tracking-tight
              text-on-surface
              sm:text-5xl
              lg:text-6xl
            "
          >
            {CONTACTS.fullName}
          </h1>

          <h2
            className="
              mt-4
              text-lg
              font-bold
              text-muted
              sm:text-xl
            "
          >
            Desenvolvedor Full-Stack
          </h2>

          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-relaxed
              text-muted
              md:text-lg
            "
          >
            Desenvolvedor com experiência em APIs REST, integrações bancárias, produtos de crédito e
            aplicações web modernas utilizando Python, Flask, React e TypeScript.
          </p>

          <div
            className="
              mt-6
              flex
              flex-wrap
              justify-center
              gap-2
              md:justify-start
            "
          >
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {techs.map(({ icon, name }) => (
                <TechBadge key={name} Icon={icon} name={name} />
              ))}
            </div>
          </div>

          <div
            className="
              mt-8
              flex
              w-full
              flex-col
              gap-4
              sm:flex-row
              sm:w-auto
            "
          >
            <Button
              variant="primary"
              href={CONTACTS.cvDownloadLink}
              icon={<Download size={18} />}
              className="rounded-lg px-5 py-3 font-bold w-full sm:w-auto"
            >
              Baixar CV
            </Button>

            <Button
              variant="secondary"
              href="#contacts"
              icon={<Send size={18} />}
              className="rounded-lg px-5 py-3 font-bold w-full sm:w-auto"
            >
              Entre em contato
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
