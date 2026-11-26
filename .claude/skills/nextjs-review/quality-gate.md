# Front-End Quality Gate

Single gate: **engineering review** + **scoped tests** + **accessibility** + **LGPD** when there is personal data + **clean diff** + **standards compliance**. Layer of [`/nextjs-review`](SKILL.md).

> Run commands from the repository root (folder with `package.json`).

## PR workflow

```text
1. Understand the change and the user flow
2. Diff hygiene — git diff --stat vs git diff -w --stat
3. Tests — diff branches with happy and unhappy paths, no false positive
4. nextjs-review — core + security + llm-smells
5. Standards compliance — with file:line
6. Personal data → lgpd.md
7. Changed UI → accessibility.md · measured slowness → performance.md
8. Docs → nextjs-docs
9. Out-of-plan finding → ask "corrigir nesta branch ou abrir issue?"
10. Approved finding → RED test that reproduces it
11. Fix approved Crítico/Obrigatório with nextjs-expert
12. GREEN on the scope
13. There was a refactor → simplify
14. Validate the real flow in the browser
15. Report: test, command and evidence
```

## Diff hygiene: line endings (mandatory)

On Windows, with `core.autocrlf` active and no `.gitattributes`, different editors can produce whole-file diffs.

```bash
git diff --stat
git diff -w --stat
git diff -w -- <file>
```

A file that disappears with `-w`, or drops from hundreds of lines to a few, is churn.

1. **Obrigatório**: churn does not go into the commit.
2. List the files to the user and ask how to proceed.
3. Prefer reapplying only the semantic delta, preserving the original line ending.
4. `git restore <file>` only with explicit OK, warning that it discards local edits.

Also keep out of the diff: `.next/`, `next-env.d.ts`, and unrelated changes written by `next dev` (it manages blocks in `AGENTS.md`; commit those separately).

## Tests

Each item is **Obrigatório**:

| Deviation | Rule |
|-----------|------|
| Diff branch without an unhappy test | [scenarios.md](../nextjs-test/scenarios.md) |
| Feature with the happy path only | Both paths, always |
| Core UI component below 100% coverage | [coverage.md](../nextjs-test/coverage.md) |
| Test that passes with wrong code (mirror, mock only, `await` missing) | [good-tests.md](../nextjs-test/good-tests.md) |
| Selector by CSS class or DOM structure | [good-tests.md](../nextjs-test/good-tests.md#queries) |
| Assertion on internal state instead of behavior | [good-tests.md](../nextjs-test/good-tests.md) |
| Expected value adjusted to accept a badly handled error | RED test and finding reported |
| New behavior without an observed RED | [tdd.md](../nextjs-test/tdd.md) |
| Real backend in unit tests, or order-dependent tests | [scenarios.md](../nextjs-test/scenarios.md) |
| `.skip`, `.only`, fixed sleep or loosened assertion | Remove |

Prove at least one point: break the main branch temporarily, watch the test fail and restore (only with the working tree preserved).

## Standards compliance

Every deviation is recorded with **file:line + rule** from [code-standards.md](../../rules/code-standards.md).

| Deviation | Typical severity |
|-----------|------------------|
| Browser calling the backend URL | Crítico |
| Backend `fetch` outside `src/services/` | Obrigatório |
| Server Action or Route Handler without validation | Crítico |
| Action or handler on protected data without authorization | Crítico |
| Secret in `NEXT_PUBLIC_` or passed to the client | Crítico |
| Token or personal data in `localStorage` / `sessionStorage` | Crítico |
| `dangerouslySetInnerHTML` with unsanitized content | Crítico |
| `'use client'` on a layout or page without need | Obrigatório |
| `any`, or `@ts-ignore` without justification | Obrigatório |
| ID converted to `number` | Obrigatório |
| Index as `key` in a dynamic list | Obrigatório |
| `<div onClick>`, input without label, missing `alt` | Obrigatório |
| `response.ok` not checked, empty `catch`, silent error | Obrigatório |
| Loading, empty or error state missing | Obrigatório |
| Per-user data in a shared cache | Crítico |
| Mutation without revalidation | Obrigatório |
| Uncached or runtime data outside `<Suspense>` (build failure) | Obrigatório |
| Class component | Obrigatório |
| UI text or error message in English | Obrigatório |
| Unnecessary re-render on a complex page | Obrigatório when measured, else Sugestão |
| Missing `data-testid` on a structural element under test | Sugestão |
| New dependency without approval | Obrigatório |
| Refactor without simplify | Sugestão |
| Implementation outside the approved plan | Obrigatório → ask first |

A deviation the user approved, with a reason, does not block Done; record it.

## Finding outside the plan: ask first

On a finding outside the plan, an arbitrary decision, a business-rule doubt or a flow risk, stop and ask: **"corrigir nesta branch ou abrir issue?"**

- **This branch:** only with explicit OK and if it fits the scope.
- **Issue:** deliver a draft; `gh issue create` only after the user approves the text.
- **Never** fix silently.

Draft in Portuguese:

```markdown
**Título:** <verbo + problema + local>

**Contexto:** <como apareceu>
**Local:** `<arquivo>:<linha>`
**Impacto:** <quem é afetado, severidade>
**Proposta:** <correção e teste que a prova>
```

## Real-flow validation and PR opening

- Reproduce before and after in the browser (`npm run dev`, with `iponto-api` running when the flow needs it) when reasonable. Check the console and the dev overlay insights.
- `npm run build` must succeed: it enforces Cache Components rules.
- A green test is complementary evidence; it does not replace the flow.
- Sensitive action (real data, external service, production): ask for authorization first.
- Open the PR with [`/pr`](../../commands/pr.md).
- `Fixes #N` only if the PR solves the main bug; otherwise `Ref #N`.
- Never commit on the default branch, never `git push --force`, never open a PR unasked.

## Commands

```powershell
npx next typegen
npx tsc --noEmit
npx eslint <files>
npx prettier --check <files>
npx jest <file> -t "<name>"
npm run build
git diff --stat
git diff -w --stat
```

## Done

- [ ] No open Crítico
- [ ] A test that would fail before the change
- [ ] Happy and unhappy path per branch
- [ ] Scoped tests exit 0
- [ ] Types, lint and build pass
- [ ] Accessibility checked on changed UI
- [ ] LGPD checked if there is personal data
- [ ] No line-ending churn
- [ ] [Pre-commit checklist](../../rules/code-standards.md#pre-commit-checklist) satisfied or gaps reported
- [ ] Out-of-plan findings decided by the user
- [ ] PR claims ("lint ok", "no breaking change") reproduced, not assumed
- [ ] Out-of-scope failures compared with the merge-base before calling them pre-existing
