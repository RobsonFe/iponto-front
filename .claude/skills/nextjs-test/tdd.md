# TDD

Mandatory for new behavior and bug fixes. Layer of [`/nextjs-test`](SKILL.md).

## Cycle

1. **RED** — write one small test for one behavior. Run it. It must fail **for the expected reason** (assertion, not import error or typo).
2. **GREEN** — the simplest production code that passes.
3. **REFACTOR** — clean with [simplify.md](../nextjs-expert/simplify.md); tests stay green and unchanged.

Repeat per branch, alternating happy and unhappy.

## Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from './search-field';

describe('SearchField', () => {
  it('envia o termo digitado', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchField onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar funcionário' }), 'Ana');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Ana');
  });

  it('não envia um termo vazio', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchField onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe um nome para buscar.');
  });
});
```

## When the test cannot come first

Exploratory UI work or a pure style change: say so, then add the behavior test and prove it can fail by breaking the code temporarily. Record the reason in the report.

## Rules

- No production code for a behavior without a failing test.
- A test that passes on the first run proves nothing yet: break the code and check.
- Never change the test and the code in the same step to reach green.
