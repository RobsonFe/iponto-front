# Agent Skills (iPonto Front-End)

Single routing map. When a prompt does not name a skill, match it below and load the primary skill **and** the companions. Reply in Brazilian Portuguese.

| Skill | Folder | Purpose |
|-------|--------|---------|
| [`/nextjs-expert`](./nextjs-expert/SKILL.md) | `nextjs-expert/` | Implementation, App Router, React, data, forms, authentication, simplify |
| [`/nextjs-test`](./nextjs-test/SKILL.md) | `nextjs-test/` | TDD, happy and unhappy paths, Jest, RTL, Playwright, coverage, regression |
| [`/nextjs-review`](./nextjs-review/SKILL.md) | `nextjs-review/` | Technical review, security, LGPD, accessibility, performance, issue fixing |
| [`/nextjs-docs`](./nextjs-docs/SKILL.md) | `nextjs-docs/` | JSDoc, component contracts, Markdown, ADR |
| [`/impeccable`](./impeccable/SKILL.md) | `impeccable/` | Third-party design skill: UI and UX design, critique, audit, polish |

Commands: [`/commit`](../commands/commit.md) writes a commit message from the staged changes; [`/pr`](../commands/pr.md) writes and opens a pull request.

## Routing matrix

| The request mentions | Primary | Layer to open | Also load |
|----------------------|---------|---------------|-----------|
| New page, route, layout, folder, `'use client'`, `proxy.ts` | `/nextjs-expert` | [architecture.md](./nextjs-expert/architecture.md) | `/nextjs-test` (RED first) |
| Component, hook, state, list, re-render | `/nextjs-expert` | [react-patterns.md](./nextjs-expert/react-patterns.md) | `/nextjs-test` |
| Fetch, API, cache, revalidation, rewrites | `/nextjs-expert` | [data-fetching.md](./nextjs-expert/data-fetching.md) | `/nextjs-test` |
| Form, Server Action, Route Handler, validation | `/nextjs-expert` | [forms-and-api.md](./nextjs-expert/forms-and-api.md) | `/nextjs-test`, [security.md](./nextjs-review/security.md) |
| Login, session, cookie, permission | `/nextjs-expert` | [authentication.md](./nextjs-expert/authentication.md) | `/nextjs-test`, [security.md](./nextjs-review/security.md) |
| Screen design, layout, visual polish, UX copy, motion | `/impeccable` | router in its `SKILL.md` | `/nextjs-expert` (project standards win) |
| Refactor, clean up | `/nextjs-expert` | [simplify.md](./nextjs-expert/simplify.md) | `/nextjs-test` |
| Bug, error, wrong behavior | `/nextjs-test` | [regression.md](./nextjs-test/regression.md) | [fix-issue.md](./nextjs-review/fix-issue.md), `/nextjs-expert` |
| Test, TDD, mock, coverage, E2E, flaky | `/nextjs-test` | router in its `SKILL.md` | `/nextjs-expert` for the contract |
| Install or configure Jest or Playwright | `/nextjs-test` | [setup.md](./nextjs-test/setup.md) | approval needed |
| Review, PR, diff, "pode mergear?" | `/nextjs-review` | [quality-gate.md](./nextjs-review/quality-gate.md) | `/nextjs-test` |
| Security, XSS, secrets, redirect, headers | `/nextjs-review` | [security.md](./nextjs-review/security.md) | `/nextjs-expert`, `/nextjs-test` |
| CPF, CNPJ, e-mail, phone, address, log, LGPD | `/nextjs-review` | [lgpd.md](./nextjs-review/lgpd.md) | `/nextjs-expert` |
| Accessibility, keyboard, screen reader | `/nextjs-review` | [accessibility.md](./nextjs-review/accessibility.md) | `/nextjs-test` |
| Slowness, bundle, Web Vitals, build time | `/nextjs-review` | [performance.md](./nextjs-review/performance.md) | `/nextjs-expert` |
| JSDoc, README, ADR, component docs | `/nextjs-docs` | router in its `SKILL.md` | `/nextjs-expert` for the real behavior |
| Commit, pull request | `/commit`, `/pr` | | `/nextjs-review` before opening |

## Chains

| Task | Order |
|------|-------|
| New feature | `/nextjs-expert` plan → approval → `/nextjs-test` RED → `/nextjs-expert` GREEN → `/impeccable` polish → simplify → `/nextjs-docs` → `/nextjs-review` → `/commit` → `/pr` |
| Bug fix | `/nextjs-test` RED that reproduces → [fix-issue.md](./nextjs-review/fix-issue.md) → GREEN → `/nextjs-review` |
| Refactor | `/nextjs-test` characterization → change → same tests → simplify → `/nextjs-review` |
| Performance | measure → `/nextjs-test` equivalence → `/nextjs-expert` fix → measure again |
| Pre-merge | `/nextjs-review` quality gate + `/nextjs-test` green on the scope |
| Documentation | `/nextjs-docs` → check against code and tests → `/nextjs-review` |

## Layers

### `/nextjs-expert`

[architecture.md](./nextjs-expert/architecture.md) · [react-patterns.md](./nextjs-expert/react-patterns.md) · [data-fetching.md](./nextjs-expert/data-fetching.md) · [forms-and-api.md](./nextjs-expert/forms-and-api.md) · [authentication.md](./nextjs-expert/authentication.md) · [simplify.md](./nextjs-expert/simplify.md) · `references/`

### `/nextjs-test`

[setup.md](./nextjs-test/setup.md) · [scenarios.md](./nextjs-test/scenarios.md) · [tdd.md](./nextjs-test/tdd.md) · [good-tests.md](./nextjs-test/good-tests.md) · [e2e.md](./nextjs-test/e2e.md) · [coverage.md](./nextjs-test/coverage.md) · [regression.md](./nextjs-test/regression.md) · `references/`

### `/nextjs-review`

[quality-gate.md](./nextjs-review/quality-gate.md) · [llm-smells.md](./nextjs-review/llm-smells.md) · [security.md](./nextjs-review/security.md) · [lgpd.md](./nextjs-review/lgpd.md) · [accessibility.md](./nextjs-review/accessibility.md) · [performance.md](./nextjs-review/performance.md) · [fix-issue.md](./nextjs-review/fix-issue.md) · `references/`

### `/nextjs-docs`

[jsdoc.md](./nextjs-docs/jsdoc.md) · [components.md](./nextjs-docs/components.md) · [markdown.md](./nextjs-docs/markdown.md) · [adr.md](./nextjs-docs/adr.md)

## Rules and skills

| File | Loaded | Role |
|------|--------|------|
| [CLAUDE.md](../../CLAUDE.md) | Always | Project overview, commands, cautions |
| [rules/nextjs-rules.md](../rules/nextjs-rules.md) | Always | Language, workflow, modes, tokens |
| [rules/code-standards.md](../rules/code-standards.md) | With `src/`, test, `e2e/` files and `next.config.ts` | Mandatory standards |
| [rules/frontend-quality-gate.md](../rules/frontend-quality-gate.md) | With `src/`, `e2e/` files and `next.config.ts` | Review chain |

Rules say **what** is mandatory; skills say **how**, without duplicating.

## Invoking

Claude picks a skill from its description. To force one, type `/nextjs-expert [task]`, `/nextjs-test [task]`, `/nextjs-review [diff or PR]`, `/nextjs-docs [file]` or `/impeccable [command] [target]`. Writing `@nextjs-expert` in a prompt means the same.

## `/impeccable`

Installed by the official installer (`npx impeccable@4.11.1 install --providers=claude --scope=project`). **Do not edit its files**: update with `npx impeccable update`.

- It adds hooks to `.claude/settings.local.json` (not versioned) that run **without approval** after UI edits and at the end of a session. Each developer installs them with the command above; `/impeccable hooks off` disables them.
- It downloads an engine binary once to `~/.impeccable/bin/` and fetches design directions from impeccable.style on new designs. Telemetry is disabled in `.impeccable/config.json`.
- Run `/impeccable init` once to create `PRODUCT.md`.
- Where it conflicts with [code-standards.md](../rules/code-standards.md) or accessibility, the project rules win.

## External material: origin and license

Downloaded on 2026-11-26 and pinned to a commit. Copied files carry a header with their origin. License texts: [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).

| Source | Commit | License | Use here |
|--------|--------|---------|----------|
| [clerk/skills](https://github.com/clerk/skills) `clerk-nextjs-patterns` | `0a5a49e` | MIT declared in `SKILL.md` (no license file detected in the repository) | `nextjs-expert/references/clerk/` |
| [wshobson/agents](https://github.com/wshobson/agents) `nextjs-app-router-patterns` | `c96b5f6` | MIT | `nextjs-expert/references/app-router-patterns.md` |
| [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills) `nextjs-best-practices` | `939493b` | MIT | Principles merged into `nextjs-expert` |
| [mindrally/skills](https://github.com/mindrally/skills) `nextjs-react-typescript` | `7682ca7` | Apache-2.0 | Conventions merged into `nextjs-expert` and `code-standards.md`, adapted |
| [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit) `nextjs-data-fetching`, `nextjs-authentication`, `nextjs-code-review` | `fe73fb3` | MIT | `nextjs-expert/references/data-fetching/`, `authjs/`; `nextjs-review/references/`; steps merged into the `SKILL.md` files |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 4.11.1 | Apache-2.0 | `impeccable/` |
| [pproenca/dot-skills](https://github.com/pproenca/dot-skills) `nextjs-bundle-optimizer` | `cf93c57` | MIT | `nextjs-review/references/bundle-*.md`; loop in `performance.md`; scripts not included |
| [tenkoh/skills](https://github.com/tenkoh/skills) `nextjs-vitest` | `39f4cac` | MIT | Setup idea only; the project uses Jest |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) `senior-qa` | `f565e66` | MIT | `nextjs-test/references/`; scripts not included |
| [vercel-labs/next-maintainer-skills](https://github.com/vercel-labs/next-maintainer-skills) `nextjs-fix-issue`, `nextjs-create-regression-test` | `7996fe9` | No license detected | Method rewritten: `fix-issue.md`, `regression.md`; nothing copied |
| [henryxv/study-platform](https://github.com/henryxv/study-platform) `nextjs-frontend-testing` | `6db8fbf` | No license detected | Ideas rewritten in `nextjs-test`; nothing copied |
| [shipshitdev/skills](https://github.com/shipshitdev/skills) `testing-expert` | `366150f` (removed upstream on 2026-10-20) | No license detected | Ideas rewritten in `nextjs-test`; nothing copied |

The orchestrator-and-layers structure follows the skills of `iponto-api`.

To update external material, download it into a temporary folder and copy it over the same paths; running `npx skills add` at the root creates separate skill folders.
