# iPonto Front-End

Aplicação web para gestão de funcionários e controle de ponto, feita com Next.js 16.4 (App Router), React 19.3 e TypeScript. Consome a `iponto-api` (NestJS).

**Estado atual:** a camada de servidor de empresas e funcionários (types e services) está pronta. As telas ainda não foram criadas: a página inicial é a do template.

## Como executar

Requisitos: Node 20.9 ou superior e a `iponto-api` em execução.

1. Instale as dependências com `npm install`.
2. Crie o arquivo `.env.local` na raiz com a URL da API:

   ```env
   API_URL=http://localhost:8080/api/v1
   ```

3. Inicie com `npm run dev` e abra `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `API_URL` | Sim | URL base da `iponto-api`, com o prefixo `/api/v1`. A porta é a `PORT` do `.env` da API (padrão `8080`). Lida somente no servidor: não use o prefixo `NEXT_PUBLIC_`. |

Os arquivos `.env*` não são versionados.

## Comandos

| Tarefa | Comando |
|--------|---------|
| Testes | `npm test` |
| Um arquivo de teste | `npx jest <arquivo>` |
| Tipos | `npx next typegen` e depois `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Build | `npm run build` |

Os testes simulam a API: não precisam dela em execução.

## Estrutura

```text
src/
├── app/                      rotas
├── services/
│   ├── api/                  cliente HTTP e utilitários de recurso
│   ├── company-service.ts
│   └── employee-service.ts
├── types/                    contratos da API e type guards
├── utils/                    funções puras
└── __fixtures__/             dados fictícios dos testes
```

## Como usar os services

Os services rodam somente no servidor (Server Components, Server Actions e Route Handlers).

```ts
import { countCompanies, listCompanies } from '@/services/company-service';

const [companies, total] = await Promise.all([listCompanies({ page: 1, limit: 10 }), countCompanies()]);
```

- Com `cacheComponents` ativo, o componente que lê esses dados fica dentro de `<Suspense>`.
- `findCompany` e `findEmployee` retornam `null` quando o registro não existe.
- As demais falhas de chamada lançam `ApiError`, com o status HTTP: `503` quando a API não responde ou a resposta é interrompida, e `502` quando a resposta foge do contrato. A mensagem é técnica e não deve ser exibida ao usuário.
- Sem `API_URL`, os services lançam um `Error` comum.
- Os retornos trazem somente os campos do contrato: campos extras da API são descartados.
- A busca e a listagem de funcionários não retornam a empresa.
- Envie `page` e `limit` juntos. Hoje a API aceita `page` até 50 ([iponto-api#15](https://github.com/RobsonFe/iponto-api/issues/15)).
- Empresas e funcionários têm dados pessoais: não use cache compartilhado nem os registre em log.
