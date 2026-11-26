# Architecture

Folders, routes and Server/Client boundaries. Mandatory rules: [code-standards.md](../../rules/code-standards.md). Layer of [`/nextjs-expert`](SKILL.md).

## When to load

- Creating a route, layout, folder or shared module.
- Deciding where `'use client'` goes.
- Adding error, loading or not-found states, metadata, `proxy.ts` or environment variables.

## Folder structure

```text
src/
├── app/                       routes
│   ├── layout.tsx             root layout (lang="pt-BR")
│   ├── (marketing)/           route group, no URL segment
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── actions.ts         Server Actions of the route
│   │   ├── _components/       private folder: not routable
│   │   └── [id]/page.tsx
│   └── api/                   Route Handlers
├── components/
│   ├── ui/                    generic: button, input, modal, table
│   └── <feature>/             shared by more than one route
├── hooks/
├── services/
│   └── api/                   single server-only backend client
├── types/
├── utils/
├── stores/                    only when global client state is needed
└── proxy.ts                   only when needed
public/                        stays at the root
```

Create a folder only when it has a file. Colocate first; promote to `src/components/` on the second consumer.

Dependency direction: `app` → `components` → `hooks` → `utils` / `types`. `services` is used by `app` (and by server code), never by a Client Component.

## Server and Client Components

| Needs | Component |
|-------|-----------|
| Data, secrets, large libraries used only to render | Server |
| State, effects, event handlers, browser APIs, context consumers | Client |
| Both | Server parent fetches, Client leaf interacts |

Rules:

- `'use client'` marks a boundary: everything it imports ships to the browser. Put it on the smallest component.
- Props crossing the boundary must be serializable. Pass only the fields the client needs.
- A Client Component can receive Server Components as `children`.
- Context providers live in their own Client Component, rendered as deep as possible.
- Mark server modules with `import 'server-only'`.

```tsx
// src/app/employees/page.tsx (Server Component)
import { SearchField } from './_components/search-field';

export default function EmployeesPage() {
  return (
    <main>
      <h1>Funcionários</h1>
      <SearchField />
    </main>
  );
}
```

## Special files

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared UI; keeps state across navigations |
| `loading.tsx` | Route-level Suspense fallback |
| `error.tsx` | Route error boundary (Client Component) |
| `global-error.tsx` | Errors in the root layout |
| `not-found.tsx` | UI for `notFound()` |
| `route.ts` | Route Handler; cannot share a segment with `page.tsx` |
| `default.tsx` | Fallback of a parallel route slot |
| `template.tsx` | Layout that remounts on navigation |

### Error boundary

`error` is `unknown`: narrow it. Never show its message to the user; server errors arrive sanitized with a `digest`.

```tsx
'use client';

interface ErrorPageProps {
  error: unknown;
  retry: () => void;
}

export default function EmployeesError({ retry }: ErrorPageProps) {
  return (
    <div role="alert" data-testid="employees-error">
      <h2>Não foi possível carregar os funcionários.</h2>
      <button type="button" onClick={() => retry()}>
        Tentar novamente
      </button>
    </div>
  );
}
```

## Dynamic routes and params

`params` and `searchParams` are Promises. With Cache Components, await them inside `<Suspense>`.

```tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { findEmployee } from '@/services/employee-service';

const EmployeeDetails = async ({ params }: Pick<PageProps<'/employees/[id]'>, 'params'>) => {
  const { id } = await params;
  const employee = await findEmployee(id);

  if (!employee) {
    notFound();
  }

  return <h1>{employee.nome}</h1>;
};

export default function EmployeePage({ params }: PageProps<'/employees/[id]'>) {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <EmployeeDetails params={params} />
    </Suspense>
  );
}
```

`id` stays a `string`.

## Advanced routing

| Pattern | Use for |
|---------|---------|
| Route group `(name)` | Organize layouts without changing the URL |
| Private folder `_name` | Files that are not routes |
| Parallel route `@slot` | Independent sections with their own loading and error states |
| Intercepting route `(.)` | Modal over the current page with a shareable URL |

Examples: [app-router-patterns.md](references/app-router-patterns.md) (check the [divergences](SKILL.md#external-material-do-not-apply-directly)).

## Metadata

- Static: `export const metadata: Metadata`.
- Dynamic: `generateMetadata`; with Cache Components, runtime or uncached reads there need the same care as in the page.
- Titles and descriptions in Portuguese. No personal data in metadata.

## proxy.ts

`src/proxy.ts` (formerly `middleware.ts`) runs before a request completes. Use it for redirects, rewrites and headers, with a restrictive `matcher`.

- It is **not** the API proxy required by the standards; that is `rewrites` or Route Handlers ([data-fetching.md](data-fetching.md#proxy-to-the-backend)).
- No slow data fetching and no full authorization there: optimistic checks only.
- Only one `proxy.ts` per project.

## Environment variables

- Server only by default. `NEXT_PUBLIC_` ships the value to the browser: never use it for secrets or for the backend URL.
- `.env*` files stay at the project root (not in `src/`) and are ignored by Git. Document each variable in `README.md`.
- Read `process.env` in one place (the service or a config module) and fail fast when a required variable is missing.
- `next.config.ts` values, including `rewrites` destinations, are resolved at build time.
