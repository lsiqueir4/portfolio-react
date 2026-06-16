import { GitBranch } from "lucide-react";
import type { IconType } from "react-icons";
import TechBadge from "../UI/TechBadge";
import Portfolio from "../../assets/projects/portfolio.png"
import BankApi from "../../assets/projects/bank-api.png"
import OnlinePrescriptionApi from "../../assets/projects/online-prescription-api.png"

import {
  SiReact,
  SiJavascript,
  SiPython,
  SiFlask,
  SiTypescript,
  SiPostgresql,
  SiDocker,
  SiPytest,
  SiSqlalchemy,
  SiTailwindcss,
} from "react-icons/si";

import { DiAws } from "react-icons/di";

interface Tech {
  name: string;
  icon: IconType;
}

type ProjectContainerProps = {
  title: string;
  description: string;
  usedTechs: Tech[];
  link: string;
  image: string;
};

function ProjectContainer({
  title,
  description,
  usedTechs,
  link,
  image
}: ProjectContainerProps) {
  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-purple-500/20
        bg-zinc-900/50
        p-5
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-purple-400/50
        hover:shadow-xl
        hover:shadow-purple-500/20
        sm:p-6
      "
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-48
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      <h3
        className="
          mb-3
          text-xl
          font-semibold
          text-white
          sm:text-2xl
        "
      >
        {title}
      </h3>

      <p
        className="
          mb-5
          flex-grow
          text-sm
          font-medium
          text-zinc-400
          sm:text-base
        "
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {usedTechs.map(({ icon, name }) => (
          <TechBadge
            key={name}
            Icon={icon}
            name={name}
          />
        ))}
      </div>

      <div className="mt-6">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-purple-500/20
            px-4
            py-2.5
            text-sm
            font-bold
            text-zinc-400
            transition-all
            duration-300
            hover:border-purple-500
            hover:bg-purple-500/10
            hover:text-purple-400
          "
        >
          <GitBranch size={18} />
          Ver código
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projetos"
      className="
        relative
        overflow-hidden
        min-h-screen
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
            bottom-20
            right-0
            h-96
            w-96
            rounded-full
            bg-purple-700/10
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
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

          <h1
            className="
              mb-4
              text-3xl
              font-bold
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            Projetos
          </h1>

          <p
            className="
              mx-auto
              max-w-2xl
              text-sm
              font-medium
              text-zinc-400
              sm:text-base
            "
          >
            Projetos desenvolvidos para consolidar conhecimentos nas tecnologias
            que estudei.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          <ProjectContainer
            title="Portfólio"
            description="Portfólio desenvolvido em React para divulgar projetos pessoais e informações para contato."
            usedTechs={[
              { name: "React", icon: SiReact },
              { name: "JavaScript", icon: SiJavascript },
              { name: "TypeScript", icon: SiTypescript },
              { name: "TailwindCSS", icon: SiTailwindcss },
            ]}
            link="https://github.com/lsiqueir4/portfolio-react"
            image={Portfolio}
          />

          <ProjectContainer
            title="API REST Banco digital"
            description="API Rest desenvolvida em Python com a integração ao ambiente de homologação de um banco digital."
            usedTechs={[
              { name: "Python", icon: SiPython },
              { name: "Flask", icon: SiFlask },
              { name: "PostgreSQL", icon: SiPostgresql },
              { name: "Docker", icon: SiDocker },
              { name: "Pytest", icon: SiPytest },
              { name: "AWS", icon: DiAws },
              { name: "SQLAlchemy", icon: SiSqlalchemy },
            ]}
            link="https://github.com/lsiqueir4/bank-integration"
            image={BankApi}
          />

          <ProjectContainer
            title="API REST Geração de receitas médicas"
            description="API desenvolvida em Python com autenticação de usuários e lógica de permissionamento que gera documentos em PDF para receitas médicas."
            usedTechs={[
              { name: "Python", icon: SiPython },
              { name: "Flask", icon: SiFlask },
              { name: "PostgreSQL", icon: SiPostgresql },
              { name: "Docker", icon: SiDocker },
              { name: "Pytest", icon: SiPytest },
              { name: "SQLAlchemy", icon: SiSqlalchemy },
            ]}
            link="https://github.com/lsiqueir4/online-prescription-api"
            image={OnlinePrescriptionApi}
          />
        </div>
      </div>
    </section>
  );
}