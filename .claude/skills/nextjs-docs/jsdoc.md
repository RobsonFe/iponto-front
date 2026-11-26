# JSDoc Guide

For documentation comments on components, hooks, services and functions. Layer of [`/nextjs-docs`](SKILL.md). Written in **English**.

## Mandatory scope

| Mandatory | Not needed |
|-----------|------------|
| Complex components and their props | Trivial presentational component with self-explaining props |
| Custom hooks | Next.js special file with no extra rule |
| Exported functions of services | Private function whose name explains it |
| Server Actions and Route Handlers | Test files |
| Exported utilities and validations | |

## Rules

- `/** ... */` block above the declaration.
- First line: one-sentence summary in the present tense ("Returns", "Renders", "Validates").
- `@param` for every parameter: the meaning, not the type.
- `@returns` with what comes back, including `null` and empty cases.
- `@throws` when part of the contract.
- `@example` when usage is not obvious.
- Props: document each non-obvious property on the `interface`.
- `{@link Name}` for references.
- Explain intent, contract and edge cases; do not narrate the code.

## Structure

```tsx
interface DataTableProps<T> {
  /** Rows to display. Each row needs a stable `id`. */
  rows: T[];
  /** Shown when `rows` is empty. */
  emptyMessage: string;
}

/**
 * Renders a generic, accessible table with an empty state.
 *
 * @example
 * <DataTable rows={employees} emptyMessage="Nenhum funcionário cadastrado." />
 */
```

```ts
/**
 * Registers a new employee in the backend.
 *
 * @param input Data validated by the form action.
 * @returns The created employee.
 * @throws {ApiError} With status 409 when the CPF or e-mail is already registered.
 */
```

## Inline comments

Only for a non-obvious architectural decision, a temporary workaround or an external limitation. Never comment obvious code or compensate for a bad name: refactor instead.

## Consistency

`@returns` and `@throws` describe what the code **does**. Promising a `null` or an error that never happens is worse than no documentation.

## Checklist

- [ ] One-line summary
- [ ] Correct `@param` and `@returns`
- [ ] `@throws` for contract errors
- [ ] Checked against the implementation
- [ ] In English
