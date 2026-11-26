# Component and Contract Documentation

The front-end contract: what a component, hook, route or handler accepts, shows and does. Layer of [`/nextjs-docs`](SKILL.md).

## Where it lives

- **In the code** first: typed `interface` + [JSDoc](jsdoc.md). Types are the reference; do not repeat them in prose.
- **In `docs/`** (Portuguese) only for what spans several files: component catalog, route map, API integration.
- Storybook or documentation generators are new dependencies: ask.

## Component entry

```markdown
## DataTable

Tabela genérica com estado vazio. Código: `src/components/ui/data-table.tsx`.

| Propriedade | Obrigatória | Descrição |
|-------------|-------------|-----------|
| `rows` | Sim | Linhas; cada uma com `id` |
| `emptyMessage` | Sim | Texto exibido sem linhas |

**Estados:** carregando, vazio, erro, preenchido.
**Acessibilidade:** cabeçalhos com `scope`, legenda obrigatória.
**Seletores de teste:** `data-table`, `data-table-empty`.
```

## Route map

| Rota | Renderização | Dados | Cache | Acesso |
|------|--------------|-------|-------|--------|
| `/employees` | Servidor, com streaming | `listEmployees` | Sem cache | Público hoje |

## Route Handler entry

Method and path, parameters, body, status codes with Portuguese messages, authentication and the upstream backend route.

## Environment variables

Name, purpose, example with a fake value, whether it is public (`NEXT_PUBLIC_`) and whether it is read at build time. Keep the table in `README.md`.

## Rules

- Document only behavior that exists.
- List every state the user can see.
- Prefer a test that proves the documented behavior.
- Remove the entry together with the code.
