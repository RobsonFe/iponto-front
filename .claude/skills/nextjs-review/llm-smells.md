# LLM-Generated Code Smells

Patterns that agent-written front-end code often gets wrong. Run on every PR. Layer of [`/nextjs-review`](SKILL.md).

## Outdated or invented Next.js API

Verify in `node_modules/next/dist/docs/` before accepting.

| Smell | Correct |
|-------|---------|
| `middleware.ts` | `proxy.ts` |
| `export const dynamic` / `revalidate` | Cache Components |
| `revalidateTag(tag)` | `revalidateTag(tag, 'max')` or `updateTag(tag)` |
| Synchronous `params`, `searchParams`, `cookies()`, `headers()` | `await` them |
| `error.tsx` typed `error: Error` with `reset` | `error: unknown` with `retry` |
| `<Image priority>` | `preload`, `loading="eager"`, `fetchPriority` |
| `next/router`, `next/head` | `next/navigation`, `metadata` |
| `next lint` | `eslint` |
| Option or hook that does not exist | Check the docs and `node_modules` types |

## React

- `'use client'` added to silence an error instead of fixing the boundary.
- `useEffect` + `useState` to fetch initial data or to mirror a prop.
- `useMemo` / `useCallback` everywhere with no consumer that benefits.
- `key={index}`, or `key={Math.random()}`.
- Component declared inside another component (remounts every render).
- `suppressHydrationWarning` hiding a real mismatch.

## TypeScript

- `any`, double assertion (`as unknown as T`), non-null `!` on API data or env variables.
- Type that describes the wished response, not the backend contract.
- Optional everything to avoid narrowing.

## Error handling

- Broad `try/catch` returning `null`, `[]` or a fake success.
- Empty `catch`, or only `console.log`.
- `redirect()` / `notFound()` inside `try`.
- `response.json()` without checking `response.ok`.
- Server error message shown to the user.

## Design

- Duplicated helper or component that already exists: search first.
- Speculative abstraction, generic component with one consumer, unused props "for later".
- Parallel refactor or reformatting outside the scope.
- New dependency for a few lines of code.
- Fallback that hides a missing configuration (`API_URL ?? 'http://localhost:8080'`).
- Comments narrating the code; leftover template content.

## Tests

- Asserts the mock it just configured.
- Renders and only checks that nothing throws.
- Snapshot as the only proof.
- `waitForTimeout` or `setTimeout` to wait.
- Selectors by class name or DOM position.
- Names that claim behavior the test does not verify.

## Claims

"Tests pass", "no breaking change" and "performance improved" need the command and its output. Reproduce them.
