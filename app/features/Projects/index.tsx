import { GitBranch } from "lucide-react";
import type { ProjectContainerProps } from "./types";
import Section from "~/shared/Section";
import TechBadge from "~/shared/TechBadge";
import { projects } from "./data";

function ProjectContainer({ title, description, usedTechs, link, image }: ProjectContainerProps) {
  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-border-subtle/20
        bg-surface-elevated/50
        p-5
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-accent-hover/50
        hover:shadow-xl
        hover:shadow-accent/20
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
          text-on-surface
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
          text-muted
          sm:text-base
        "
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {usedTechs.map(({ icon, name }) => (
          <TechBadge key={name} Icon={icon} name={name} />
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
            border-border-subtle/20
            px-4
            py-2.5
            text-sm
            font-bold
            text-muted
            transition-all
            duration-300
            hover:border-accent
            hover:bg-accent/10
            hover:text-accent-hover
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
            bottom-20
            right-0
            h-96
            w-96
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <Section
            align="center"
            title="Projetos"
            subtitle="Projetos desenvolvidos para consolidar conhecimentos nas tecnologias que estudei."
            titleClassName="mb-4 text-3xl font-bold text-on-surface sm:text-4xl md:text-5xl"
            subtitleClassName="mx-auto max-w-2xl text-sm font-medium text-muted sm:text-base"
          />
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
          {projects.map((project) => (
            <ProjectContainer
              title={project.title}
              description={project.description}
              usedTechs={project.usedTechs}
              link={project.link}
              image={project.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
