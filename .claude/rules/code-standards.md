---
paths:
  - "src/**/*.{ts,tsx}"
  - "**/*.{test,spec}.{ts,tsx}"
  - "e2e/**/*.ts"
  - "next.config.ts"
---

# Front-End Engineering Standards

Strict and mandatory for every creation, refactor and review. Apply them automatically to React code, tests (`.test.ts`, `.spec.tsx`) and files under `src/` (components, hooks, services and the rest).

Examples and how-to: [architecture.md](../skills/nextjs-expert/architecture.md), [react-patterns.md](../skills/nextjs-expert/react-patterns.md) and [data-fetching.md](../skills/nextjs-expert/data-fetching.md).

## 1. Engineering principles

- **SOLID**, **DRY** and **Clean Code**.
- Simple, direct solutions (**KISS**).
- Tests for complex business logic and critical utilities.
- Handle errors in `try/catch`: **never** an empty `catch`, never swallow an error silently.

### Code conventions

- **Language:** code (variables, functions, technical comments) in **English**; user-visible error messages, interface descriptions and textual communication in **Portuguese**.
- **Formatting and linting:** follow **Prettier** and **ESLint** strictly. Never ignore linter warnings.
- **Indentation:** 2 spaces.
- **Line length:** 120 characters maximum.
- **Imports:** grouped, logically ordered, with no unused import.

### Naming

| Item | Convention | Example |
|------|------------|---------|
| Files and folders | `kebab-case` | `employee-form.tsx`, `use-debounce.ts` |
| Components, interfaces, types | `PascalCase` | `EmployeeForm`, `EmployeeFormProps` |
| Hooks | `camelCase` with `use` | `useDebounce` |
| Variables and functions | `camelCase`; booleans with `is`, `has`, `can` | `isPending` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Exports | Named; default only where Next.js requires it (`page`, `layout`, `error`, ...) | |

Prefer constant maps over `enum`.

## 2. Typing, security and storage

### TypeScript

- **Strict mode** is mandatory.
- **`any` is strictly forbidden.** For dynamic values use `unknown` and narrow it with type guards.
- Type all component props with **`interface`** (`type` only when a union or intersection needs it).
- Type React events (for example `React.ChangeEvent<HTMLInputElement>`).
- Explicit return types on exported functions, hooks, services and actions.
- Never `@ts-ignore` without a documented justification.
- **IDs and BigInt:** IDs from the backend are typed and kept as **`string`** to avoid precision loss. **Never** convert an ID to `number`.

### Security and local data

- **Avoid `localStorage` and `sessionStorage`** (XSS exposure). Never store sensitive data, authentication tokens or session information in Web Storage.
- Persist sessions with **`HttpOnly` cookies** managed by the backend or by Route Handlers; keep application lifecycle state in memory (Zustand or Context API).
- Secrets never use the `NEXT_PUBLIC_` prefix and never reach a Client Component.

## 3. React

### Conventions and style

- **Functional components only.** Class components are legacy and forbidden.
- **Arrow functions**, **destructuring** of props and objects, **spread/rest** operators.
- Document complex components and their props with **JSDoc**.

### Lists, keys and IDs

- **`key` is mandatory** when mapping arrays in TSX: unique and stable, normally the database `id`.
- **Never use the array `index` as `key`** in dynamic lists (reordered, filtered, added to or removed from): it causes re-render bugs and loses internal state.
- **Form ids:** always connect `<label>` and `<input>` with `htmlFor` and `id`.

### Logic and state

- **Separation of concerns:** components handle UI. Move complex business logic and data formatting to **custom hooks** or utilities.
- **Rules of Hooks:** never call a hook inside a condition or a loop.

## 4. Next.js architecture (App Router)

### Rendering strategy

- **Server Components first.**
- `'use client'` **only at the interactivity boundary**: state or lifecycle hooks, user events or browser APIs.

### Routing and native optimizations

- `<Image />` from `next/image` and `<Link />` from `next/link`.
- Navigation hooks from `next/navigation` (`useRouter`, `usePathname`).
- Route groups `(group-name)` to organize layouts without changing the URL.

## 5. Performance, accessibility and UI

### Re-render control

- **Avoiding unnecessary re-renders is a priority.**
- Isolate frequently changing state in small independent components so the whole page does not re-render.
- `useMemo` for heavy computation; `useCallback` for functions passed to memoized children.

### HTML semantics

- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`).
- **Critical:** never a fake button with `<div onClick>`. Always `<button>`.

## 6. Forms and APIs

### API access and proxy

- **A proxy is mandatory.** The browser reaches the backend only through `rewrites` in `next.config.ts` or Next.js Route Handlers. This avoids CORS problems and hides the origin URL.
- Server code (Server Components, Server Actions, Route Handlers) reaches the backend only through the single `server-only` client in `src/services/`, with the URL in a variable **without** `NEXT_PUBLIC_`.
- Server Components never call the application's own Route Handlers: call the service directly.
- Validate responses (`response.ok`) and handle the error path with friendly feedback **in Portuguese**.
- "Proxy" here is the communication layer. The Next.js file `proxy.ts` (formerly `middleware.ts`) runs before a request and is a different thing: [architecture.md](../skills/nextjs-expert/architecture.md#proxyts).

## 7. Testing

### Philosophy

- **Test behavior, not implementation:** interact as the user does and assert what is on screen, not internal state.
- **Standard tools:** **Jest** + **React Testing Library** for unit and integration tests; **Playwright** for E2E.

### Robust selectors

- Add **`data-testid`** to key structural elements that need testing, so tests survive CSS class or text changes.
- **RTL query priority:**
  1. `getByRole` (highest priority; guarantees accessibility).
  2. `getByLabelText` / `getByPlaceholderText` (forms).
  3. `getByTestId` (when the options above are not viable, or dynamic containers).
- **Forbidden:** selecting elements by CSS class (for example `.bg-blue-500` or `.container`).

### What must be tested

- **Custom hooks:** all isolated logic and return variations.
- **Core UI components** (buttons, modals, inputs, generic tables): 100% coverage.
- **Critical flows:** authentication, complex form submission and state-dependent lists.

## Dependencies

A new package needs approval.

## Pre-commit checklist

- [ ] No `any`
- [ ] No logic that causes unnecessary re-renders
- [ ] Every `map` has a `key` with a unique ID (not the `index`)
- [ ] Structural or complex elements have `data-testid`
- [ ] External requests go through the configured proxy
- [ ] No sensitive data in `localStorage` or `sessionStorage`
- [ ] `'use client'` only where there is interactivity
- [ ] Semantic HTML and interactive tags (no `<div onClick>`)
- [ ] IDs strictly typed as `string`
- [ ] Inputs connected to labels with `htmlFor` and `id`
- [ ] Loading, empty and error states handled, messages in Portuguese
- [ ] Tests written for the changed behavior
- [ ] ESLint without warnings and Prettier applied to the changed files

## Forbidden anti-patterns

1. Array `index` as `key` in dynamic lists.
2. CSS classes as selectors in unit or E2E tests.
3. `any` to escape strict typing.
4. Tokens or sensitive data in `localStorage` / `sessionStorage`.
5. `fetch` or `axios` straight to the backend URL without going through the application proxy.
6. Ignoring re-render control on complex pages.
7. `'use client'` at the top of whole layouts without need.
8. Converting database IDs to `number`.
