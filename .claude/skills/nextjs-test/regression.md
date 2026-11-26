# Regression Tests and Flaky Tests

Layer of [`/nextjs-test`](SKILL.md).

## Regression test for a bug

Write it **before** touching product code.

1. Confirm the reproduction: steps, expected, actual, installed versions.
2. Read nearby specs and follow their naming and fixtures.
3. Pick the cheapest level that shows the bug through public behavior.
4. Add only what expresses the bug: no unrelated structure, styling or dependency.
5. Assert the correct behavior, so the failure is the bug and not an incidental symptom.
6. Run it and record the failure message.
7. If the code already contains the fix, prove the test on the previous revision (temporary worktree) or by undoing the fix locally.
8. Do not change product code or weaken existing assertions in this step.

If the behavior cannot be expressed reliably, report the blocker; do not add a weak assertion. Then fix with [fix-issue.md](../nextjs-review/fix-issue.md).

Name the claim: `mantém o filtro ao trocar de página`, not `corrige bug`.

## Blind spots of agent-written changes

The same agent that wrote the code tends to write tests that agree with it. Check:

| Blind spot | Check |
|------------|-------|
| Mock differs from the real backend | Compare the fixture with the `iponto-api` DTO or Swagger |
| Response shape drift (`result`, `results`, raw list) | Test the real shape; fail on unexpected payload |
| Only one of two similar paths changed | Search for siblings (create and edit, list and detail) |
| Development works, production fails | `npm run build`, run E2E on the build |
| Cache shows stale data after a mutation | Journey test: mutate, then read |
| Outdated Next.js API that still compiles | Installed docs and dev overlay |
| Error path never executed | Force each failure |

## Flaky tests

A flaky test is a defect: fix it or delete it. Never retry it into silence.

| Symptom | Cause | Fix |
|---------|-------|-----|
| Passes alone, fails in the suite | Shared state, mock not reset | Reset per test; run with `--randomize` |
| Passes locally, fails in CI | Timing | Await the real condition; no fixed sleep |
| Fails at certain date or time | Real clock, timezone | `jest.useFakeTimers()` + `setSystemTime`; pin `TZ` |
| Fake timers hang `userEvent` | Timers not advanced | `userEvent.setup({ advanceTimers: jest.advanceTimersByTime })` |
| List order differs | Unordered data | Sort, or assert membership |
| `act` warning | Update after the test ended | Await the visible result |
| E2E fails under parallel workers | Shared backend data | Data per worker |

Proof of fix: repeated randomized runs pass. A skipped test is lost coverage: only with approval, tracked in an issue.
