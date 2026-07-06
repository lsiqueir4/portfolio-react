# Coding Conventions

**Analysis Date:** 2026-07-06

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Header.tsx`, `Projects.tsx`)
- Utilities/helpers: camelCase (e.g., `techBadge.tsx`)
- Types: `types.tsx` in feature directories
- Data: `data.tsx` in feature directories
- Feature directories: PascalCase (e.g., `Header/`, `Projects/`, `AboutMe/`)

**Functions:**
- Component functions: PascalCase (e.g., `Header`, `Projects`, `ProjectContainer`)
- Helper functions: camelCase (e.g., `closeMenu`, `handleClick`)
- Constants: UPPER_SNAKE_CASE (e.g., `CONTACTS`)

**Variables:**
- State variables: camelCase (e.g., `isMenuOpen`, `setIsMenuOpen`)
- Props objects: camelCase (e.g., `headerButtonProps`, `actionButtonProps`)
- Data objects: camelCase (e.g., `projects`, `experiences`, `courses`)

**Types:**
- Interfaces/types: PascalCase with `Props` or `Type` suffix (e.g., `HeaderButtonProps`, `ProjectContainerProps`, `Experience`)
- Type files: `types.tsx` or individual `.ts` files

## Code Style

**Formatting:**
- Prettier with custom configuration
- Print width: 100 characters
- Semicolons: enabled
- Single quotes: disabled (use double quotes)
- Trailing comma: all
- Configuration file: `.prettierrc`

**Linting:**
- ESLint with TypeScript support
- Plugins: `react-hooks`, `react-refresh`, `prettier`
- Rules enforced:
  - `react-refresh/only-export-components`: warn for non-component exports
  - `prettier/prettier`: error for formatting violations
- Configuration file: `eslint.config.js`

## Import Organization

**Order:**
1. React and library imports (`import React`, `import { useState }`)
2. Type imports (`import type { SomeType }`)
3. Third-party library imports (e.g., `lucide-react`, `react-icons`)
4. Local absolute imports using path alias (e.g., `~/constants`, `~/features/Header`)
5. Relative imports for same-directory modules

**Path Aliases:**
- `~/*`: maps to `./app/*` (see `tsconfig.json`)
- Use absolute imports with `~` for clarity and to avoid brittle relative paths

**Example pattern from `app/features/Header/index.tsx`:**
```typescript
import { useState } from "react";
import type { HeaderButtonProps, ActionButtonProps } from "./types";
import { Download, Menu, Send, X } from "lucide-react";
import { CONTACTS } from "~/constants";
```

## Error Handling

**Patterns:**
- Error handling via React Router's `ErrorBoundary` pattern (see `app/root.tsx`)
- Development-time error logging in error boundaries
- Status code checking with `isRouteErrorResponse()` for HTTP errors
- Graceful fallback UI for errors (e.g., 404 page, generic error message)
- Stack traces only shown in development mode (`import.meta.env.DEV`)

**Example from `app/root.tsx` ErrorBoundary:**
```typescript
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  // ... render error UI
}
```

## Logging

**Framework:** `console` (no logger library configured)

**Patterns:**
- Minimal console logging in components
- Logging mainly in error boundaries during development
- No explicit logging statements in features or utilities
- Consider adding structured logging framework if needed in future

## Comments

**When to Comment:**
- Avoid obvious comments
- Comment complex CSS class combinations when Tailwind classes span multiple lines
- Document props and types via TypeScript interfaces and JSDoc when needed
- Explain non-obvious logic or workarounds

**JSDoc/TSDoc:**
- Minimal usage currently
- Type definitions provide most documentation via TypeScript
- Consider adding TSDoc for exported functions and components as project grows

## Function Design

**Size:** Prefer small, focused functions

**Parameters:**
- Use destructuring for props objects (see `Header` component pattern)
- Inline props typing for simple components
- Extract complex props to separate `types.tsx` files

**Return Values:**
- Components return JSX.Element
- Maintain consistent return types with TypeScript
- Avoid returning null without type annotation (use `React.ReactNode` or optional return)

**Example from `app/features/Header/index.tsx`:**
```typescript
function HeaderButton({ children, href = "#", onClick }: HeaderButtonProps) {
  return (
    <li>
      <a href={href} onClick={onClick} className="...">
        {children}
      </a>
    </li>
  );
}
```

## Module Design

**Exports:**
- Components: use named exports when used as subcomponents (e.g., `export function Header`)
- Main feature components: use default export (e.g., `export default function Projects`)
- Utilities: use named exports
- Data: use named exports (e.g., `export const projects = [...]`)

**Barrel Files:**
- Not used in this codebase
- Direct imports from feature directories (e.g., `import { Header } from "~/features/Header"` imports from `index.tsx`)

**File Structure:**
- Feature directory contains:
  - `index.tsx`: main component and subcomponents
  - `types.tsx`: TypeScript interfaces and types
  - `data.tsx`: static data and constants
- Shared components in `app/shared/` directory
- Constants in `app/constants/index.tsx`

## Component Patterns

**Compound Components:**
- Group related components together (see `AboutMe/index.tsx`: `SectionTitle`, `InfoCard`, `ExperienceCard`)
- Keep internal components (not exported) in the same file
- Use props destructuring for clarity

**Props Typing:**
- Define all component props in `types.tsx`
- Use TypeScript interfaces (not type aliases for props)
- Mark optional props with `?` in the interface

**State Management:**
- Use React hooks (`useState`) for local component state
- No global state management library configured
- Pass state down to child components via props

## Tailwind CSS

**Patterns:**
- All styling via Tailwind utility classes
- Multi-line class strings for readability:
  ```typescript
  className="
    flex
    items-center
    justify-between
    rounded-lg
    bg-purple-500
    px-4
    py-2"
  ```
- Color scheme: primarily `zinc-*` (grays), `purple-*` (accent), with transparency variants
- Responsive prefixes: `sm:`, `md:`, `lg:` for mobile-first responsive design
- Group selectors for hover states: `group` and `group-hover:` (see `ProjectContainer`)

## TypeScript Configuration

**Strict Mode:** Enabled
- All TypeScript safety checks active
- Null/undefined checks enforced
- Type inference strict

**Compilation Target:** ES2022
- Modern JavaScript features available
- No transpilation needed for current browser targets

**Module System:** ES2022 with verbatim module syntax
- Uses native ES imports/exports
- Type imports explicitly marked with `import type`

---

*Convention analysis: 2026-07-06*
