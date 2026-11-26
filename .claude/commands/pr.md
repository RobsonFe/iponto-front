---
description: Write the title and body of a pull request and open it after approval
argument-hint: "[base branch]"
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git branch:*), Bash(git merge-base:*), Bash(gh pr list:*), Bash(gh pr view:*), Bash(gh repo view:*)
---
Prepare a pull request for the current branch. Base branch requested: `$ARGUMENTS` (may be empty).

## 1. Gather

- `git status`, `git branch --show-current`.
- Base: the argument; if empty, confirm with `gh pr list --state all` and `gh repo view --json defaultBranchRef`. Do not assume.
- `git log --oneline <base>..HEAD`, `git diff <base>...HEAD --stat` and the diff itself.
- Compare `git diff <base>...HEAD --stat` with `git diff -w <base>...HEAD --stat` to find line-ending churn.
- An open pull request for this branch (`gh pr view`): if it exists, offer to update its text instead.

Stop and tell the user if: the current branch is the default branch, there are no commits ahead of the base, or the diff
contains secrets or `.env` files. Report uncommitted changes: they will not be in the pull request.

## 2. Verify

Run only the checks tied to the diff ([quality-gate.md](../skills/nextjs-review/quality-gate.md#commands)):
types, lint of the changed files, the related tests and, when routes, rendering, cache or configuration changed, `npm run build`.
Never write a result you did not observe. A check that was not run or a tool that is not installed is listed as such.

## 3. Write

In Brazilian Portuguese. Title in Conventional Commits (for example `feat(employee): adiciona cadastro de funcionário`),
with `!` for a breaking change. Body with these sections, omitting the ones with nothing to say:

```markdown
## Resumo

O que muda e por quê, em poucas linhas.

## Atenção antes de usar

Passos obrigatórios e quebras de compatibilidade: variáveis de ambiente, dependências novas, versão da API necessária.

## Mudanças

Principais alterações, agrupadas por área.

## Evidências

Capturas de tela ou passos para validar a mudança visual, com dados fictícios.

## Pontos para a revisão

Decisões, riscos e trechos que merecem atenção.

## Verificação

Comandos executados e resultados.

## Fora do escopo

Pendências conhecidas e o que ficou de fora.
```

Use `Fixes #N` only if the pull request solves the main problem; otherwise `Ref #N`. No personal data in text or images.

## 4. Open

Show the base branch, the title and the body, then **ask for approval**. Only after an explicit OK:

1. Push the branch if needed (`git push -u origin <branch>`). Never `--force`.
2. `gh pr create --base <base> --title "..." --body-file <temporary file>`.
3. Answer with the pull request URL.

Never merge the pull request.
