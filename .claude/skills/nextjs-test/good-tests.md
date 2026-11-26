# Honest Tests

A test earns its place by failing when behavior breaks and staying quiet when structure changes. Layer of [`/nextjs-test`](SKILL.md).

## Queries

| Priority | Query | Use for |
|----------|-------|---------|
| 1 | `getByRole` with `name` | Almost everything |
| 2 | `getByLabelText`, `getByPlaceholderText` | Form fields |
| 3 | `getByTestId` | Structural or dynamic containers |

`getByText` is fine to assert non-interactive content.

| Variant | Behavior |
|---------|----------|
| `getBy*` | Must exist now |
| `queryBy*` | Only to assert absence |
| `findBy*` | Appears later; `await` it |

**Forbidden:** `container.querySelector('.class')`, selectors by CSS class, tag chains or element position.

```tsx
// Bad
expect(container.querySelector('.bg-red-500')).toBeTruthy();

// Good
expect(screen.getByRole('alert')).toHaveTextContent('CPF inválido.');
```

Use `within()` to scope a query to one row or region.

## Interaction

- `const user = userEvent.setup();` and `await` each action.
- No `act()` around `userEvent` or `findBy*`.
- Inside `waitFor`, only assertions; no side effects.

## Mocking

Mock what crosses a boundary:

```ts
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/services/employee-service', () => ({
  createEmployee: jest.fn(),
}));
```

- Variables used inside `jest.mock` factories start with `mock`.
- `next/cache` (`updateTag`, `revalidatePath`) is a boundary: mock it and assert the call.
- Do not mock the component or function under test, nor its own private helpers.
- Reset between tests (`clearMocks` or `jest.resetAllMocks()`).
- Build data with factories; override only the field the test is about; ids are strings; personal data is fake.

## Server Actions

Test them as functions:

```ts
/**
 * @jest-environment node
 */
it('avisa sobre cadastro duplicado sem revalidar', async () => {
  jest.mocked(createEmployee).mockRejectedValue(new ApiError(409, 'conflict'));

  const state = await createEmployeeAction({ message: '', fieldErrors: {} }, buildEmployeeForm());

  expect(state.message).toBe('Já existe um funcionário com estes dados.');
  expect(updateTag).not.toHaveBeenCalled();
});
```

## False positives

| Trap | Fix |
|------|-----|
| Expected value computed like the code does | Write the literal |
| Asserting the value the mock returned, untouched | Assert something the code decides |
| `queryBy*` negative assertion with a wrong query | Prove the same query finds it in the positive case |
| Missing `await` | Await; lint for floating promises |
| `expect` inside a `catch` never reached | `expect.assertions(n)` or `.rejects` |
| Snapshot as only assertion | Assert the behavior |
| `toBeDefined` / "does not throw" | Assert content and effect |
| `getByTestId` only | Also assert what the user reads |

## Mutation check

Temporarily break the main branch (invert the condition, remove the call, change the message), run the spec, confirm it fails, restore. Report which mutation was used.

## Equivalence (performance refactor)

Same inputs, same screen, same requests, before and after. Keep the tests unchanged.
