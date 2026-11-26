# Coverage

Coverage shows what ran, not what was verified. Layer of [`/nextjs-test`](SKILL.md).

## Required

| Target | Requirement |
|--------|-------------|
| Core UI components (buttons, modals, inputs, generic tables) | **100%** |
| Custom hooks | All logic and return variations |
| Complex business logic and critical utilities | Every branch |
| Critical flows (auth, complex forms, state-dependent lists) | Happy and unhappy covered, component or E2E |
| Code in the diff | Every branch |

Global percentage targets are not set. Adding a threshold to `jest.config.ts` needs approval; set it only after the gap is closed.

```ts
coverageThreshold: {
  './src/components/ui/': { branches: 100, functions: 100, lines: 100, statements: 100 },
},
```

## Run

```powershell
npx jest <spec> --coverage --collectCoverageFrom="src/<path>/**/*.{ts,tsx}"
```

## Read the report

- **Branch** coverage is the honest number.
- For each uncovered line ask whether it is risky. Error handling usually is.
- `async` Server Components covered only by Playwright do not appear in Jest coverage: list them.
- Do not write tests only to color lines.
