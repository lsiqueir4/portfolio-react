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
  SiPostman,
} from "react-icons/si";

import type { Tech, Experience, Course } from "./types";

export const frontEndTechs: Tech[] = [
  { name: "React", icon: SiReact },
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
];

export const backEndTechs: Tech[] = [
  { name: "Python", icon: SiPython },
  { name: "Flask", icon: SiFlask },
  { name: "MySQL", icon: SiMysql },
  { name: "PostgreSQL", icon: SiPostgresql },
];

export const toolsTechs: Tech[] = [
  { name: "Redis", icon: SiRedis },
  { name: "Grafana", icon: SiGrafana },
  { name: "Opsgenie", icon: SiOpsgenie },
  { name: "Git", icon: SiGit },
  { name: "Docker", icon: SiDocker },
  { name: "Notion", icon: SiNotion },
  { name: "Postman", icon: SiPostman },
];

export const experiences: Experience[] = [
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

export const courses: Course[] = [
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
  },
];
