# Markdown Documentation Guide

For `README.md`, `docs/**/*.md`, `CLAUDE.md`, `CONTRIBUTING.md` and other `.md` files. Layer of [`/nextjs-docs`](SKILL.md).

## Two sub-modes

### A. Narrative docs (`docs/`, guides)

1. **Clarify:** new content or edit; audience and scope.
2. **Investigate:** read the implementation and related docs.
3. **Write:** BLUF, clear headings, working examples, cross-references.
4. **Verify:** accuracy, grammar, links and terminology.

### B. Context files (`README.md`, `CLAUDE.md`)

1. Read the current file and the structure (`package.json`, `src/`, tests, `next.config.ts`).
2. Identify gaps between text and reality.
3. Change only what is wrong or missing.
4. Validate paths, commands and dependencies.

`CLAUDE.md` stays under 200 lines, with concrete and verifiable instructions; detail belongs in `.claude/rules/` or a skill. `AGENTS.md` is managed by `next dev`: do not edit its marked blocks.

Points of attention:

- Folder structure and routes.
- Setup: `npm install`, environment variables, `npm run dev`, the backend `iponto-api`.
- URLs and ports: app on `3000`, API on `8080` by default.
- Real `package.json` scripts; say when a command changes files.
- Patterns: Server and Client Components, services, proxy, cache.

## Voice and formatting

- Active voice, present tense, direct.
- Portuguese for `README.md` and `docs/`; English for `CLAUDE.md` and `.claude/`.
- One H1 per file.
- Code blocks with language.
- Relative links with descriptive text.

## Anti-patterns

- Writing without reading the code.
- Generic tutorial in an internal doc (including leftover `create-next-app` text).
- Outdated command or dependency.
- Citing a tool the repository does not use.
- A real password or secret as an example.
- Describing a target state as if it already existed.

## Checklist

- [ ] Matches the current implementation
- [ ] Main information first
- [ ] Commands checked
- [ ] Links work
- [ ] Consistent terminology

## Related

| Need | Load |
|------|------|
| Architecture facts | [`/nextjs-expert`](../nextjs-expert/SKILL.md) |
| Decision record | [adr.md](adr.md) |
| Review before merge | [`/nextjs-review`](../nextjs-review/SKILL.md) |
| Commands that run tests | [`/nextjs-test`](../nextjs-test/SKILL.md) |
