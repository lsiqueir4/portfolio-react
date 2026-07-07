import type { ProjectData } from "./types";
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
import Portfolio from "~/assets/projects/portfolio.png";
import BankApi from "~/assets/projects/bank-api.png";
import OnlinePrescriptionApi from "~/assets/projects/online-prescription-api.png";
import { CONTACTS } from "~/constants";

export const projects: ProjectData[] = [
  {
    id: "portfolio",
    usedTechs: [
      { name: "React", icon: SiReact },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "TailwindCSS", icon: SiTailwindcss },
    ],
    link: `${CONTACTS.github}portfolio-react`,
    image: Portfolio,
  },
  {
    id: "bankApi",
    usedTechs: [
      { name: "Python", icon: SiPython },
      { name: "Flask", icon: SiFlask },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Docker", icon: SiDocker },
      { name: "Pytest", icon: SiPytest },
      { name: "AWS", icon: DiAws },
      { name: "SQLAlchemy", icon: SiSqlalchemy },
    ],
    link: `${CONTACTS.github}bank-integration`,
    image: BankApi,
  },
  {
    id: "prescriptionApi",
    usedTechs: [
      { name: "Python", icon: SiPython },
      { name: "Flask", icon: SiFlask },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Docker", icon: SiDocker },
      { name: "Pytest", icon: SiPytest },
      { name: "SQLAlchemy", icon: SiSqlalchemy },
    ],
    link: `${CONTACTS.github}online-prescription-api`,
    image: OnlinePrescriptionApi,
  },
];
