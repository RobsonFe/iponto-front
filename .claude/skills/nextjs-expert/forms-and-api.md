# Forms, Server Actions and Route Handlers

Writing data and giving feedback. Mandatory rules: [code-standards.md](../../rules/code-standards.md). Layer of [`/nextjs-expert`](SKILL.md).

## When to load

- Creating a form, a mutation, a Server Action or a Route Handler.
- Handling validation and error feedback.

## Which one

| Need | Use |
|------|-----|
| Mutation triggered by this app's UI | Server Action |
| Endpoint for the browser to read or for external callers, webhooks, proxy with logic | Route Handler |
| Plain forwarding to the backend | `rewrites` |

## Server Action

A Server Action is a **public endpoint**: it can be called without your UI. Inside every action, in this order:

1. Verify session and permission (when authentication exists).
2. Validate and narrow every input (`FormData` values are `unknown` territory).
3. Call the service.
4. Return expected errors as values; let unexpected ones reach `error.tsx`.
5. Revalidate, then redirect.

```ts
'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError } from '@/services/api/server-client';
import { createEmployee } from '@/services/employee-service';
import { parseEmployeeForm } from '@/utils/employee-form';

export interface EmployeeFormState {
  message: string;
  fieldErrors: Partial<Record<'nome' | 'email', string>>;
}

export const createEmployeeAction = async (
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> => {
  const parsed = parseEmployeeForm(formData);

  if (!parsed.isValid) {
    return { message: 'Revise os campos destacados.', fieldErrors: parsed.fieldErrors };
  }

  try {
    await createEmployee(parsed.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { message: 'Já existe um funcionário com estes dados.', fieldErrors: {} };
    }

    if (error instanceof ApiError && error.status === 400) {
      return { message: 'Os dados enviados são inválidos.', fieldErrors: {} };
    }

    throw error;
  }

  updateTag('employees');
  redirect('/employees');
};
```

`redirect()` and `notFound()` throw: keep them outside `try`.

Framework protections (origin check, 1 MB body limit, encrypted action ids) do not replace these checks. Behind a proxy domain, configure `serverActions.allowedOrigins`.

## Form

```tsx
'use client';

import { useActionState } from 'react';
import { createEmployeeAction, type EmployeeFormState } from '../actions';

const INITIAL_STATE: EmployeeFormState = { message: '', fieldErrors: {} };

export const EmployeeForm = () => {
  const [state, formAction, isPending] = useActionState(createEmployeeAction, INITIAL_STATE);

  return (
    <form action={formAction} data-testid="employee-form">
      <label htmlFor="employee-name">Nome</label>
      <input
        id="employee-name"
        name="nome"
        required
        aria-invalid={Boolean(state.fieldErrors.nome)}
        aria-describedby="employee-name-error"
      />
      <p id="employee-name-error">{state.fieldErrors.nome}</p>

      <p role="status">{state.message}</p>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
};
```

- Every control has `id` + `<label htmlFor>`, and `name`.
- Native attributes (`required`, `type`, `maxLength`, `autoComplete`) help the user; the server validation is the real one.
- Disable the submit button while pending; prevent double submission.
- React resets an uncontrolled form after an action: return the values and set `defaultValue` when they must survive an error.
- `useOptimistic` only when rollback is clear.
- `<form action>` works before hydration: keep it.
- A form library needs approval.

## Validation

- Pure functions in `src/utils/`, tested on both paths, shared by client hints and the action.
- Match the backend rules; it rejects unknown fields.
- Sensitive formats (CPF, CNPJ, e-mail, phone, CEP) follow [lgpd.md](../nextjs-review/lgpd.md).

## Error feedback

Messages in Portuguese, chosen by status, with no technical detail.

| Status | Message example |
|--------|-----------------|
| 400 | Os dados enviados são inválidos. |
| 401 | Sua sessão expirou. Entre novamente. |
| 403 | Você não tem permissão para esta ação. |
| 404 | Registro não encontrado. |
| 409 | Já existe um registro com estes dados. |
| 5xx or network | Não foi possível concluir a operação. Tente novamente. |

## Route Handler

```ts
import type { NextRequest } from 'next/server';
import { ApiError } from '@/services/api/server-client';
import { findEmployee } from '@/services/employee-service';

export async function GET(_request: NextRequest, context: RouteContext<'/api/employees/[id]'>) {
  const { id } = await context.params;

  try {
    const employee = await findEmployee(id);

    return employee
      ? Response.json(employee)
      : Response.json({ message: 'Funcionário não encontrado.' }, { status: 404 });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json({ message: 'Falha ao consultar o funcionário.' }, { status: 502 });
    }

    throw error;
  }
}
```

- Validate params, query and body; answer correct status codes.
- Check authentication and authorization (`401` not signed in, `403` no permission).
- Protect state-changing handlers against cross-site requests: they do not get the Server Action origin check.
- `GET` handlers follow the Cache Components prerendering model.
