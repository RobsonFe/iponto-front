# Scenario Matrix

What to test for each kind of change. Layer of [`/nextjs-test`](SKILL.md).

## How to find the unhappy paths

Walk the diff line by line and ask:

1. What condition is here? Test it taken and not taken.
2. What can this input be: missing, empty, too long, wrong format, special characters?
3. What can this call do: fail, answer 4xx/5xx, answer an unexpected shape, answer late, answer empty?
4. What can the user do: click twice, leave midway, go back, use only the keyboard?
5. Who is not allowed here?

## Matrix by unit

| Unit | Happy | Unhappy |
|------|-------|---------|
| Utility / validation | Valid input, literal result | Invalid, empty, boundary |
| Custom hook | Initial value and each transition | Edge values, cleanup on unmount |
| Presentational component | Renders required content and variants | Missing optional data, long content |
| Interactive component | Click and keyboard produce the effect | Disabled, pending, repeated action |
| List / table | Items rendered | Empty, loading, error, filtering without losing row state |
| Form | Submits the expected values, success feedback | Each invalid field, server error, pending, double submit |
| Service | Parses a valid payload; `204` | `400`, `404`, `409`, `500`, network error, malformed payload, ids kept as string |
| Server Action | Calls the service, revalidates, redirects | No permission, invalid input, `ApiError` per status, unexpected error propagates, **no revalidation on failure** |
| Route Handler | Status and body | Invalid params, `401`/`403`, upstream failure without leaking detail |
| `proxy.ts` | Matching request redirected or allowed | Non-matching path untouched, missing cookie |
| E2E journey | Complete flow | The most expensive failure of the flow |

## Report table

In Portuguese:

| Ramo (arquivo:linha) | Tipo | Teste | Resultado |
|----------------------|------|-------|-----------|
| `actions.ts:24` conflito 409 | Infeliz | `exibe aviso de cadastro duplicado` | Passou |
