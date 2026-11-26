# Data Fetching, Cache and API Integration

Backend access, proxy, caching and revalidation. Mandatory rules: [code-standards.md](../../rules/code-standards.md#6-forms-and-apis). Layer of [`/nextjs-expert`](SKILL.md).

## When to load

- Reading or writing data from the API.
- Adding a service, a `rewrites` rule, a cache or a revalidation.

## Backend contract (iponto-api)

Sibling repository `../iponto-api` (NestJS). Local base URL `http://localhost:8080/api/v1`, Swagger at `http://localhost:8080/doc`. **Confirm the contract in the backend code or Swagger before typing it.**

| Topic | Behavior |
|-------|----------|
| Resources | `company`, `employee` |
| Existing routes | `POST save`, `GET list`, `GET find/:id`, `PATCH update/:id`, `DELETE delete/:id`, `GET count` |
| Existing responses | The entity, the list or the number, with no envelope |
| New backend routes | `{ result }` or `{ results, meta: { page, limit, total } }` |
| Pagination | `page` and `limit` query parameters; limits are in the backend DTO |
| Errors | `statusCode`, `message` (string or list), `error`; new routes add `timestamp` and `path` |
| IDs | UUID `string` |
| Fields | Portuguese names (`nome`, `endereco`); do not rename them silently |
| Authentication | None yet |
| Validation | Unknown fields are rejected with `400` |

## Layers

```text
Server Component / Server Action / Route Handler
        → src/services/<resource>-service.ts   parse, translate errors
        → src/services/api/server-client.ts    server-only, one place for the URL
        → iponto-api

Browser (only when it must fetch)
        → /api/backend/...  (rewrite)  or  /api/...  (Route Handler)
        → iponto-api
```

## Server client

`src/services/api/server-client.ts`

```ts
import 'server-only';

/** Error returned by the backend, carrying the HTTP status. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getBaseUrl = (): string => {
  const url = process.env.API_URL;

  if (!url) {
    throw new Error('API_URL is not configured');
  }

  return url;
};

/**
 * Sends a request to the backend.
 *
 * @returns The parsed body as `unknown`, or `undefined` for `204`.
 * @throws {ApiError} When the response status is not successful.
 */
export const apiRequest = async (path: string, init: RequestInit = {}): Promise<unknown> => {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getBaseUrl()}${path}`, { ...init, headers });

  if (!response.ok) {
    throw new ApiError(response.status, `Backend request failed: ${init.method ?? 'GET'} ${path}`);
  }

  return response.status === 204 ? undefined : response.json();
};
```

The technical message stays on the server. The user sees a Portuguese message chosen from the status ([forms-and-api.md](forms-and-api.md#error-feedback)). Do not log paths that carry personal data.

## Services

Validate what arrives: an API response is `unknown` until a type guard proves it.

```ts
import 'server-only';
import { apiRequest } from '@/services/api/server-client';
import { isEmployeeList, type Employee } from '@/types/employee';

/** Lists employees of the given page. */
export const listEmployees = async (page?: number): Promise<Employee[]> => {
  const query = page === undefined ? '' : `?${new URLSearchParams({ page: String(page) })}`;
  const body = await apiRequest(`/employee/list${query}`);

  if (!isEmployeeList(body)) {
    throw new Error('Unexpected employee list payload');
  }

  return body;
};
```

- Encode every value placed in a URL (`URLSearchParams`, `encodeURIComponent` for path segments).
- Return only the fields the UI needs (minimal DTO).
- A schema library (for example `zod`) needs approval.

## Proxy to the backend

Use `rewrites` for plain forwarding:

```ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};
```

Merge it into the existing `next.config.ts`; keep the current options. The destination is resolved at build time.

Use a **Route Handler** when the request needs validation, authentication, header filtering or a transformed response:

- Expose a fixed set of upstream paths; never build the destination from user input (SSRF).
- Forward only the headers the backend needs; never copy all incoming headers.
- Translate upstream failures; do not leak the backend body or URL.

## Rendering and caching (Cache Components)

`cacheComponents` is on. `fetch` is **not cached** by default.

| Data | Approach |
|------|----------|
| Fresh on every request | Async component inside `<Suspense>` |
| Shared and allowed to be stale | `'use cache'` + `cacheLife` + `cacheTag` |
| Depends on cookies or headers | Read them outside the cache and pass values as arguments, inside `<Suspense>` |
| `Date.now()`, `Math.random()`, `crypto.randomUUID()` | `await connection()` before it, inside `<Suspense>`, or cache the value |

```ts
import { cacheLife, cacheTag } from 'next/cache';

export const listCompanies = async (): Promise<Company[]> => {
  'use cache';
  cacheLife('minutes');
  cacheTag('companies');
  return fetchCompanies();
};
```

- Always pair `'use cache'` with `cacheLife`.
- Arguments become part of the cache key. Never cache per-user data without the user in the key, and never share it.
- Employee data is personal data: default to uncached.
- `export const dynamic`, `revalidate` and `fetchCache` do not exist in this setup.

## Revalidation

| Where | API |
|-------|-----|
| Server Action, user must see the change | `updateTag('companies')` |
| Route Handler or webhook, stale content acceptable | `revalidateTag('companies', 'max')` |
| No tag available | `revalidatePath('/companies')` |

## Avoid waterfalls

```ts
const [company, employees] = await Promise.all([findCompany(companyId), listEmployees()]);
```

Sequential only for a real dependency. Independent sections get their own `<Suspense>`. Use React `cache()` to reuse a call inside one render pass.

## Client-side fetching

Only for polling, live updates or data that depends on interaction after load.

- Prefer a Server Component, or passing a promise to the client and reading it with `use()` inside `<Suspense>`.
- Call the proxy path, never the backend URL.
- Check `response.ok`, handle loading and error, show Portuguese feedback, abort on unmount.
- `swr` or `@tanstack/react-query` need approval.

## Checklist

- [ ] Backend contract confirmed
- [ ] Access through `src/services/` (server) or the proxy path (browser)
- [ ] Response validated, error path handled
- [ ] Cache choice explicit; no personal data in shared cache
- [ ] Mutation revalidates what it changed
- [ ] No waterfall
