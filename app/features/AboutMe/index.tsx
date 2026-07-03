import type { ReactNode } from "react";

import TechBadge from "../UI/TechBadge";
import type { Experience } from "./types";
import { experiences, frontEndTechs, backEndTechs, courses, toolsTechs } from "./data";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="
        mb-5
        text-lg
        font-semibold
        text-white
        sm:text-xl
      "
    >
      {children}
    </h2>
  );
}

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-purple-500/10
        bg-zinc-900/40
        p-5
        sm:p-6
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-purple-500/20
        hover:shadow-lg
        hover:shadow-purple-500/10
      "
    >
      {children}
    </div>
  );
}

function ExperienceCard({
  company,
  role,
  startDate,
  endDate,
  activities,
}: Experience) {
  return (
    <div
      className="
        relative
        border-l-2
        border-purple-500/20
        pl-6
        sm:pl-8
      "
    >
      <div
        className="
          absolute
          -left-[9px]
          top-2
          h-4
          w-4
          rounded-full
          border-2
          border-zinc-950
          bg-purple-400
        "
      />

      <div className="mb-4">
        <h3
          className="
            text-base
            font-semibold
            text-white
            sm:text-lg
          "
        >
          {company}
        </h3>

        <p className="font-medium text-purple-300">
          {role}
        </p>

        <p className="mt-1 text-sm font-medium text-zinc-500">
          {startDate} • {endDate}
        </p>
      </div>

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li
            key={activity}
            className="
              text-sm
              leading-relaxed
              font-medium
              text-zinc-400
            "
          >
            • {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutMe() {
  return (
    <section
      id="aboutme"
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
        lg:py-24
      "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-0
            top-32
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

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <div
            className="
              mb-6
              h-px
              w-24
              bg-gradient-to-r
              from-transparent
              via-purple-500
              to-transparent
            "
          />

          <span
            className="
              mb-3
              inline-block
              text-sm
              font-medium
              uppercase
              tracking-widest
              text-purple-400
            "
          >
            Sobre Mim
          </span>

          <h1
            className="
              mb-6
              text-3xl
              font-extrabold
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            Quem sou eu
          </h1>

          <p
            className="
              max-w-3xl
              text-base
              leading-relaxed
              font-medium
              text-zinc-400
              sm:text-lg
            "
          >
            Desenvolvedor Full Stack com mais de 3 anos de experiência
            no desenvolvimento de produtos de crédito para uma fintech.
            Possuo sólida atuação em backend e atualmente estou
            aprimorando minhas competências em frontend estudando
            JavaScript, React e Next.js.
          </p>
        </div>

        <div
          className="
            mb-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >
          <InfoCard>
            <SectionTitle>Formação Acadêmica</SectionTitle>

            <div className="space-y-2">
              <p className="font-bold text-purple-300">
                Sistemas de Informação
              </p>

              <p className="font-medium text-zinc-400">
                Universidade Metodista de São Paulo
              </p>

              <p className="font-medium text-zinc-500">
                Conclusão: 2020
              </p>
            </div>
          </InfoCard>

          <InfoCard>
            <SectionTitle>Idiomas</SectionTitle>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-purple-300">
                  Inglês
                </p>

                <p className="text-zinc-400">
                  Nível Avançado (B2)
                </p>
              </div>

              <div>
                <p className="font-medium text-purple-300">
                  Português
                </p>

                <p className="text-zinc-400">
                  Fluente
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="mb-6">
          <InfoCard>
            <SectionTitle>Experiência Profissional</SectionTitle>

            <div className="space-y-10">
              {experiences.map((experience) => (
                <ExperienceCard
                  key={`${experience.company}-${experience.role}`}
                  {...experience}
                />
              ))}
            </div>
          </InfoCard>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >
          <InfoCard>
            <SectionTitle>Principais Tecnologias</SectionTitle>
            <p className="font-medium text-purple-300 m-4">
              FrontEnd
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {frontEndTechs.map(({ icon, name }) => (
                <TechBadge
                  key={name}
                  Icon={icon}
                  name={name}
                />
              ))}
            </div>
            <p className="font-medium text-purple-300 m-4">
              BackEnd
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {backEndTechs.map(({ icon, name }) => (
                <TechBadge
                  key={name}
                  Icon={icon}
                  name={name}
                />
              ))}
            </div>
            <p className="font-medium text-purple-300 m-4">
              Ferramentas
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {toolsTechs.map(({ icon, name }) => (
                <TechBadge
                  key={name}
                  Icon={icon}
                  name={name}
                />
              ))}
            </div>
          </InfoCard>

          <InfoCard>
            <SectionTitle>Cursos</SectionTitle>

            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={`${course.name}-${course.institution}`}
                  className="
                    rounded-lg
                    border
                    border-purple-500/10
                    bg-zinc-950/50
                    p-4
                    transition-all
                    duration-300
                    hover:border-purple-500/30
                    hover:bg-zinc-900/70
                  "
                >
                  <h3 className="font-medium text-white">
                    {course.name}
                  </h3>

                  <div
                    className="
                      mt-2
                      flex
                      flex-col
                      gap-1
                      text-sm
                      font-medium
                      text-zinc-400
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <span>{course.institution}</span>
                    <span>{course.conclusionYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}