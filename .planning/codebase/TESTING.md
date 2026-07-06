# Testing Patterns

**Analysis Date:** 2026-07-06

## Current State

**Status:** No automated testing framework configured or in use

This is a portfolio site with static content and minimal interactivity. No test infrastructure (Jest, Vitest, React Testing Library, Playwright, etc.) is currently set up in the project.

## Test Framework

**Runner:** Not configured

**Assertion Library:** Not configured

**Run Commands:** Not available

## Why No Tests Currently

- **Project Type:** Static portfolio site with primarily presentational components
- **Content:** Static data in `data.tsx` files, no business logic or complex state management
- **Complexity:** Low-complexity feature components with minimal interactivity
- **Scope:** This is a personal portfolio project, not a production application requiring comprehensive coverage

## When Tests Should Be Added

Consider adding a testing framework if any of these apply:

1. **Interactive Features:** If dynamic interactivity increases (form validation, complex state)
2. **API Integration:** If the portfolio connects to backend APIs
3. **Business Logic:** If custom logic beyond component rendering is added
4. **Refactoring:** If major refactoring requires safety checks
5. **Team Development:** If the project moves to a team environment

## Recommended Test Setup (Future)

If testing becomes necessary, use this stack:

**For Component Testing:**
- **Framework:** Vitest (lightweight, fast, works with React Router)
- **Library:** React Testing Library (prefer testing behavior over implementation)
- **Configuration Location:** `vitest.config.ts`

**For E2E Testing:**
- **Framework:** Playwright (good for static sites and SPA testing)
- **Config Location:** `playwright.config.ts`

**Example package.json additions:**
```json
{
  "devDependencies": {
    "vitest": "^latest",
    "@testing-library/react": "^latest",
    "@testing-library/dom": "^latest",
    "jsdom": "^latest",
    "playwright": "^latest"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

## Component Test Structure (Future Reference)

**Location:** Co-located with components
- Place `ComponentName.test.tsx` next to `ComponentName.tsx`
- Group tests in `__tests__` directories if co-location not preferred

**File Organization Pattern (Example):**
```
app/features/Header/
├── index.tsx
├── types.tsx
├── Header.test.tsx          # or __tests__/Header.test.tsx
└── Header.integration.test.tsx
```

## Testing Approach (When Added)

**Unit Tests:** For pure components and utilities
- Test component rendering with various props
- Test user interactions (clicks, form inputs)
- Mock child components for isolation

**Integration Tests:** For feature workflows
- Test Header with router navigation
- Test ProjectContainer with data loading
- Test component composition

**Example test structure (for future implementation):**
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Projetos")).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", async () => {
    render(<Header />);
    const menuButton = screen.getByLabelText("Abrir menu");
    await userEvent.click(menuButton);
    // Assert menu is open
  });
});
```

## Mocking

**Framework:** Not yet needed, but Vitest's built-in mocking would be used

**What to Mock (Future Guidance):**
- API calls (if added)
- External dependencies (lucide-react icons can be mocked for snapshot stability)
- React Router context (for components using routing)

**What NOT to Mock:**
- Tailwind CSS utilities
- React hooks (useState, useEffect)
- Component tree structure

## Fixtures and Factories

**Test Data:** Not yet needed

**Future Pattern (Example):**
```typescript
// app/features/__tests__/fixtures/projects.ts
export const mockProjects = [
  {
    title: "Test Project",
    description: "A test project",
    usedTechs: [{ name: "React", icon: SiReact }],
    link: "https://github.com/test",
    image: "test.png",
  },
];
```

## Coverage

**Requirements:** None currently enforced

**Future Recommendations:**
- Target 80%+ coverage for interactive features
- Focus on critical user paths rather than 100% line coverage
- Use `vitest --coverage` to track metrics

## Test Types

### Unit Tests (Future)

**Scope:** Single component in isolation
- Props validation
- Conditional rendering
- Event handlers

**Example:** `TechBadge.test.tsx` testing the badge with different icon props

### Integration Tests (Future)

**Scope:** Multiple components working together
- Feature workflows
- Context/state passing
- Navigation flow

**Example:** Testing `Header` menu open/close with navigation

### E2E Tests (Future - Optional for Static Sites)

**Scope:** Full user journeys
- Homepage load and scroll
- Link navigation
- Responsive behavior

**Framework:** Playwright
- Not critical for static sites but useful for catching regressions

## Accessibility Testing (Future)

**When to Add:** If accessibility is a priority
- Use `@testing-library/jest-dom` matchers for a11y checks
- Include accessibility tests in component test files
- Example: `expect(button).toHaveAccessibleName("Abrir menu")`

## GitHub Actions / CI (Future)

**Suggested Workflow:** When tests are added
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "22"
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
```

---

*Testing analysis: 2026-07-06*

**Note:** This document provides guidance for *future* testing implementation. The project currently has no tests and does not require them given its static portfolio nature.
