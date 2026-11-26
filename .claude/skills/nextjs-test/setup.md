# Test Setup

Jest + React Testing Library + Playwright. Layer of [`/nextjs-test`](SKILL.md).

> **Nothing is installed yet** until `package.json` shows it. Every command here that installs or edits configuration **needs approval**.
> Source of truth: `node_modules/next/dist/docs/01-app/02-guides/testing/jest.md` and `playwright.md`.

## Jest and React Testing Library

```powershell
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event ts-node @types/jest
```

`jest.config.ts`

```ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^server-only$': '<rootDir>/__mocks__/server-only.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
};

export default createJestConfig(config);
```

`jest.setup.ts`

```ts
import '@testing-library/jest-dom';
```

`__mocks__/server-only.ts`

```ts
export {};
```

Scripts:

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:e2e": "playwright test"
}
```

### Server code

Services, actions and handlers run in Node. Put this at the top of their spec:

```ts
/**
 * @jest-environment node
 */
```

## Playwright

```powershell
npm init playwright@latest
```

Choose TypeScript and the `e2e` folder. `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

The default `testIdAttribute` is `data-testid`.

`.gitignore` already covers `/coverage`; add `/test-results/` and `/playwright-report/`.

## After installing

1. Write one real test for existing behavior and watch it fail, then pass.
2. `npx tsc --noEmit` and `npm run lint` still pass.
3. Record the commands in `CLAUDE.md` and `README.md`.
