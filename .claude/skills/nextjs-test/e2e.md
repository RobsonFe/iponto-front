# End-to-End Tests

Playwright, for critical journeys and `async` Server Components. Layer of [`/nextjs-test`](SKILL.md).

## What belongs here

- Authentication (when it exists).
- Complex form submission: register or edit employee and company.
- Lists that depend on state: pagination, filters, update after mutation.
- Navigation and rendering that Jest cannot reach.

Move calculations and branch variations down to unit tests; keep one journey that proves the wiring.

## Style

```ts
import { expect, test } from '@playwright/test';

test.describe('Cadastro de funcionário', () => {
  test('mostra o funcionário na lista após salvar', async ({ page }) => {
    await page.goto('/employees/new');

    await page.getByLabel('Nome').fill('Funcionário Teste');
    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page).toHaveURL('/employees');
    await expect(page.getByTestId('employee-list')).toContainText('Funcionário Teste');
  });
});
```

- Locators: `getByRole`, `getByLabel`, `getByTestId`. No CSS class, no XPath.
- Web-first assertions (`await expect(locator).toBeVisible()`); **no** `waitForTimeout`.
- Each test creates its own data and does not depend on order.
- Repeated steps become fixtures or page objects when a second test needs them.
- Test against the production build.

## Backend

Know where the data goes before running.

- **Never** run destructive flows against the `.env` database of `iponto-api`; use a disposable database, approved by the user.
- `page.route` intercepts only **browser** requests. Server Components and Server Actions call the backend from the Next.js server: point `API_URL` to a test backend or stub server.
- A test that needs the real API says so and fails clearly when it is down.

## Debugging

```powershell
npx playwright test <file> --ui
npx playwright test <file> --debug
npx playwright show-report
```

Instant navigation assertions for Cache Components: see `@next/playwright` in the Next.js Playwright guide (new dependency: ask).
