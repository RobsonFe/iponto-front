---
name: nextjs-docs
description: Writes iPonto front-end documentation, routing to JSDoc for components, hooks, services and utilities (in English), component and Route Handler contracts, Markdown (README, docs/, CLAUDE.md) or ADR (in Portuguese). Use when writing, reviewing or editing documentation, comments, props descriptions or architecture decisions, and whenever a complex component, public hook, service, route or environment variable changes, even when the prompt does not name this skill. Also load nextjs-expert to confirm the real behavior and nextjs-test to prove documented behavior.
---

# Next.js Docs

Single entry point for documentation in this repository. Detect the type first and load only the matching guide. Reply to the user in Brazilian Portuguese.

## Precedence

[nextjs-rules.md](../../rules/nextjs-rules.md) and [code-standards.md](../../rules/code-standards.md) > this `SKILL.md` > guides in this folder.

## Document type router

```text
Request or changed file
   ├─ component, props, hook contract, Route Handler contract, route map
   │     → COMPONENTS → components.md
   ├─ .ts/.tsx + function/hook/interface + /** */ comment
   │     → JSDOC    → jsdoc.md
   ├─ docs/adr/, ADR, architecture decision, design interview
   │     → ADR      → adr.md
   └─ README.md, CLAUDE.md, docs/**/*.md, CONTRIBUTING.md
         → MARKDOWN → markdown.md
```

| Type | Signals | Route |
|------|---------|-------|
| **Components** | props, variants, states, usage example, endpoint of the app | [components.md](components.md) |
| **JSDoc** | contract, `@param`, `@returns`, `@throws` | [jsdoc.md](jsdoc.md) |
| **ADR** | architecture, integration or strategic dependency choice | [adr.md](adr.md) |
| **Markdown** | README, guides, agent instructions | [markdown.md](markdown.md) |

When more than one applies, the order is **JSDoc → Components → Markdown → ADR** (only if there was an architecture decision). Ambiguous type: ask one question first.

## Shared standards

- Documentation matches the current implementation: check the code before writing.
- Language: **JSDoc and code comments in English**; README, `docs/` and ADRs in **Brazilian Portuguese**; skills, rules and agent instructions (`.claude/`, `CLAUDE.md`) in English.
- Active voice, present tense, technical audience.
- Most important information first (BLUF).
- Markdown with a heading hierarchy, code blocks with language and relative links.
- Fake data in examples: never a real person's CPF, e-mail or phone ([LGPD](../nextjs-review/lgpd.md)).
- No filler and no unverified generic template.

## Workflow

1. **Classify** with the router.
2. **Load** only the matching guide.
3. **Investigate** the code and existing documentation.
4. **Write** following the guide.
5. **Verify** accuracy, links and formatting.

## Related skills

Load these without waiting for the prompt to name them.

| Situation | Load | Required |
|-----------|------|----------|
| Real behavior, route or diverging code | [`/nextjs-expert`](../nextjs-expert/SKILL.md) | Yes |
| Documenting API integration | [data-fetching.md](../nextjs-expert/data-fetching.md) | Yes |
| Documenting architecture | [architecture.md](../nextjs-expert/architecture.md) | Yes |
| Doc describes behavior | [`/nextjs-test`](../nextjs-test/SKILL.md): a test that proves it | Yes |
| Visual design system docs (`DESIGN.md`) | [`/impeccable`](../impeccable/SKILL.md) `document` | When asked |
| Closing a documentation PR | [`/nextjs-review`](../nextjs-review/SKILL.md) | Yes |
| Personal data in examples | [lgpd.md](../nextjs-review/lgpd.md) | Yes |

## Cross-references

Rules: [nextjs-rules.md](../../rules/nextjs-rules.md). Project: [CLAUDE.md](../../../CLAUDE.md). Catalog: [skills/README.md](../README.md).
