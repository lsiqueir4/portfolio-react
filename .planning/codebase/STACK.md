# Technology Stack

**Analysis Date:** 2026-07-06

## Languages

**Primary:**
- TypeScript 5.9.3 - Full codebase (`.ts`, `.tsx` files)
- JSX/TSX - React component markup
- CSS - Styling with Tailwind CSS

**Secondary:**
- JavaScript - Build configuration and Node scripts

## Runtime

**Environment:**
- Node.js 20 (Alpine Linux) - See `Dockerfile`

**Package Manager:**
- npm - Specified in `package.json`
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.6 - UI library (`react`, `react-dom`)
- React Router 7.15.1 - Full-stack routing and SSR framework
  - `@react-router/dev` 7.15.1 - Development tooling
  - `@react-router/node` 7.15.1 - Node.js runtime adapter
  - `@react-router/serve` 7.15.1 - Production server (`npm start` command)

**Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework
- `@tailwindcss/vite` 4.2.2 - Vite plugin integration

**Build/Dev:**
- Vite 8.0.3 - Build tool and dev server (`vite.config.ts`)
- React Router dev tools - TypeScript code generation and dev server

## Key Dependencies

**Critical:**
- `react` 19.2.6 - Core React library
- `react-dom` 19.2.6 - DOM rendering
- `react-router` 7.15.1 - Routing, SSR, file-based routing
- `tailwindcss` 4.2.2 - Styling engine

**UI Components:**
- `lucide-react` 1.17.0 - Icon library (Phone, Mail, ExternalLink icons used in `app/features/Contacts/`)
- `react-icons` 5.6.0 - Additional icon libraries

**Fonts:**
- `@fontsource/outfit` 5.2.8 - Self-hosted Outfit font family

**Runtime Utilities:**
- `isbot` 5.1.36 - Bot detection utility

## Development Dependencies

**Linting & Formatting:**
- `eslint` 10.6.0 - JavaScript/TypeScript linter
- `@eslint/js` 10.0.1 - ESLint JS rules
- `typescript-eslint` 8.62.1 - TypeScript ESLint support
- `eslint-plugin-react-hooks` 7.1.1 - React Hooks linting rules
- `eslint-plugin-react-refresh` 0.5.3 - React Fast Refresh linting
- `prettier` 3.9.4 - Code formatter
- `eslint-config-prettier` 10.1.8 - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` 5.5.6 - Runs Prettier as ESLint rule

**Type Checking:**
- `typescript` 5.9.3 - TypeScript compiler
- `@types/react` 19.2.14 - React type definitions
- `@types/react-dom` 19.2.3 - React DOM type definitions
- `@types/node` 22 - Node.js type definitions

**Build & Development:**
- `@react-router/dev` 7.15.1 - React Router development server
- `@tailwindcss/vite` 4.2.2 - Tailwind CSS Vite plugin
- `vite` 8.0.3 - Bundler and dev server
- `globals` 17.7.0 - ESLint globals configuration

## Configuration

**Environment:**
- No `.env` file in use (no secrets or environment variables configured)
- `.gitignore` entry: `.env` (for future use)

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2022
- Module: ES2022
- Strict mode: enabled
- JSX mode: react-jsx
- Path alias: `~/*` → `./app/*` (for imports)

**Build:**
- Primary: `vite.config.ts` (Vite plugins: Tailwind CSS, React Router)
- React Router: `react-router.config.ts` (SSR enabled)

**Linting:**
- Config: `eslint.config.js` (Flat config format)
- Rule sets: JS recommended, TypeScript recommended, React Hooks, React Refresh
- Prettier integration: Enabled as ESLint rule

**Formatting:**
- Config: `.prettierrc` (JSON format)
- Settings:
  - Semicolons: true
  - Single quotes: false (double quotes)
  - Trailing commas: all
  - Print width: 100 characters
- Ignore file: `.prettierignore` (excludes `node_modules`, `build`, `dist`, `.react-router`)

**IDE:**
- Config: `.vscode/settings.json`
- Format on save: enabled
- Default formatter: Prettier
- ESLint auto-fix on save: enabled

## Scripts

**Development:**
```bash
npm run dev              # Start dev server (React Router dev)
npm run build           # Build for production (React Router build)
npm start               # Start production server (react-router-serve)
npm run typecheck       # Type-check with TypeScript and React Router typegen
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint with auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes
```

## Platform Requirements

**Development:**
- Node.js 20+ (Alpine Linux in Docker)
- npm or compatible package manager

**Production:**
- Node.js 20 (Alpine Linux base image from `Dockerfile`)
- Docker-ready multi-stage build
- SSR-enabled (React Router with full-stack rendering)

**Browser Support:**
- ES2022 JavaScript target
- Modern browsers (React 19 requirement)

---

*Stack analysis: 2026-07-06*
