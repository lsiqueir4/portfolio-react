import profile from "../../assets/profile.jpeg";
import type { ReactNode } from "react";
import { Download, Send } from "lucide-react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
};

function Button({ children, href = "#" }: ButtonProps) {
  return (
    <a
      href={href}
      className="
        flex items-center gap-2
        rounded-lg border border-purple-500
        px-6 py-3
        font-bold
        transition
        hover:bg-purple-500
        hover:text-white
      "
    >
      {children}
    </a>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="
        grid min-h-screen
        grid-cols-1
        items-center
        gap-10
        px-6
        md:grid-cols-2
      "
    >
      <div className="flex justify-center">
        <img
          src={profile}
          className="
            h-128 w-128
            rounded-full
            object-cover
            border-4 border-purple-500
            shadow-lg
          "
        />
      </div>

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <p className="mb-2 text-purple-400 font-medium">
          Olá, eu sou
        </p>

        <h1 className="text-5xl font-extrabold tracking-tight">
          Leandro Siqueira
        </h1>

        <h2 className="mt-4 text-xl font-bold text-zinc-400">
          Desenvolvedor Full-Stack
        </h2>

        <p className="mt-6 max-w-xl text-zinc-500 leading-relaxed font-medium">
          Desenvolvedor focado em React, Next.js e APIs com Python,
          criando aplicações modernas, responsivas e escaláveis.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button>
            <Download size={18} href="https://drive.google.com/uc?export=download&id=1e--yv8KrbVbT4D1aFwRdLmg4lYGYtm7i" />
            Baixar CV
          </Button>

          <Button href="#contacts">
            <Send size={18} />
            Entre em contato
          </Button>
        </div>
      </div>
    </section>
  );
}