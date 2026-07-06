<!-- refreshed: 2026-07-06 -->
# Architecture

**Analysis Date:** 2026-07-06

## System Overview

```text
┌──────────────────────────────────────────────────────────────────┐
│                    React Router Entry Layer                      │
│              root.tsx + routes.ts + vite.config.ts               │
├──────────────────────────────────────────────────────────────────┤
│                     Layout & Navigation                          │
│                   `app/root.tsx` (Header)                        │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
        ┌──────────────────┬──────────────────┬──────────────────┐
        │ Route Layer      │ Feature Layer    │ Shared Layer     │
        │ routes/home.tsx  │ features/*/      │ shared/          │
        └──────────────────┴──────────────────┴──────────────────┘
                    │
        ┌───────────┼───────────┬──────────┬──────────┐
        ▼           ▼           ▼          ▼          ▼
    ┌────────┬──────────┬─────────────┬──────────┬────────┐
    │ Hero   │ Projects │ AboutMe     │ Contacts │ Footer │
    │ Sec.   │ Section  │ Section     │ Section  │ Sec.   │
    │ `fx/H` │ `fx/P`   │ `fx/A`      │ `fx/C`   │ `fx/F` │
    └────────┴──────────┴─────────────┴──────────┴────────┘
        │        │          │           │          │
        ├───────┤│├──────┤│├─────────┤│
        │        │        │         │
        ▼        ▼        ▼         ▼
    ┌─────────────────────────────────────┐
    │      Constants & Configuration      │
    │      `app/constants/index.tsx`      │
    │      (CONTACTS data)                │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │      Static Assets                  │
    │      `app/assets/` (images)         │
    └─────────────────────────────────────┘
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

**Overall:** Feature-based Single Page Application (SPA) with data-driven components

**Key Characteristics:**
- Single-page routing using React Router 7
- Feature modules colocate components with their data and types
- Centralized constants for configuration
- Utility-first CSS with Tailwind CSS v4
- Reusable shared components for common UI patterns
- Client-side rendering with no server-side logic

## Layers

**Entry Point Layer:**
- Purpose: Bootstrap the application and define routes
- Location: `app/root.tsx`, `app/routes.ts`
- Contains: Root layout component, route configuration, error boundary
- Depends on: React Router, feature components
- Used by: Vite build system

**Route Layer:**
- Purpose: Compose features into page views
- Location: `app/routes/home.tsx`
- Contains: Page-level component composition
- Depends on: All feature components
- Used by: React Router

**Feature Layer:**
- Purpose: Self-contained feature modules with UI, data, and types
- Location: `app/features/[Feature]/`
- Contains: index.tsx (component), data.tsx (static data), types.tsx (TypeScript definitions)
- Depends on: Shared components, constants, icon libraries
- Used by: Route layer and other features

**Shared Layer:**
- Purpose: Reusable UI components used across multiple features
- Location: `app/shared/`
- Contains: Generic components like TechBadge
- Depends on: React, icon libraries, Tailwind CSS
- Used by: Multiple features

**Constants Layer:**
- Purpose: Centralized configuration and static data
- Location: `app/constants/index.tsx`
- Contains: Contact information, URLs, constants exported as `CONTACTS`
- Depends on: None
- Used by: All features that need contact/config data

**Assets Layer:**
- Purpose: Static media files
- Location: `app/assets/`
- Contains: Images (profile.png, project thumbnails)
- Depends on: None
- Used by: Components importing images

## Data Flow

### Primary Request Path

1. User loads `http://localhost:5173/` or production URL
2. Vite/React Router loads entry point (`app/root.tsx`) → `[app/root.tsx:45]`
3. Root component renders layout with Header and `<Outlet />` → `[app/root.tsx:27-43]`
4. React Router renders matched route: `routes/home.tsx` → `[app/routes/home.tsx:15-25]`
5. Home route composes all feature sections in sequence: Hero → Projects → AboutMe → Contacts → Footer
6. Each feature component renders its UI with Tailwind classes and icons
7. Browser renders the scrollable single-page layout

### Navigation Flow (Hash Scrolling)

1. User clicks navigation link in Header (e.g., "Projetos") → `[app/features/Header/index.tsx:121-125]`
2. Header renders anchor with `href="#projetos"` → `[app/features/Header/index.tsx:98-127]`
3. Browser performs hash-based scroll to matching `id` on Projects section → `[app/features/Projects/index.tsx:109]`
4. Mobile menu closes via `closeMenu()` state handler → `[app/features/Header/index.tsx:74]`

### Data Loading

Static data is loaded at component initialization time from data files:

1. Feature component imports data: `import { techs } from "./data"` → `[app/features/Hero/index.tsx:5]`
2. Data file contains constant arrays (techs, projects, experiences) → `[app/features/Hero/data.tsx:12-21]`
3. Component maps over data in render: `.map((tech) => <TechBadge {...tech} />)` → `[app/features/Hero/index.tsx:184-186]`
4. No API calls, all data is baked into the component bundle

**State Management:**
- Local component state only (React hooks)
- Example: Header uses `useState(false)` for mobile menu toggle → `[app/features/Header/index.tsx:70]`
- No global state management (Redux, Zustand) needed for this SPA

## Key Abstractions

**Feature Module Pattern:**
- Purpose: Encapsulate a distinct section of the portfolio (Hero, Projects, etc.)
- Examples: `app/features/Hero/`, `app/features/Projects/`, `app/features/AboutMe/`
- Pattern: Each feature directory contains `index.tsx` (component), `data.tsx` (constants), `types.tsx` (TypeScript)
- Benefit: Easy to add/remove/modify features without affecting other parts

**Tech Badge Component:**
- Purpose: Reusable display of technology with icon + name
- Examples: Used in Hero, Projects, and AboutMe sections
- Pattern: `<TechBadge Icon={SiReact} name="React" />` renders icon + label with Tailwind styling
- File: `app/shared/TechBadge.tsx`

**Data-Driven Components:**
- Purpose: Separate data from presentation logic
- Examples: Projects list in `app/features/Projects/data.tsx`, experiences in `app/features/AboutMe/data.tsx`
- Pattern: Import array of objects, map to components
- Benefit: Easy to update portfolio content without touching JSX

**Constants Export:**
- Purpose: Single source of truth for contact information and configuration
- Location: `app/constants/index.tsx` exports `CONTACTS` object
- Usage: All features import `CONTACTS` to access email, phone, links, etc.
- Benefit: Change contact info once, updates everywhere

## Entry Points

**HTML Entry (Browser):**
- Location: `index.html` (generated by React Router/Vite)
- Triggers: User visits domain
- Responsibilities: Bootstrap React app, mount to DOM

**React Entry:**
- Location: `app/root.tsx`
- Triggers: React Router mounts root component
- Responsibilities: Render HTML layout, Links (meta), Meta (title/description), Scripts

**Route Entry:**
- Location: `app/routes/home.tsx`
- Triggers: User navigates to `/` (index route)
- Responsibilities: Compose all feature sections, set page meta (title/description)

**Feature Entry:**
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

**What happens:** Early versions may have hardcoded project/experience data directly in component JSX.
**Why it's wrong:** Makes components cluttered, hard to update content, mixes concerns (data ≠ UI).
**Do this instead:** Export data to `data.tsx` file and import: `import { projects } from "./data"` as in `app/features/Projects/data.tsx`. This follows the current established pattern.

### Repeating Tailwind Classes

**What happens:** Large className strings are duplicated across components (button styles, card styles).
**Why it's wrong:** Makes maintenance harder, inconsistent styling, bloated component code.
**Do this instead:** Extract repeated patterns into shared components. Example: `Button` component in `app/features/Hero/index.tsx` wraps common button styles. Extend this pattern for cards, sections, etc.

## Error Handling

**Strategy:** Client-side error boundary in root component

**Patterns:**
- `ErrorBoundary` function in `app/root.tsx` catches React errors → `[app/root.tsx:54-79]`
- Returns fallback UI: "404" for 404 errors, generic "Error" for others
- Displays error message and stack trace in development mode
- No error logging service integrated (could be added)

## Cross-Cutting Concerns

**Logging:** None implemented. Could add logging for analytics or debugging.

**Validation:** No input validation needed (read-only portfolio). If forms added, validate on client before submission.

**Authentication:** No auth needed. Portfolio is public. If login added, use React Router loaders/actions.

**Styling:** Tailwind CSS with custom theme in `app/app.css` using `@theme` directive. All colors use predefined Tailwind palette (purple-500, zinc-950, etc.).

---

*Architecture analysis: 2026-07-06*
