<!-- GSD:project-start source:PROJECT.md -->

## Project

**Portfolio — Theming, Dark Mode, i18n & README Refresh**

A personal portfolio site for Leandro Siqueira (React 19 + React Router 7 + TypeScript + Tailwind CSS 4), with Hero, About Me, Projects, Contacts, Header, and Footer sections. This milestone tackles the backlog already noted in the project's README: standardize the theme/colors, add dark mode, and add English language support — plus a bilingual README rewrite.

**Core Value:** Ship these visual and technical improvements (theme centralization, dark mode, PT-BR/EN language switch, bilingual README) without changing any existing content, copy, links, images, or site structure.

### Constraints

- **Content preservation**: No changes to text, images, or links — user explicit requirement
- **Structure preservation**: No changes to site structure/layout/routes — user explicit requirement
- **Tech stack**: Stay within React 19 / React Router 7 / TypeScript / Tailwind CSS 4; only new dependency expected is `react-i18next` (+ `i18next`) for phase 3
- **Visual identity**: Purple accent color must remain the primary accent in both light and dark themes

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.9.3 - Full codebase (`.ts`, `.tsx` files)
- JSX/TSX - React component markup
- CSS - Styling with Tailwind CSS
- JavaScript - Build configuration and Node scripts

## Runtime

- Node.js 20 (Alpine Linux) - See `Dockerfile`
- npm - Specified in `package.json`
- Lockfile: `package-lock.json` present

## Frameworks

- React 19.2.6 - UI library (`react`, `react-dom`)
- React Router 7.15.1 - Full-stack routing and SSR framework
- Tailwind CSS 4.2.2 - Utility-first CSS framework
- `@tailwindcss/vite` 4.2.2 - Vite plugin integration
- Vite 8.0.3 - Build tool and dev server (`vite.config.ts`)
- React Router dev tools - TypeScript code generation and dev server

## Key Dependencies

- `react` 19.2.6 - Core React library
- `react-dom` 19.2.6 - DOM rendering
- `react-router` 7.15.1 - Routing, SSR, file-based routing
- `tailwindcss` 4.2.2 - Styling engine
- `lucide-react` 1.17.0 - Icon library (Phone, Mail, ExternalLink icons used in `app/features/Contacts/`)
- `react-icons` 5.6.0 - Additional icon libraries
- `@fontsource/outfit` 5.2.8 - Self-hosted Outfit font family
- `isbot` 5.1.36 - Bot detection utility

## Development Dependencies

- `eslint` 10.6.0 - JavaScript/TypeScript linter
- `@eslint/js` 10.0.1 - ESLint JS rules
- `typescript-eslint` 8.62.1 - TypeScript ESLint support
- `eslint-plugin-react-hooks` 7.1.1 - React Hooks linting rules
- `eslint-plugin-react-refresh` 0.5.3 - React Fast Refresh linting
- `prettier` 3.9.4 - Code formatter
- `eslint-config-prettier` 10.1.8 - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` 5.5.6 - Runs Prettier as ESLint rule
- `typescript` 5.9.3 - TypeScript compiler
- `@types/react` 19.2.14 - React type definitions
- `@types/react-dom` 19.2.3 - React DOM type definitions
- `@types/node` 22 - Node.js type definitions
- `@react-router/dev` 7.15.1 - React Router development server
- `@tailwindcss/vite` 4.2.2 - Tailwind CSS Vite plugin
- `vite` 8.0.3 - Bundler and dev server
- `globals` 17.7.0 - ESLint globals configuration

## Configuration

- No `.env` file in use (no secrets or environment variables configured)
- `.gitignore` entry: `.env` (for future use)
- Config: `tsconfig.json`
- Target: ES2022
- Module: ES2022
- Strict mode: enabled
- JSX mode: react-jsx
- Path alias: `~/*` → `./app/*` (for imports)
- Primary: `vite.config.ts` (Vite plugins: Tailwind CSS, React Router)
- React Router: `react-router.config.ts` (SSR enabled)
- Config: `eslint.config.js` (Flat config format)
- Rule sets: JS recommended, TypeScript recommended, React Hooks, React Refresh
- Prettier integration: Enabled as ESLint rule
- Config: `.prettierrc` (JSON format)
- Settings:
- Ignore file: `.prettierignore` (excludes `node_modules`, `build`, `dist`, `.react-router`)
- Config: `.vscode/settings.json`
- Format on save: enabled
- Default formatter: Prettier
- ESLint auto-fix on save: enabled

## Scripts

## Platform Requirements

- Node.js 20+ (Alpine Linux in Docker)
- npm or compatible package manager
- Node.js 20 (Alpine Linux base image from `Dockerfile`)
- Docker-ready multi-stage build
- SSR-enabled (React Router with full-stack rendering)
- ES2022 JavaScript target
- Modern browsers (React 19 requirement)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Components: PascalCase (e.g., `Header.tsx`, `Projects.tsx`)
- Utilities/helpers: camelCase (e.g., `techBadge.tsx`)
- Types: `types.tsx` in feature directories
- Data: `data.tsx` in feature directories
- Feature directories: PascalCase (e.g., `Header/`, `Projects/`, `AboutMe/`)
- Component functions: PascalCase (e.g., `Header`, `Projects`, `ProjectContainer`)
- Helper functions: camelCase (e.g., `closeMenu`, `handleClick`)
- Constants: UPPER_SNAKE_CASE (e.g., `CONTACTS`)
- State variables: camelCase (e.g., `isMenuOpen`, `setIsMenuOpen`)
- Props objects: camelCase (e.g., `headerButtonProps`, `actionButtonProps`)
- Data objects: camelCase (e.g., `projects`, `experiences`, `courses`)
- Interfaces/types: PascalCase with `Props` or `Type` suffix (e.g., `HeaderButtonProps`, `ProjectContainerProps`, `Experience`)
- Type files: `types.tsx` or individual `.ts` files

## Code Style

- Prettier with custom configuration
- Print width: 100 characters
- Semicolons: enabled
- Single quotes: disabled (use double quotes)
- Trailing comma: all
- Configuration file: `.prettierrc`
- ESLint with TypeScript support
- Plugins: `react-hooks`, `react-refresh`, `prettier`
- Rules enforced:
- Configuration file: `eslint.config.js`

## Import Organization

- `~/*`: maps to `./app/*` (see `tsconfig.json`)
- Use absolute imports with `~` for clarity and to avoid brittle relative paths

## Error Handling

- Error handling via React Router's `ErrorBoundary` pattern (see `app/root.tsx`)
- Development-time error logging in error boundaries
- Status code checking with `isRouteErrorResponse()` for HTTP errors
- Graceful fallback UI for errors (e.g., 404 page, generic error message)
- Stack traces only shown in development mode (`import.meta.env.DEV`)

## Logging

- Minimal console logging in components
- Logging mainly in error boundaries during development
- No explicit logging statements in features or utilities
- Consider adding structured logging framework if needed in future

## Comments

- Avoid obvious comments
- Comment complex CSS class combinations when Tailwind classes span multiple lines
- Document props and types via TypeScript interfaces and JSDoc when needed
- Explain non-obvious logic or workarounds
- Minimal usage currently
- Type definitions provide most documentation via TypeScript
- Consider adding TSDoc for exported functions and components as project grows

## Function Design

- Use destructuring for props objects (see `Header` component pattern)
- Inline props typing for simple components
- Extract complex props to separate `types.tsx` files
- Components return JSX.Element
- Maintain consistent return types with TypeScript
- Avoid returning null without type annotation (use `React.ReactNode` or optional return)

## Module Design

- Components: use named exports when used as subcomponents (e.g., `export function Header`)
- Main feature components: use default export (e.g., `export default function Projects`)
- Utilities: use named exports
- Data: use named exports (e.g., `export const projects = [...]`)
- Not used in this codebase
- Direct imports from feature directories (e.g., `import { Header } from "~/features/Header"` imports from `index.tsx`)
- Feature directory contains:
- Shared components in `app/shared/` directory
- Constants in `app/constants/index.tsx`

## Component Patterns

- Group related components together (see `AboutMe/index.tsx`: `SectionTitle`, `InfoCard`, `ExperienceCard`)
- Keep internal components (not exported) in the same file
- Use props destructuring for clarity
- Define all component props in `types.tsx`
- Use TypeScript interfaces (not type aliases for props)
- Mark optional props with `?` in the interface
- Use React hooks (`useState`) for local component state
- No global state management library configured
- Pass state down to child components via props

## Tailwind CSS

- All styling via Tailwind utility classes
- Multi-line class strings for readability:
- Color scheme: primarily `zinc-*` (grays), `purple-*` (accent), with transparency variants
- Responsive prefixes: `sm:`, `md:`, `lg:` for mobile-first responsive design
- Group selectors for hover states: `group` and `group-hover:` (see `ProjectContainer`)

## TypeScript Configuration

- All TypeScript safety checks active
- Null/undefined checks enforced
- Type inference strict
- Modern JavaScript features available
- No transpilation needed for current browser targets
- Uses native ES imports/exports
- Type imports explicitly marked with `import type`

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root App | HTML layout, header, error boundary | `app/root.tsx` |
| Router Config | Route definitions | `app/routes.ts` |
| Home Route | Compose all feature sections | `app/routes/home.tsx` |
| Hero Section | Profile intro, CV download, tech stack | `app/features/Hero/index.tsx` |
| Projects Section | Project grid with cards | `app/features/Projects/index.tsx` |
| AboutMe Section | Exp., education, tech skills | `app/features/AboutMe/index.tsx` |
| Contacts Section | Contact methods (WhatsApp, Email, LinkedIn) | `app/features/Contacts/index.tsx` |
| Footer Section | Copyright notice | `app/features/Footer/index.tsx` |
| Header | Sticky nav with mobile menu | `app/features/Header/index.tsx` |
| TechBadge | Reusable tech icon+label component | `app/shared/TechBadge.tsx` |
| Constants | Contact data centralization | `app/constants/index.tsx` |

## Pattern Overview

- Single-page routing using React Router 7
- Feature modules colocate components with their data and types
- Centralized constants for configuration
- Utility-first CSS with Tailwind CSS v4
- Reusable shared components for common UI patterns
- Client-side rendering with no server-side logic

## Layers

- Purpose: Bootstrap the application and define routes
- Location: `app/root.tsx`, `app/routes.ts`
- Contains: Root layout component, route configuration, error boundary
- Depends on: React Router, feature components
- Used by: Vite build system
- Purpose: Compose features into page views
- Location: `app/routes/home.tsx`
- Contains: Page-level component composition
- Depends on: All feature components
- Used by: React Router
- Purpose: Self-contained feature modules with UI, data, and types
- Location: `app/features/[Feature]/`
- Contains: index.tsx (component), data.tsx (static data), types.tsx (TypeScript definitions)
- Depends on: Shared components, constants, icon libraries
- Used by: Route layer and other features
- Purpose: Reusable UI components used across multiple features
- Location: `app/shared/`
- Contains: Generic components like TechBadge
- Depends on: React, icon libraries, Tailwind CSS
- Used by: Multiple features
- Purpose: Centralized configuration and static data
- Location: `app/constants/index.tsx`
- Contains: Contact information, URLs, constants exported as `CONTACTS`
- Depends on: None
- Used by: All features that need contact/config data
- Purpose: Static media files
- Location: `app/assets/`
- Contains: Images (profile.png, project thumbnails)
- Depends on: None
- Used by: Components importing images

## Data Flow

### Primary Request Path

### Navigation Flow (Hash Scrolling)

### Data Loading

- Local component state only (React hooks)
- Example: Header uses `useState(false)` for mobile menu toggle → `[app/features/Header/index.tsx:70]`
- No global state management (Redux, Zustand) needed for this SPA

## Key Abstractions

- Purpose: Encapsulate a distinct section of the portfolio (Hero, Projects, etc.)
- Examples: `app/features/Hero/`, `app/features/Projects/`, `app/features/AboutMe/`
- Pattern: Each feature directory contains `index.tsx` (component), `data.tsx` (constants), `types.tsx` (TypeScript)
- Benefit: Easy to add/remove/modify features without affecting other parts
- Purpose: Reusable display of technology with icon + name
- Examples: Used in Hero, Projects, and AboutMe sections
- Pattern: `<TechBadge Icon={SiReact} name="React" />` renders icon + label with Tailwind styling
- File: `app/shared/TechBadge.tsx`
- Purpose: Separate data from presentation logic
- Examples: Projects list in `app/features/Projects/data.tsx`, experiences in `app/features/AboutMe/data.tsx`
- Pattern: Import array of objects, map to components
- Benefit: Easy to update portfolio content without touching JSX
- Purpose: Single source of truth for contact information and configuration
- Location: `app/constants/index.tsx` exports `CONTACTS` object
- Usage: All features import `CONTACTS` to access email, phone, links, etc.
- Benefit: Change contact info once, updates everywhere

## Entry Points

- Location: `index.html` (generated by React Router/Vite)
- Triggers: User visits domain
- Responsibilities: Bootstrap React app, mount to DOM
- Location: `app/root.tsx`
- Triggers: React Router mounts root component
- Responsibilities: Render HTML layout, Links (meta), Meta (title/description), Scripts
- Location: `app/routes/home.tsx`
- Triggers: User navigates to `/` (index route)
- Responsibilities: Compose all feature sections, set page meta (title/description)
- Location: `app/features/[Feature]/index.tsx` (e.g., `app/features/Hero/index.tsx`)
- Triggers: Home route includes feature component
- Responsibilities: Render feature section with content, data, styling

## Architectural Constraints

- **Threading:** Single-threaded event loop (browser JavaScript). No worker threads used.
- **Global state:** No global state variables. Header menu state is local to Header component via `useState`. All other state is derived from constants or component props.
- **Circular imports:** None detected. Data flows in one direction: routes → features → shared/constants.
- **Static rendering:** All content is pre-defined. No dynamic rendering or server-side generation.
- **Single route:** Only one route (`/`). Navigation uses hash scrolling, not React Router links.
- **Client-only:** No server-side rendering. Everything rendered in browser after hydration.

## Anti-Patterns

### Inline Data Coupled to Components

### Repeating Tailwind Classes

## Error Handling

- `ErrorBoundary` function in `app/root.tsx` catches React errors → `[app/root.tsx:54-79]`
- Returns fallback UI: "404" for 404 errors, generic "Error" for others
- Displays error message and stack trace in development mode
- No error logging service integrated (could be added)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
