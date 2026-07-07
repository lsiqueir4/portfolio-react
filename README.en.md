🇺🇸 English | 🇧🇷 [Português](README.md)

# Portfolio

Leandro Siqueira's personal portfolio, built with React 19, React Router 7 (SSR), TypeScript, and Tailwind CSS 4. Features Header, Hero, Projects, About Me, Contacts, and Footer sections.

## Live Demo

🔗 [https://lsiqueira.dev.br](https://lsiqueira.dev.br)

## Features

- **Light/dark theme toggle** — a toggle in the Header, with the preference saved to `localStorage` and automatic detection of the browser's `prefers-color-scheme`. Applies the theme before first paint with no visual flash, keeping purple as the accent color in both themes.
- **PT-BR/EN language toggle** — a toggle in the Header using `react-i18next`, with automatic browser language detection, persistence via `localStorage`, and translation of all user-facing content.
- **Six portfolio sections** — Header (navigation), Hero (intro and stack), Projects, About Me (experience, education, and skills), Contacts (WhatsApp, email, LinkedIn), and Footer.
- **Centralized theme token system** — semantic color tokens (`surface`, `accent`, `muted`, `border-subtle`, among others) replace hardcoded Tailwind color classes across every section, with shared `Section`/`Button` components eliminating duplicated visual patterns.

## Tech Stack

- **React** 19.2.6 — UI library
- **React Router** 7.15.1 — routing and SSR (server-side rendering)
- **TypeScript** 5.9.3 — static typing
- **Tailwind CSS** 4.2.2 — utility-first styling
- **i18next** / **react-i18next** — internationalization (PT-BR/EN)
- **lucide-react** / **react-icons** — icon libraries
- **@fontsource/outfit** — self-hosted Outfit font
- **Vite** — build tool and development server

## Getting Started

### Locally with npm

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run start
```

### With Docker

The project includes a multi-stage `Dockerfile`. To build and run the container:

```bash
docker build -t dev-portfolio-react .
docker run -p 3000:3000 dev-portfolio-react
```

The command run inside the container (the image's final `CMD`) is `npm run start`.

## Project Structure

The source code lives in `app/features/`, with one directory per portfolio section: `Header`, `Hero`, `Projects`, `AboutMe`, `Contacts`, and `Footer`. Each feature directory follows the `index.tsx` (component), `data.tsx` (static data), and `types.tsx` (TypeScript types) pattern.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
