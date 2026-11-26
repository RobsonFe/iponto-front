# Performance

Re-renders, data waterfalls, bundle size, build time and Web Vitals. Layer of [`/nextjs-review`](SKILL.md).

**Measure → one change → measure.** No optimization without evidence.

## Targets

| Metric | Good |
|--------|------|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

Measure on a production build (`npm run build` and `npm run start`), never on `next dev`.

## Find the cause

| Symptom | Tool | Usual fix |
|---------|------|-----------|
| Slow typing or clicks | React DevTools Profiler | Isolate state, memoize measured work, `useDeferredValue` |
| Slow first content | Network and server logs | `<Suspense>`, `Promise.all`, `use cache` |
| Large bundle | `npx next analyze` | Move to Server Component, lazy load, lighter dependency |
| Layout shift | Lighthouse | Sized images, matching skeletons, `next/font` |
| Slow LCP image | Lighthouse | `next/image` with `sizes`, `fetchPriority="high"` |
| Heavy third party | Network | `next/script` with `afterInteractive` or `lazyOnload` |
| Slow build | Build timing | See [bundle-recipes.md](references/bundle-recipes.md) |

## Bundle optimization loop

1. **Baseline:** clean tree, cold build (remove `.next/`), then `npx next analyze --output` and keep a copy of the output outside `.next/`.
2. **Analyze:** list the largest client modules per route and their import chain.
3. **Diagnose:** pick one recipe ([bundle-recipes.md](references/bundle-recipes.md)).
4. **Apply one change.**
5. **Measure** the same way (same cache state).
6. **Verify:** build, `tsc`, scoped tests, no other route worse.
7. **Keep or drop:** report the delta. Committing or reverting needs approval.

Facts for Next.js 16 with Turbopack:

- `next build` no longer prints First Load JS: do not search the build output for it.
- Barrel imports are optimized automatically; `optimizePackageImports` is for webpack only.
- Comparing a cold build with a warm one invalidates timing.
- `next/dynamic` with `ssr: false` works only in Client Components, and removes the server HTML of that part.
- Check [bundle-gotchas.md](references/bundle-gotchas.md) and `02-guides/package-bundling.md` in the Next.js docs.

## Re-render checklist

- [ ] Fast-changing state lives in a small component
- [ ] Context values stable and split by change rate
- [ ] No object or function recreated for a memoized child
- [ ] Long lists paginated or virtualized (new dependency: ask)
- [ ] Profiler before and after

## Report

State environment, command, number before, number after and what was not measured.
