# Simplify

Behavior-preserving cleanup of recently written code. Mandatory after every refactor. Layer of [`/nextjs-expert`](SKILL.md).

## Boundaries

- Only the files of the diff.
- Behavior, markup semantics, accessibility, routes, requests and cache behavior stay the same.
- Tests are green before and after; no assertion changes.
- A bug found on the way is reported, not fixed silently.

## Look for

| Smell | Simplification |
|-------|----------------|
| State derived from props or other state | Compute during render |
| `useEffect` reacting to an event | Move to the handler |
| `useMemo` / `useCallback` with no measured or memoized consumer | Remove |
| `'use client'` on a component with no interactivity | Remove, or push down to the leaf |
| Duplicated JSX or class strings | Extract a component |
| Duplicated formatting or validation | One utility in `src/utils/` |
| Logic mixed into JSX | Custom hook or pure function |
| Nested ternaries, deep nesting | Early returns |
| Wrapper component or hook used once that only forwards | Inline |
| Prop drilling through layers | Composition with `children` |
| Unused imports, props, types, files | Delete |
| Comment narrating the code | Better name; delete the comment |
| Component or function over about 50 lines | Split by responsibility |

## Do not

- Introduce an abstraction for a single use.
- Rename public APIs or move many files.
- Trade clarity for fewer lines.

## Verify

```powershell
npx tsc --noEmit
npx eslint <files>
npx jest <file>
```
