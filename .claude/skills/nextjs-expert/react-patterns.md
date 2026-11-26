# React Patterns

Components, hooks, state and re-render control. Mandatory rules: [code-standards.md](../../rules/code-standards.md). Layer of [`/nextjs-expert`](SKILL.md).

## When to load

- Writing or changing a component, hook or store.
- A list, a form control, a modal or any interactive UI.
- Re-render or responsiveness concerns.

## Component shape

```tsx
import type { ReactNode } from 'react';

interface CardProps {
  /** Heading shown at the top of the card. */
  title: string;
  children: ReactNode;
}

export const Card = ({ title, children }: CardProps) => (
  <article data-testid="card">
    <h2>{title}</h2>
    {children}
  </article>
);
```

- One component per file; subcomponents and static content may follow in the same file when private.
- Reuse native props with `interface ButtonProps extends React.ComponentProps<'button'>` and spread the rest.
- `children` and composition before boolean props that multiply variants.
- Conditional rendering with early return; avoid nested ternaries.
- `{count > 0 && <Badge />}`, not `{count && <Badge />}` (renders `0`).

## Lists and keys

```tsx
{employees.map(({ id, nome }) => (
  <EmployeeRow key={id} name={nome} />
))}
```

A key comes from the data. If the data has no id, create one when the item is created, never during render.

## State

Decide in this order:

1. **Derive** it during render from props or other state. No effect, no extra state.
2. **URL** (`searchParams`) for filters, pagination and anything shareable.
3. **Local** `useState` / `useReducer` in the smallest component that needs it.
4. **Lifted** to the closest common parent.
5. **Context** for stable values (theme, session summary).
6. **Zustand** for frequently changing global state; new dependency, ask first.

Never copy server data into global state just to render it.

## Effects

Use `useEffect` only to synchronize with something outside React: subscription, timer, browser API. Not for fetching initial data, deriving values or reacting to a user event (do that in the handler). Always return the cleanup.

## Custom hooks

Extract logic when a component mixes UI with rules or formatting, or when two components need it.

```ts
import { useEffect, useState } from 'react';

/** Returns `value` only after it stays unchanged for `delayInMs`. */
export const useDebounce = <T,>(value: T, delayInMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayInMs);
    return () => clearTimeout(timeout);
  }, [value, delayInMs]);

  return debounced;
};
```

Hooks live in `src/hooks/`, run on the client and have their own tests.

## Events

```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  setQuery(event.target.value);
};
```

## Re-render control

1. Move state down: an input that changes on every keystroke gets its own component.
2. Pass static subtrees as `children` so they are not re-rendered by a stateful wrapper.
3. `useMemo` for measurably heavy computation; `useCallback` for functions passed to memoized children; `React.memo` on the child that benefits.
4. Keep context values stable (`useMemo`) and split contexts that change at different rates.
5. Measure with React DevTools Profiler before and after. The React Compiler is not enabled; enabling it needs approval.

```tsx
// Bad: every keystroke re-renders the heavy table
const Page = () => {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <HeavyTable />
    </>
  );
};

// Good: the state is isolated
const Page = () => (
  <>
    <SearchInput />
    <HeavyTable />
  </>
);
```

For slow renders driven by input, use `useTransition` or `useDeferredValue`.

## Loading, empty and error states

Every data-driven component handles all four: loading, empty, error and success. Messages in Portuguese; errors with `role="alert"` and a way to recover.

## Native components

```tsx
<Link href={`/employees/${id}`}>Ver detalhes</Link>

<Image src="/logo.svg" alt="Logotipo do iPonto" width={120} height={32} />
```

- `alt` is mandatory; decorative images use `alt=""`.
- The largest above-the-fold image: `loading="eager"` or `fetchPriority="high"` (`priority` is deprecated).
- `fill` needs a sized container and `sizes`.
- Navigation in code: `useRouter` from `next/navigation`.
- Fonts through `next/font`.

## Styling

- Tailwind CSS 4, mobile-first; tokens in `@theme` (`src/app/globals.css`).
- Extract repeated class sets into a component, not into duplicated strings.
- Support dark mode and `prefers-reduced-motion`.
- Visual direction, hierarchy and polish: [`/impeccable`](../impeccable/SKILL.md).

## Test hooks

Add `data-testid` in `kebab-case` to structural elements and dynamic containers (`employee-list`, `employee-row-actions`). It complements accessible roles and labels, never replaces them.
