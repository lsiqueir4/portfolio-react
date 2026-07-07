// PT-BR translation catalog — the site's native/default language.
// Structure MUST stay in sync with en.ts (same keys, same nesting) since
// en.ts is typed as `typeof pt`. Later plans (02-03) extend both files with
// hero/about/projects/contacts/footer sections.
export const pt = {
  header: {
    home: "Início",
    projects: "Projetos",
    about: "Quem sou eu",
    contact: "Contato",
    openMenu: "Abrir menu",
  },
  common: {
    downloadCV: "Baixar CV",
    contactCTA: "Entre em contato",
  },
  hero: {
    badge: "Disponível para oportunidades",
    greeting: "Olá, eu sou",
    role: "Desenvolvedor Full-Stack",
    intro:
      "Desenvolvedor com experiência em APIs REST, integrações bancárias, produtos de crédito e aplicações web modernas utilizando Python, Flask, React e TypeScript.",
  },
  contacts: {
    heading: "Entre em Contato",
    description:
      "Estou disponível para oportunidades, projetos freelance e networking. Entre em contato pelos canais abaixo.",
    whatsapp: "WhatsApp",
    email: "Email",
    linkedin: "Linkedin",
  },
  footer: {
    rights: "© {{year}} {{name}}. Todos os direitos reservados.",
  },
  projects: {
    title: "Projetos",
    subtitle: "Projetos desenvolvidos para consolidar conhecimentos nas tecnologias que estudei.",
    viewCode: "Ver código",
    portfolio: {
      title: "Portfólio",
      description:
        "Portfólio desenvolvido em React para divulgar projetos pessoais e informações para contato.",
    },
    bankApi: {
      title: "API REST Banco digital",
      description:
        "API Rest desenvolvida em Python com a integração ao ambiente de homologação de um banco digital.",
    },
    prescriptionApi: {
      title: "API REST Geração de receitas médicas",
      description:
        "API desenvolvida em Python com autenticação de usuários e lógica de permissionamento que gera documentos em PDF para receitas médicas.",
    },
  },
};
