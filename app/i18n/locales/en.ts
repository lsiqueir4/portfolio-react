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
};
