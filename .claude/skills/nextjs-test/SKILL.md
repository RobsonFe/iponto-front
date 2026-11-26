---
name: nextjs-test
description: Writes and runs front-end tests in iPonto with Jest, React Testing Library and Playwright - mandatory happy and unhappy path for every branch, behavior-focused tests with accessible queries and data-testid, TDD with observed RED, no false positives, coverage for hooks, core UI components and critical flows, regression tests for bugs and flaky test diagnosis. Use for any fix, feature, component, hook, form, Server Action, service, route handler, coverage question, E2E flow, test setup or before finishing a PR, even when the prompt does not name this skill. Also load nextjs-expert for the production code and nextjs-review before merge.
---

# Next.js Test

Test orchestrator. The core below is **always active**; load layers through the router. Reply to the user in Brazilian Portuguese; `describe` and `it` names are in Portuguese, identifiers and comments in English.

## Precedence

[nextjs-rules.md](../../rules/nextjs-rules.md) and [code-standards.md](../../rules/code-standards.md#7-testing) > installed Next.js documentation (`node_modules/next/dist/docs/01-app/02-guides/testing/`) > this `SKILL.md` > layers in this folder > external material (`references/`).

## When to use

- Before marking a fix or feature as done.
- When creating or changing a component, hook, service, utility, Server Action, Route Handler, `proxy.ts` or flow.
- When refactoring for performance (equivalence proof).
- When the user asks for tests, coverage, E2E, setup or proof that a test does not "lie".
- Together with [`/nextjs-review`](../nextjs-review/SKILL.md) before merge.

## First: is the tooling installed?

Check `package.json`. If Jest or Playwright is missing, follow [setup.md](setup.md): installing needs approval. Never claim a test passed without running it.

## Layer router

```text
Test request
    ├─ no test runner yet, config, scripts → setup.md
    ├─ fix or feature (MANDATORY) → scenarios.md
    ├─ new behavior (TDD MANDATORY) → tdd.md
    ├─ query, assertion, mock, false positive → good-tests.md
    ├─ flow, async Server Component, browser → e2e.md
    ├─ coverage, untested lines → coverage.md
    └─ bug, regression, flaky test, agent-written change → regression.md
```

| Layer | Signals | File |
|-------|---------|------|
| Setup | install, `jest.config`, `playwright.config` | [setup.md](setup.md) |
| Scenario matrix | every fix/feature; finding unhappy paths | [scenarios.md](scenarios.md) |
| TDD | RED-GREEN-REFACTOR | [tdd.md](tdd.md) |
| Honest tests | queries, mocks, mutation | [good-tests.md](good-tests.md) |
| E2E | Playwright, user journey | [e2e.md](e2e.md) |
| Coverage | `--coverage`, thresholds | [coverage.md](coverage.md) |
| Regression and flakes | bug, intermittent failure | [regression.md](regression.md) |

External material: [testing-strategies](references/testing-strategies.md) · [test-automation-patterns](references/test-automation-patterns.md) · [qa-best-practices](references/qa-best-practices.md)

## Which level

Test each behavior once, at the cheapest level that can prove it.

| Behavior | Level | Tool |
|----------|-------|------|
| Pure function, validation, formatting | Unit | Jest |
| Custom hook | Unit | RTL `renderHook` |
| Synchronous Server or Client Component | Component | Jest + RTL |
| Service, Server Action, Route Handler | Unit with mocked boundary | Jest (`node` environment) |
| `async` Server Component | E2E (Jest does not support it) | Playwright |
| Critical journey: auth, complex form, state-dependent list | E2E | Playwright |

## Mandatory rules

### 1. Both paths, always

- Every implemented or changed branch gets at least one **happy** and one **unhappy** test.
- The unhappy path weighs as much as the happy one.
- Happy path only = task **not done**.

### 2. Behavior, not implementation

- Interact as the user does (`userEvent`) and assert what is on screen or what leaves the boundary.
- Query priority: `getByRole` → `getByLabelText` / `getByPlaceholderText` → `getByTestId`.
- **Never** select by CSS class or DOM structure. Never assert internal state.

### 3. Test tied to the code

Every test points at a line of the diff, and every decision in the diff has a test. Deliver the **branch → test** table.

| In the code | Unhappy test |
|-------------|--------------|
| Form field validation | Missing, empty, wrong format, limit: Portuguese message on the field, nothing sent |
| `response.ok` false / `ApiError` | Friendly message per status, no technical detail |
| Network failure | Error state with a way to retry |
| Empty list | Empty state |
| Pending submit | Button disabled, no double submission |
| `if` / ternary in JSX | Both renders |
| `notFound()` / `redirect()` | Called in the right case only |
| Session or permission check | Denied, with no write |

How to walk the diff: [scenarios.md](scenarios.md#how-to-find-the-unhappy-paths).

### 4. Error handling is verified

The unhappy test checks **how the error is handled**, not only that something failed.

- The expected value comes from the requirement or contract, never from what the code does today.
- Wrong behavior: the test stays **RED** and the finding is reported. **Never** adjust the expected value to pass.
- Bug outside the approved scope: ask **"corrigir nesta branch ou abrir issue?"**.

### 5. No false positives

Details in [good-tests.md](good-tests.md).

- **Observed RED** for the right reason before GREEN. On existing code, break the rule temporarily, confirm the failure and restore.
- Literal expected values: never computed by the code under test nor mirrored from the mock.
- `await` every `userEvent` action, `findBy*`, `waitFor`, `.resolves` and `.rejects`.
- Mock only at the boundary (`fetch`, service module, `next/navigation`, `next/cache`, clock), never the subject.
- "Was called" alone is not enough: check arguments and visible effect.
- Loosening an assertion, `.skip` / `.only` or removing a test to go green is forbidden.

### 6. Isolation

No real backend in unit tests; no dependency on execution order; mocks restored between tests.

## Scope: test and run only what the diff touched

**Writing:** only behavior implemented or changed in the diff; a new feature is all diff. Gap outside the scope: report it as a suggestion.

**Running:** only the specs tied to the change. Full suite only when asked.

**Failure outside the scope:**

1. Confirm the diff does not touch the code or the test.
2. Run the same test on the merge-base (temporary worktree, without moving the current branch).
3. Report it by name with the merge-base result. Do not fix or silence it without asking.

## Workflow

1. **Contract:** what the user sees and what leaves the app.
2. **Matrix:** diff branches, happy and unhappy ([scenarios.md](scenarios.md)).
3. **Level:** table above.
4. **RED:** write it and watch it fail for the right reason ([tdd.md](tdd.md)).
5. **GREEN:** minimal code via [`/nextjs-expert`](../nextjs-expert/SKILL.md), with an approved plan.
6. **Proof:** mutate the main branch ([mutation check](good-tests.md#mutation-check)).
7. **Report:** table, command, result and failures by name.

## Commands

| Scope | Command |
|-------|---------|
| Spec of the change | `npx jest <file>` |
| One test | `npx jest <file> -t "<name>"` |
| Related to files | `npx jest --findRelatedTests <files>` |
| Coverage of the change | see [coverage.md](coverage.md) |
| One E2E spec | `npx playwright test <file>` |

- Unit and component specs sit next to the code: `name.test.tsx`. E2E: `e2e/*.spec.ts`.
- Changing `package.json`, `jest.config.ts` or `playwright.config.ts` only with approval.

## External material: do not apply directly

| External material says | In iPonto |
|------------------------|-----------|
| Vitest, `vi.*` | Jest, `jest.*` |
| Cypress | Playwright |
| MSW with `rest.get` | MSW is a new dependency (ask); version 2 uses `http.get` and `HttpResponse` |
| `fireEvent` | `userEvent` |
| Selectors by CSS class, `[name="email"]`, `page.click('text=...')` | Role, label, test id |
| Numeric ids in fixtures | `string` ids |
| `getByText` as first choice | Role and label first |
| 70/20/10 or 80% as universal targets | [coverage.md](coverage.md) |
| Generator and analyzer scripts (`scripts/*.py`) | Not included |
| Test `async` Server Components in Jest | Playwright |
| Retry or quarantine as fix | Find the cause ([regression.md](regression.md#flaky-tests)) |

## Done checklist

- [ ] Every diff branch has a happy and an unhappy test
- [ ] Branch → test table with a Type column
- [ ] RED observed (or reason documented)
- [ ] Queries by role, label or test id; no class selector
- [ ] Errors checked: message on screen and effect
- [ ] No expected value adjusted to hide an error
- [ ] Anti-false-positive checklist from [good-tests.md](good-tests.md)
- [ ] Change specs exit 0, or RED reported with the finding
- [ ] Out-of-scope gaps reported, not written

## Related skills

Load these without waiting for the prompt to name them.

| Situation | Load | Required |
|-----------|------|----------|
| Writing or fixing production code | [`/nextjs-expert`](../nextjs-expert/SKILL.md) | Yes |
| Server Action or form under test | [forms-and-api.md](../nextjs-expert/forms-and-api.md) | Yes |
| Service and API payloads | [data-fetching.md](../nextjs-expert/data-fetching.md) | Yes |
| Cleaning a new test, assertions intact | [simplify.md](../nextjs-expert/simplify.md) | After refactor |
| Pre-merge or Done checklist | [`/nextjs-review`](../nextjs-review/SKILL.md): [quality-gate.md](../nextjs-review/quality-gate.md) | Yes |
| Accessibility assertions | [accessibility.md](../nextjs-review/accessibility.md) | When the UI changes |
| Fake personal data | [lgpd.md](../nextjs-review/lgpd.md) | Yes |

## Cross-references

Rules: [nextjs-rules.md](../../rules/nextjs-rules.md). Project: [CLAUDE.md](../../../CLAUDE.md). Catalog: [skills/README.md](../README.md).
