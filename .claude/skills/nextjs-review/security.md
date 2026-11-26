# Front-End Security

For input, sessions, secrets, redirects, third-party code and anything crossing the server boundary. Layer of [`/nextjs-review`](SKILL.md).

## Trust boundaries

Everything from the browser is untrusted: form data, params, search params, headers, cookies, action arguments and Route Handler bodies. Client validation is UX; the server validates and authorizes.

## Checks

| Risk | Require |
|------|---------|
| XSS | No `dangerouslySetInnerHTML` without a sanitizer (new dependency: ask). No `javascript:` or unchecked URL in `href` / `src`. No `eval` or `new Function` |
| Secrets | Server variables only; `NEXT_PUBLIC_` is public. No secret in code, fixtures or committed `.env` |
| Server exposure | `import 'server-only'` in modules with secrets or backend access |
| Over-exposure | Pass minimal objects to Client Components: every prop is visible in the browser |
| Session | `HttpOnly`, `Secure`, `SameSite` cookie; nothing sensitive in Web Storage or URL |
| Server Actions | Authorization and validation inside each one; ownership of the resource checked |
| Route Handlers | Same, plus cross-site protection for state changes and rate considerations |
| SSRF | Upstream URL from an allowlist; never from user input |
| Header leaking | Forward only needed headers to the backend |
| Open redirect | Only relative paths starting with a single `/` |
| Error leaking | No stack, backend message, URL or id of internal resource in the UI or response |
| Logs | No token, cookie or personal data, on server or browser |
| Third-party scripts | Justified, loaded with `next/script`, reviewed for the data they access |
| External links | `rel="noopener noreferrer"` with `target="_blank"` |
| Headers / CSP | Changes need approval; see `02-guides/content-security-policy.md` in the Next.js docs |
| Images | `remotePatterns` restricted to known hosts; no wildcard |
| Dependencies | New package approved; `npm audit` reviewed |

## Known state

- `iponto-api` has no authentication and CORS `origin: '*'`: every backend route is public. A front-end check does not protect the data.
- Never present a hidden screen as a security control.

## Severity

Exploitable issue or data leak: **Crítico**. Missing hardening without a concrete path: **Sugestão**, stating the assumption.

## Reporting

Give the entry point, the path to the effect, a minimal reproduction and the fix. Do not run attacks against real or shared environments.
