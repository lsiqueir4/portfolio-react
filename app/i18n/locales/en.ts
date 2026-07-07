import type { pt } from "./pt";

// EN translation catalog — 1:1 faithful translation of pt.ts's meaning, no
// new content. Typed as `typeof pt` so the two catalogs can never drift out
// of structural sync (missing/extra keys become a type error).
export const en: typeof pt = {
  header: {
    home: "Home",
    projects: "Projects",
    about: "About me",
    contact: "Contact",
    openMenu: "Open menu",
    selectLanguage: "Select language",
  },
  common: {
    downloadCV: "Download CV",
    contactCTA: "Get in touch",
  },
  hero: {
    badge: "Available for opportunities",
    greeting: "Hello, I'm",
    role: "Full-Stack Developer",
    intro:
      "Developer with experience in REST APIs, banking integrations, credit products, and modern web applications using Python, Flask, React, and TypeScript.",
  },
  contacts: {
    heading: "Get in Touch",
    description:
      "I'm available for opportunities, freelance projects, and networking. Get in touch through the channels below.",
    whatsapp: "WhatsApp",
    email: "Email",
    linkedin: "Linkedin",
  },
  footer: {
    rights: "© {{year}} {{name}}. All rights reserved.",
  },
  about: {
    eyebrow: "About Me",
    title: "Who I am",
    subtitle:
      "Full Stack Developer with over 3 years of experience developing credit products for a fintech. I have a solid background in backend and I'm currently improving my frontend skills by studying JavaScript, React, and Next.js.",
    education: {
      heading: "Education",
      degree: "Information Systems",
      institution: "Universidade Metodista de São Paulo",
      completion: "Completion: 2020",
    },
    languages: {
      heading: "Languages",
      english: "English",
      englishLevel: "Advanced level (B2)",
      portuguese: "Portuguese",
      portugueseLevel: "Fluent",
    },
    experience: {
      heading: "Professional Experience",
    },
    experiences: {
      qitech: {
        role: "Backend Developer",
        startDate: "Feb 2022",
        endDate: "Sep 2025",
        activities: [
          "Worked on the development team responsible for credit products and solutions.",
          "Development of APIs and new products, bug-fixing routines, and customer support.",
          "Creation of unit and integration tests to ensure API functionality.",
          "Creation and monitoring of queues, tracking API and queue health using Grafana.",
        ],
      },
      viamar: {
        role: "Support Analyst",
        startDate: "Oct 2017",
        endDate: "Feb 2022",
        activities: [
          "Responsible for access control.",
          "Participation in IT project management.",
          "User support, help desk service, computer assembly and maintenance.",
        ],
      },
    },
    technologies: {
      heading: "Main Technologies",
      frontend: "FrontEnd",
      backend: "BackEnd",
      tools: "Tools",
    },
    courses: {
      heading: "Courses",
      dataScience: {
        name: "Data Science with Python",
        conclusionYear: "2026",
      },
      jsTsReact: {
        name: "Javascript/Typescript/Next.JS/React",
        conclusionYear: "In progress",
      },
      databases: {
        name: "Databases Without Mysteries",
        conclusionYear: "2022",
      },
      python: {
        name: "Python 3 - Basic to Advanced",
        conclusionYear: "2022",
      },
    },
  },
  projects: {
    title: "Projects",
    subtitle: "Projects developed to consolidate knowledge in the technologies I studied.",
    viewCode: "View code",
    portfolio: {
      title: "Portfolio",
      description:
        "Portfolio built with React to showcase personal projects and contact information.",
    },
    bankApi: {
      title: "Digital Bank REST API",
      description:
        "REST API built with Python, integrated with a digital bank's staging environment.",
    },
    prescriptionApi: {
      title: "Medical Prescription Generation REST API",
      description:
        "API built with Python featuring user authentication and permission logic that generates PDF documents for medical prescriptions.",
    },
  },
};
