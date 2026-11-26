# ADR and Design Interview Guide

For creating or updating Architecture Decision Records and documenting architectural choices. Layer of [`/nextjs-docs`](SKILL.md). ADRs are written in Portuguese.

## When to create

A decision that affects architecture, integrations, development standards or a strategic dependency. In iPonto front-end, for example: authentication provider, API proxy strategy, state management, component library, data fetching on the client. Not for routine detail.

## Conventions

- Location: `docs/adr/` (create it with the first ADR).
- Name: `ADR-<number>-<slug>.md`, sequential numbering (check existing ones).
- Index: `docs/adr/README.md`.

## Template

```markdown
# ADR-001: <título da decisão>

- **Status:** Proposed
- **Data:** AAAA-MM-DD
- **Autores:**

## Contexto
Problema, restrições e objetivos.

## Decisão
O que foi decidido e por quê.

## Consequências
Positivas, negativas e tarefas decorrentes.

## Alternativas consideradas
Opções descartadas e o motivo.

## Referências
Issues, PRs e documentos.
```

## Status

1. Opens as **Proposed**.
2. With consensus, **Accepted** (or **Rejected**).
3. Replaced: mark **Superseded** or **Obsolete** and point to the new one.

## Design interview

To validate a complex plan or refine architecture, when the user asks. Challenge assumptions while recording decisions.

1. **Prepare:** context, existing ADRs, key questions.
2. **Question:** assumptions, edge cases, failure modes and trade-offs.
3. **Document:** ADRs, glossary (`CONTEXT.md`) and actions as decisions emerge.
4. **Validate:** terminology consistent with the project vocabulary.

## Principles

- A decision is only real when documented.
- Terms defined precisely.
- Every claim with reasoning or evidence.

## Checklist

- [ ] Correct number and name
- [ ] Sections filled
- [ ] Status reflects real approval
- [ ] Consequences with follow-up tasks
- [ ] Index updated

## Related

| Need | Load |
|------|------|
| Current architecture and standard | [architecture.md](../nextjs-expert/architecture.md) |
| Risk assessment of the choice | [`/nextjs-review`](../nextjs-review/SKILL.md) |
| Tests that protect the change | [`/nextjs-test`](../nextjs-test/SKILL.md) |
