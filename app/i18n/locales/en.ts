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
};
