# Accessibility

Check every changed screen. Target WCAG 2.2 AA. Layer of [`/nextjs-review`](SKILL.md).

## Blocking (Obrigatório)

- [ ] Interactive element is the right tag: `<button>` for actions, `<Link>` for navigation; no `<div onClick>`
- [ ] Every control has an accessible name: `<label htmlFor>` + `id`, or `aria-label` for icon-only buttons
- [ ] Everything works with the keyboard, in a logical order, with visible focus
- [ ] Images have `alt`; decorative ones `alt=""`
- [ ] Errors are announced (`role="alert"` / `aria-live`) and linked to the field (`aria-describedby`, `aria-invalid`)
- [ ] Modal: labelled dialog, focus moves in, stays in, returns on close; `Escape` closes. Prefer `<dialog>`
- [ ] Text contrast at least 4.5:1 (3:1 for large text and UI boundaries)

## Also check

- Landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) and one `<h1>` per page with ordered headings.
- Tables with `<th scope>` and a caption or label.
- Color is never the only signal.
- Targets at least 24×24 CSS pixels.
- `prefers-reduced-motion` respected.
- Zoom to 200% and a 320 px wide viewport without loss of content.
- `lang="pt-BR"` on `<html>`.
- ARIA only when native HTML cannot express it.

## How to verify

- `eslint-config-next` covers a few JSX accessibility rules; it is not a full audit.
- Tests with `getByRole` and an accessible name fail when semantics break.
- Manual pass: keyboard only, then a screen reader on the main flow.
- Automated scanners (`jest-axe`, `@axe-core/playwright`) are new dependencies: ask.
- Design-level audit: [`/impeccable`](../impeccable/SKILL.md) `audit`.

Report what was not verified manually under **Gaps de verificação**.
