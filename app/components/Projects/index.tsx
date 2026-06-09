import type { ReactNode } from "react";
import { GitBranch, ExternalLink } from "lucide-react";

type ProjectContainerProps = {
  title: string;
  description: string;
  usedTechs: string[];
  link: string
};

function ProjectContainer({
  title,
  description,
  usedTechs,
  link
}: ProjectContainerProps) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-purple-500/20
        bg-gray-950
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-purple-400/50
        hover:shadow-lg
        hover:shadow-purple-500/20
      "
    >
      <h3 className="mb-3 text-2xl font-semibold text-white">
        {title}
      </h3>

      <p className="mb-5 text-zinc-400">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {usedTechs.map((tech) => (<span key={tech} className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-300">{tech}</span>))}
      </div>

      <div className="mt-6 flex gap-4">
        <a
          href= {link}
          className="
            flex items-center gap-2
            text-sm text-zinc-400
            transition
            hover:text-purple-400
          "
        >
          <GitBranch size={18} />
          Código
        </a>

        {/* <a
          href="#"
          className="
            flex items-center gap-2
            text-sm text-zinc-400
            transition
            hover:text-purple-400
          "
        >
          <ExternalLink size={18} />
          Demo
        </a> */}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="
        min-h-screen
        bg-indigo-950
        px-6
        py-20
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Projetos
          </h1>

          <p className="mx-auto max-w-2xl text-zinc-400">
            Projetos desenvolvidos para consolidar conhecimentos nas tecnologias que estudei.
          </p>
        </div>

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          <ProjectContainer
            title="Portfólio"
            description="Portfólio desenvolvido em React para divulgar projetos pessoais e informações para contato."
            usedTechs={["React", "Tailwind"]}
            link="https://github.com/lsiqueir4/portfolio-react"
          />
          <ProjectContainer
            title="API REST Banco digital"
            description="API Rest desenvolvida em Python com a integração ao ambiente de homologação de um banco digital."
            usedTechs={["Python", "Flask", "PostgreSQL", "AWS", "Ngrok", "SQLAlchemy"]}
            link="https://github.com/lsiqueir4/bank-integration"
          />
          <ProjectContainer
            title="API REST Geração de receitas médicas"
            description="API desenvolvida em Python com autenticação de usuários e lógica de permissionamento que gera documentos em PDF para receitas médicas."
            usedTechs={["Python", "Flask", "PostgreSQL", "Marshmellow", "Jinja2", "Weasyprint", "Pytest"]}
            link="https://github.com/lsiqueir4/online-prescription-api"
          />
        </div>
      </div>
    </section>
  );
}