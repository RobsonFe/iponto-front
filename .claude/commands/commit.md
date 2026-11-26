---
description: Generate a commit message from the staged changes
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git branch:*), Bash(git commit:*)
---
Analyze `git diff --staged` and the recent commits (`git log --oneline -10`) to follow the repository style.

1. If nothing is staged, say so and stop. Do not stage files on your own.
2. Warn before going on if the staged changes include secrets or `.env` files, generated files (`.next/`, `next-env.d.ts`),
   `.claude/settings.local.json`, line-ending churn (compare `git diff --staged --stat` with `git diff --staged -w --stat`)
   or unrelated changes that deserve separate commits.
3. If the current branch is the default branch, say so and ask whether to create a branch first.
4. Write the commit message in Brazilian Portuguese, using Conventional Commits (for example `feat(employee): ...`),
   with a short title and a body listing the main changes.

Show the message and ask before committing.
