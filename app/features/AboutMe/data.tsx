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

import type { Tech, ExperienceData, CourseData } from "./types";

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

export const experiences: ExperienceData[] = [
  {
    id: "qitech",
    company: "QI Tech",
  },
  {
    id: "viamar",
    company: "Grupo Viamar",
  },
];

export const courses: CourseData[] = [
  {
    id: "anthropicAI",
    institution: "Anthropic",
  },
  {
    id: "dataScience",
    institution: "DIO",
  },
  {
    id: "jsTsReact",
    institution: "Udemy",
  },
  {
    id: "databases",
    institution: "Udemy",
  },
  {
    id: "python",
    institution: "Udemy/Cod3r",
  },
];
