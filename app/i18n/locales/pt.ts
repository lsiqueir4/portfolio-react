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
    selectLanguage: "Selecionar idioma",
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
  about: {
    eyebrow: "Sobre Mim",
    title: "Quem sou eu",
    subtitle:
      "Desenvolvedor Full Stack com mais de 3 anos de experiência no desenvolvimento de produtos de crédito para uma fintech. Possuo sólida atuação em backend e atualmente estou aprimorando minhas competências em frontend estudando JavaScript, React e Next.js.",
    education: {
      heading: "Formação Acadêmica",
      degree: "Sistemas de Informação",
      institution: "Universidade Metodista de São Paulo",
      completion: "Conclusão: 2020",
    },
    languages: {
      heading: "Idiomas",
      english: "Inglês",
      englishLevel: "Nível Avançado (B2)",
      portuguese: "Português",
      portugueseLevel: "Fluente",
    },
    experience: {
      heading: "Experiência Profissional",
    },
    experiences: {
      qitech: {
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
      viamar: {
        role: "Analista de suporte",
        startDate: "Out 2017",
        endDate: "Fev 2022",
        activities: [
          "Responsável pelo controle de acessos.",
          "Participação em gerenciamento de projetos de T.I.",
          "Suporte ao usuário, atendimento help desk, montagem e manutenção de computadores.",
        ],
      },
    },
    technologies: {
      heading: "Principais Tecnologias",
      frontend: "FrontEnd",
      backend: "BackEnd",
      tools: "Ferramentas",
    },
    courses: {
      heading: "Cursos",
      dataScience: {
        name: "Ciência de dados com Python",
        conclusionYear: "2026",
      },
      jsTsReact: {
        name: "Javascript/Typescript/Next.JS/React",
        conclusionYear: "Em andamento",
      },
      databases: {
        name: "Banco de dados sem mistérios",
        conclusionYear: "2022",
      },
      python: {
        name: "Python 3 - Básico ao Avançado",
        conclusionYear: "2022",
      },
    },
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
