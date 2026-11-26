# Authentication and Authorization

Sessions and access control. Mandatory rules: [code-standards.md](../../rules/code-standards.md#security-and-local-data). Layer of [`/nextjs-expert`](SKILL.md).

## Current state

**Neither the front-end nor `iponto-api` has authentication.** Login, session and roles depend on a backend contract. Do not invent endpoints, tokens or roles: plan the feature with the backend and wait for approval. No provider has been chosen.

## Principles

- Session in an **`HttpOnly`** cookie, set by the backend or by a Server Action / Route Handler. Never in `localStorage`, `sessionStorage` or a readable cookie.
- Cookie options: `httpOnly: true`, `secure: true`, `sameSite: 'lax'` or stricter, `path: '/'`, with expiry.
- Authorization is verified **on the server, next to the data**: every page, Server Action and Route Handler.
- `proxy.ts` does optimistic redirects only. A layout check is not enough: layouts do not re-render on every navigation.
- Hiding a button is UX, not security.
- Tokens and session secrets never reach a Client Component.
- The backend enforces authorization again; the front-end is not the only barrier.

## Data Access Layer

```ts
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { findSession, type Session } from '@/services/session-service';

/** Returns the current session or redirects to the login page. Memoized per render pass. */
export const verifySession = cache(async (): Promise<Session> => {
  const token = (await cookies()).get('session')?.value;
  const session = token ? await findSession(token) : null;

  if (!session) {
    redirect('/login');
  }

  return session;
});
```

`findSession` stands for the contract the backend will define.

Use it in pages (inside `<Suspense>`), actions and handlers. In a Route Handler answer `401` / `403` instead of redirecting.

## Setting and clearing the session

Cookies can be written only in Server Actions, Route Handlers and `proxy.ts`, never during a Server Component render.

```ts
(await cookies()).set('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  expires: expiresAt,
});
```

Logout removes the cookie **and** invalidates the session in the backend.

## Cache and sessions

- Reading cookies is runtime data: inside `<Suspense>`.
- Never call a session reader inside `'use cache'`; pass the user id as an argument, and avoid shared caching of personal data.

## Redirects

Validate any `callbackUrl`: accept only a relative path that starts with a single `/`.

## Providers (only if adopted)

Installing one needs approval and an ADR.

| Option | Reference | Watch out |
|--------|-----------|-----------|
| Clerk | [references/clerk/](references/clerk/middleware-strategies.md) | `await auth()`; protect each resource; paid external service holding user data (LGPD) |
| Auth.js | [references/authjs/](references/authjs/authjs-setup.md) | Examples use `middleware.ts` and Prisma: use `proxy.ts`; the database belongs to the API |
| Backend-issued session | This file | Preferred starting point while the API owns the users |

## Checklist

- [ ] Session only in `HttpOnly` cookie
- [ ] Check in every page, action and handler that touches protected data
- [ ] `401` and `403` distinguished
- [ ] No token or secret in client props, logs or URLs
- [ ] Redirect targets validated
- [ ] Happy and unhappy tests: signed out, no permission, expired session
