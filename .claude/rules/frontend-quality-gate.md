---
paths:
  - "src/**"
  - "e2e/**"
  - "next.config.ts"
---

# Front-End Quality Gate

Which skill or layer to load when touching front-end code. Full matrix: [skills/README.md](../skills/README.md).

| Situation | Load |
|-----------|------|
| Next.js / React implementation | [`/nextjs-expert`](../skills/nextjs-expert/SKILL.md) |
| New route, layout, folder or Server/Client boundary | [architecture.md](../skills/nextjs-expert/architecture.md) |
| Component, hook, state, re-render | [react-patterns.md](../skills/nextjs-expert/react-patterns.md) |
| Fetch, cache, proxy, API integration | [data-fetching.md](../skills/nextjs-expert/data-fetching.md) |
| Form, Server Action, Route Handler | [forms-and-api.md](../skills/nextjs-expert/forms-and-api.md) |
| New or changed screen: visual design and UX | [`/impeccable`](../skills/impeccable/SKILL.md) with `/nextjs-expert` |
| Fix or feature: RED before code, happy and unhappy | [`/nextjs-test`](../skills/nextjs-test/SKILL.md) |
| After every refactor (mandatory) | [simplify.md](../skills/nextjs-expert/simplify.md) |
| Review, security, LGPD, accessibility, performance, pre-merge | [`/nextjs-review`](../skills/nextjs-review/SKILL.md) |
| Pre-merge workflow and Done criteria | [quality-gate.md](../skills/nextjs-review/quality-gate.md) |
| LLM smells | [llm-smells.md](../skills/nextjs-review/llm-smells.md) |
| Personal data | [lgpd.md](../skills/nextjs-review/lgpd.md) |
| Documentation | [`/nextjs-docs`](../skills/nextjs-docs/SKILL.md) |

**Pre-merge chain:** [quality-gate.md](../skills/nextjs-review/quality-gate.md) → finding outside the plan: ask "corrigir nesta branch ou abrir issue?" → approved finding → `/nextjs-test` RED that reproduces it ([regression.md](../skills/nextjs-test/regression.md)) → fix with `/nextjs-expert` → GREEN → [simplify.md](../skills/nextjs-expert/simplify.md) if there was a refactor → report.

**Blocks the merge:** a branch without an unhappy test, a test that proves nothing, an expected value adjusted to hide an error, or any [forbidden anti-pattern](./code-standards.md#forbidden-anti-patterns).

**Environment:** `npx jest <file>`, only tests tied to the change; the full suite only when asked. Jest and Playwright may not be installed yet: check `package.json` and see [setup.md](../skills/nextjs-test/setup.md).

Always-on rules: [nextjs-rules.md](./nextjs-rules.md) · Standards: [code-standards.md](./code-standards.md)
