import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import TechBadge from "../UI/TechBadge";

import {
  SiReact,
  SiJavascript,
  SiPython,
  SiFlask,
  SiTypescript,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiGrafana,
  SiOpsgenie,
  SiGit,
  SiDocker,
  SiNotion,
} from "react-icons/si";

interface Tech {
  name: string;
  icon: IconType;
}

interface Course {
  name: string;
  institution: string;
  conclusionYear: string;
}

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  activities: string[];
}

const techs: Tech[] = [
  { name: "React", icon: SiReact },
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Python", icon: SiPython },
  { name: "Flask", icon: SiFlask },
  { name: "MySQL", icon: SiMysql },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Redis", icon: SiRedis },
  { name: "Grafana", icon: SiGrafana },
  { name: "Opsgenie", icon: SiOpsgenie },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "Notion", icon: SiNotion },
];

const experiences: Experience[] = [
  {
    company: "QI Tech",
    role: "Desenvolvedor Backend",
    startDate: "Fev 2022",
    endDate: "Set 2025",
    activities: [
      "Atuação na equipe de desenvolvimento referente aos produtos e soluções de crédito.",
      "Desenvolvimento de APIs e novos produtos, rotina de correção de problemas e suporte aos clientes.",
      "Criação de testes unitários e integrados para garantir o funcionamento das APIs.",
      "Criação e acompanhamento de filas, monitoramento da saúde das APIs e filas utilizando Grafana.",
    ],
  },
  {
    company: "Grupo Viamar",
    role: "Analista de suporte",
    startDate: "Out 2017",
    endDate: "Fev 2022",
    activities: [
      "Responsável pelo controle de acessos.",
      "Participação em gerenciamento de projetos de T.I.",
      "Suporte ao usuário, atendimento help desk, montagem e manutenção de computadores.",
    ],
  },
];

const courses: Course[] = [
  {
    name: "Ciência de dados com Python",
    institution: "DIO",
    conclusionYear: "2026",
  },
  {
    name: "Javascript/Typescript/Next.JS/React",
    institution: "Udemy",
    conclusionYear: "Em andamento",
  },
  {
    name: "Banco de dados sem mistérios",
    institution: "Udemy",
    conclusionYear: "2022",
  },
  {
    name: "Python 3 - Básico ao Avançado",
    institution: "Udemy/Cod3r",
    conclusionYear: "2022",
  }
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 text-xl font-semibold text-white">
      {children}
    </h2>
  );
}

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        rounded-2xl
        border border-purple-500/10
        bg-zinc-900/40
        p-6
        backdrop-blur-sm
        transition-all
        hover:border-purple-500/20
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
    <div className="relative border-l-2 border-purple-500/20 pl-8">
      <div className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-purple-400" />

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          {company}
        </h3>

        <p className="text-purple-300 font-medium">
          {role}
        </p>

        <p className="mt-1 text-sm text-zinc-500 font-medium">
          {startDate} • {endDate}
        </p>
      </div>

      <ul className="space-y-2">
        {activities.map((activity) => (
          <li
            key={activity}
            className="text-sm leading-relaxed text-zinc-400 font-medium"
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
      className="min-h-screen px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-purple-400">
            Sobre Mim
          </span>

          <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
            Quem sou eu
          </h1>

          <p className="max-w-3xl text-lg leading-relaxed text-zinc-400 font-medium">
            Desenvolvedor Full Stack com mais de 3 anos de experiência
            no desenvolvimento de produtos de crédito para uma fintech.
            Possuo sólida atuação em backend e atualmente estou
            aprimorando minhas competências em frontend estudando JavaScript, React e Next.js.
          </p>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <InfoCard>
            <SectionTitle>Formação Acadêmica</SectionTitle>

            <div className="space-y-2">
              <p className="font-bold text-purple-300">
                Sistemas de Informação
              </p>

              <p className="text-zinc-400 font-medium">
                Universidade Metodista de São Paulo
              </p>

              <p className="text-zinc-500 font-medium">
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

        <div className="grid gap-6 lg:grid-cols-2">
          <InfoCard>
            <SectionTitle>Principais Tecnologias</SectionTitle>

            <div className="flex flex-wrap gap-3">
              {techs.map(({ icon, name }) => (
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
                  className="rounded-lg border border-purple-500/10 bg-zinc-950/50 p-4"
                >
                  <h3 className="font-medium text-white">
                    {course.name}
                  </h3>

                  <div className="mt-1 flex items-center justify-between text-sm text-zinc-400 font-medium">
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