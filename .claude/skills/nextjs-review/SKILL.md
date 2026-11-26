---
name: nextjs-review
description: Reviews Next.js and React code in iPonto front-end - pre-merge quality gate (line-ending diff hygiene, front-end standards compliance, happy and unhappy tests, ask before fixing out-of-plan findings), Server/Client boundaries, Cache Components, LLM-generated code smells, front-end security, LGPD/personal data, accessibility, re-renders, bundle size and Core Web Vitals, and the reproduce-test-fix workflow for reported issues. Use to review PRs, diffs, pages, components, hooks, actions, route handlers, post-agent code, slow pages, large bundles, personal data or before merge, even when the prompt does not name this skill. Also load nextjs-test for test gaps and nextjs-expert for fixes.
---

# Next.js Review

Single technical review skill. The core below is **always active**; layers load through the router. Reply to the user in Brazilian Portuguese.

## Precedence

[nextjs-rules.md](../../rules/nextjs-rules.md) and [code-standards.md](../../rules/code-standards.md) > installed Next.js documentation (`node_modules/next/dist/docs/`) > this `SKILL.md` > layers in this folder > external material (`references/`).

## When to use

- Reviewing a PR, diff or agent-generated change before merge.
- Reviewing pages, layouts, components, hooks, services, actions, Route Handlers, `proxy.ts` and `next.config.ts`.
- Code that receives input, handles sessions or personal data, or calls the backend.
- Investigating a bug report, a slow page or a large bundle.
- Before finishing a fix or feature.

## Layer router

```text
Review request
   ├─ full PR / pre-merge / CRLF↔LF churn / standards compliance
   │     → QUALITY_GATE → quality-gate.md
   ├─ post-LLM diff, needless 'use client', useEffect misuse, invented API
   │     → LLM_SMELLS → llm-smells.md
   ├─ XSS, secrets, storage, actions, handlers, redirects, headers
   │     → SECURITY → security.md
   ├─ CPF, CNPJ, e-mail, phone, address, log, URL, analytics
   │     → LGPD → lgpd.md
   ├─ forms, modals, keyboard, focus, contrast, semantics
   │     → A11Y → accessibility.md
   ├─ slow page, re-render, waterfall, bundle, build time, Web Vitals
   │     → PERFORMANCE → performance.md
   └─ reported bug or issue to correct
         → FIX_ISSUE → fix-issue.md
```

| Layer | Signals | File |
|-------|---------|------|
| Quality gate | merge, full PR, Done checklist | [quality-gate.md](quality-gate.md) |
| LLM smells | agent code, speculative abstraction | [llm-smells.md](llm-smells.md) |
| Security | injection, secrets, session, redirect | [security.md](security.md) |
| LGPD | personal data | [lgpd.md](lgpd.md) |
| Accessibility | semantics, keyboard, screen reader | [accessibility.md](accessibility.md) |
| Performance | re-render, bundle, Web Vitals | [performance.md](performance.md) |
| Fix an issue | reproduce, test, smallest fix | [fix-issue.md](fix-issue.md) |

External material: [app-router-patterns](references/app-router-patterns.md) · [server-components](references/server-components.md) · [performance checklist](references/performance-checklist.md) · [bundle-recipes](references/bundle-recipes.md) · [bundle-gotchas](references/bundle-gotchas.md)

## Full review workflow

1. **Scope:** understand the change and list files (routes, layouts, components, hooks, services, actions, handlers, config, tests).
2. **Diff hygiene:** `git diff --stat` vs `git diff -w --stat` ([quality-gate.md](quality-gate.md#diff-hygiene-line-endings-mandatory)).
3. **Tests first:** a branch without an unhappy test, or a test that proves nothing, is an **Obrigatório** finding ([quality-gate.md](quality-gate.md#tests)).
4. **Security before style:** [security.md](security.md) + [llm-smells.md](llm-smells.md).
5. **Component boundaries:** `'use client'` placement, serializable and minimal props, no server module in client code.
6. **Data:** proxy respected, response validated, waterfalls, `<Suspense>`, cache scope and revalidation.
7. **Actions and handlers:** authorization, input validation, expected errors as values, status codes.
8. **UI states:** loading, empty, error and success; messages in Portuguese.
9. **Re-renders and keys**, **accessibility**, **metadata**.
10. **Standards compliance:** [compliance table](quality-gate.md#standards-compliance).
11. Conditional layers: personal data → [lgpd.md](lgpd.md); slowness → [performance.md](performance.md).
12. **Validate findings:** every Crítico and Obrigatório with file:line, snippet, reproducible scenario and concrete fix. Confirm Next.js claims in the installed docs. A style preference or a finding without remedy is downgraded or removed.
13. **Ask before** fixing any finding: "corrigir nesta branch ou abrir issue?".
14. Approved finding → [`/nextjs-test`](../nextjs-test/SKILL.md) RED → fix with [`/nextjs-expert`](../nextjs-expert/SKILL.md) → GREEN → [simplify](../nextjs-expert/simplify.md) if there was a refactor.
15. Report with the template below.

A review request **does not** change code.

## Severity

Use these four labels, no 1-to-10 score.

| Label | When |
|-------|------|
| **Crítico** | Vulnerability, data leak or loss, production failure |
| **Obrigatório** | Bug, project rule violation, accessibility blocker, missing test or false positive |
| **Sugestão** | Maintainability, readability, performance without evidence of impact |
| **Detalhe** | Minor note |

Deviations the diff did not introduce are not findings against the diff; list them as open questions when they affect risk.

## Output template

Written in Portuguese:

```markdown
## Achados
- Crítico: [arquivo:linha] problema. Por que falha, impacto e correção obrigatória.
- Obrigatório: [arquivo:linha] problema. Caminho ausente ou risco.
- Sugestão: [arquivo:linha] melhoria.
- Detalhe: [arquivo:linha] nota.

## Pontos positivos
- [Somente os que ajudam a decidir o que manter.]

## Perguntas em aberto
- [Apenas o que afeta correção ou risco.]

## Gaps de verificação
- [Testes e checagens não executados ou fora de escopo.]
```

No findings: say so explicitly and list residual risks.

## Review focus

**Architecture** — SOLID, DRY, KISS; flag speculative abstraction and parallel refactor; UI in components, logic in hooks and utilities, backend access in services; project standard over generic pattern; no rewrite proposal without a critical problem.

**Server and Client** — Server by default; boundary at the leaf; no secret or oversized object crossing it; Server Components do not call own Route Handlers.

**Security, always require** — server-side validation and authorization in every action and handler; no secret in `NEXT_PUBLIC_`; no token in Web Storage; no `dangerouslySetInnerHTML` with unsanitized content; no backend detail shown to the user.

**Security, ask first** — authentication flow, new sensitive data, external script or integration, upload, CORS, CSP, new dependency.

**Never accept** — committed secret, personal data in logs or URLs, client-only authorization, `eval` with input.

## Verification

```powershell
npx next typegen
npx tsc --noEmit
npx eslint <files>
npx prettier --check <files>
npx jest <file>
npm run build
```

Tools not installed yet, and checks not run, go under **Gaps de verificação**. `npm run lint` only checks; never use `--fix` or `--write` during a review.

## Checklist

- [ ] Diff hygiene checked
- [ ] Every diff branch with happy and unhappy tests, no false positive
- [ ] [Pre-commit checklist](../../rules/code-standards.md#pre-commit-checklist) with no open deviation
- [ ] Out-of-plan findings decided by the user
- [ ] No open critical security finding
- [ ] Input validation, authorization and exposed data checked
- [ ] Accessibility checked on changed UI
- [ ] No unnecessary client code, waterfall or re-render
- [ ] Scoped tests executed

## External material: do not apply directly

| External material says | In iPonto |
|------------------------|-----------|
| 1–10 quality score, "Warnings", "Suggestions" | The four severity labels above |
| Delegate to `typescript-software-architect-review` agent | Does not exist |
| `middleware.ts` and matcher advice | `proxy.ts` |
| `next: { revalidate }`, `revalidateTag(tag)` | Cache Components: [data-fetching.md](../nextjs-expert/data-fetching.md) |
| `error.tsx` showing `error.message` with `reset` | Fixed Portuguese message, `retry` |
| `<Image priority>` | `preload`, `loading="eager"` or `fetchPriority` |
| Zod, `lodash`, query libraries | Not installed; need approval |
| Database checks (Prisma, PgBouncer, N+1 SQL) | Backend scope (`iponto-api`) |
| Bundle scripts (`baseline.sh`, `analyze.sh`, `compare.sh`, `verify.sh`) | Not included; use the loop in [performance.md](performance.md) |
| Automatic commit or revert after measuring | Only with approval |
| `next experimental-analyze` | `npx next analyze` |
| FID | INP |

## Related skills

Load these without waiting for the prompt to name them.

| Situation | Load | Required |
|-----------|------|----------|
| Fixing code, component, query or route | [`/nextjs-expert`](../nextjs-expert/SKILL.md) | After approval |
| Judging structure | [architecture.md](../nextjs-expert/architecture.md) · [data-fetching.md](../nextjs-expert/data-fetching.md) | Yes |
| Writing or running tests | [`/nextjs-test`](../nextjs-test/SKILL.md) | Yes for approved findings |
| Visual and UX audit | [`/impeccable`](../impeccable/SKILL.md) (`audit`, `critique`) | When the diff changes the UI |
| Documentation outdated | [`/nextjs-docs`](../nextjs-docs/SKILL.md) | Yes |
| Clarity after a fix | [simplify.md](../nextjs-expert/simplify.md) | After refactor |

## Cross-references

Rules: [nextjs-rules.md](../../rules/nextjs-rules.md) · [code-standards.md](../../rules/code-standards.md) · [frontend-quality-gate.md](../../rules/frontend-quality-gate.md). Project: [CLAUDE.md](../../../CLAUDE.md). Catalog: [skills/README.md](../README.md).
