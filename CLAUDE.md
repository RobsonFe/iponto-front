# iPonto Front-End

Web app for employee management and time tracking. Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5 (strict), Tailwind CSS 4 and ESLint 9. Node 20.9 or newer. The backend is `iponto-api` (NestJS). No authentication yet.

The project is new: it still has the initial template page. The structure below is the standard to follow as code is added.

@AGENTS.md

## Language

**Always reply in Brazilian Portuguese (PT-BR).** The developers are Brazilian. Code identifiers, technical comments and JSDoc are in English; UI text, user-facing error messages, test names, commits, pull requests and `docs/` are in Portuguese. Skills and rules are in English.

## Setup and commands

Run from the repository root.

```powershell
npm install
npm run dev
```

The app runs on `http://localhost:3000`. The API (`../iponto-api`) listens on `http://localhost:8080/api/v1`, with Swagger at `/doc`.

| Task | Command |
|------|---------|
| Generate route types | `npx next typegen` |
| Type check | `npx tsc --noEmit` (after `next typegen`) |
| Lint check | `npm run lint` · `npx eslint <files>` |
| Build | `npm run build` |
| Run the build | `npm run start` |
| Bundle analysis | `npx next analyze` |

Not installed yet: **Jest, React Testing Library, Playwright and Prettier**. Setup: [setup.md](.claude/skills/nextjs-test/setup.md). After installing, run only the tests tied to the change; the full suite only when asked.

## Cautions

- This Next.js has breaking changes: read `node_modules/next/dist/docs/` before using an API.
- `cacheComponents` and `partialPrefetching` are on (`next.config.ts`): runtime or uncached data goes inside `<Suspense>`; caching uses `'use cache'`; `export const dynamic` / `revalidate` do not apply. `npm run build` enforces this.
- `middleware.ts` is now `src/proxy.ts`.
- Tailwind runs through the Turbopack loader in `next.config.ts`; there is no `tailwind.config` file.
- `AGENTS.md` and `next-env.d.ts` are managed by Next.js: do not edit by hand.
- The API has no authentication and every route is public: the front-end is not a security boundary.
- Backend URL only in a server variable (for example `API_URL`), never `NEXT_PUBLIC_`. `.env*` files are ignored by Git.
- Personal data (CPF, CNPJ, e-mail, phone, address) never goes into URLs, logs, Web Storage or shared cache.
- A new dependency needs approval.

## Architecture

```text
src/
├── app/          routes, layouts, actions, Route Handlers
├── components/   shared components (ui/ for generic ones)
├── hooks/        custom hooks
├── services/     backend access (server-only client)
├── types/        API contracts and shared types
├── utils/        pure functions
└── proxy.ts      only when needed
public/           static files
```

Only `src/app/` exists today; create the other folders when they get their first file. Import alias: `@/*` → `src/*`.

- **Server Components first**; `'use client'` only at the interactive leaf.
- **Backend only through the proxy:** services on the server; `rewrites` or Route Handlers for the browser.
- **IDs are `string`.** No `any`.

Details: [architecture.md](.claude/skills/nextjs-expert/architecture.md) and [data-fetching.md](.claude/skills/nextjs-expert/data-fetching.md).

## How to work

1. Analyze the real code, then present a plan with files, signatures, rendering strategy and happy and unhappy tests.
2. **Wait for explicit approval** before editing.
3. Write the RED test, implement in small steps, run the scoped tests.
4. Validate (types, lint, boundaries, UI states, accessibility, exposed data) and review.
5. A finding outside the plan: ask "corrigir nesta branch ou abrir issue?".

Full workflow and modes (`[@Plan]`, `[@Code]`, `[@Test]`, `[@Review]`, `[@Doc]`): [nextjs-rules.md](.claude/rules/nextjs-rules.md).

## Skills

Load the skill **before** acting, even when the prompt does not name it, and load its companions.

| The task is about | Skill | Companions |
|-------------------|-------|------------|
| Implementation, routes, components, data, forms, refactor | `/nextjs-expert` | `/nextjs-test` first for anything new; `/impeccable` for visual work; `/nextjs-review` before merge |
| Bug, test, TDD, coverage, E2E | `/nextjs-test` | `/nextjs-expert` for the fix |
| Review, PR, security, LGPD, accessibility, performance | `/nextjs-review` | `/nextjs-test`; `/nextjs-expert` after approval |
| JSDoc, README, ADR | `/nextjs-docs` | `/nextjs-expert` to confirm behavior |
| UI and UX design | `/impeccable` | `/nextjs-expert` |
| Commit message, pull request | `/commit`, `/pr` | |

Full routing matrix and chains: [skills/README.md](.claude/skills/README.md).

## Rules loaded automatically

| File | When |
|------|------|
| [nextjs-rules.md](.claude/rules/nextjs-rules.md) | Always |
| [code-standards.md](.claude/rules/code-standards.md) | `src/`, test, `e2e/` TypeScript files and `next.config.ts` |
| [frontend-quality-gate.md](.claude/rules/frontend-quality-gate.md) | `src/`, `e2e/` files and `next.config.ts` |

Read [code-standards.md](.claude/rules/code-standards.md) before planning new code. Keep each fact in one place: mandatory rules in `.claude/rules/`, how-to in `.claude/skills/`, project facts here.
