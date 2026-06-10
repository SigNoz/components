---
name: tailwind-to-inline-styles
description: Convert Tailwind utility classNames in Storybook story (.tsx) files to inline React style objects. Use when migrating docs/stories off Tailwind. Runs a deterministic codemod that auto-converts mechanical classes and flags judgment cases (dark:/hover:/responsive/gradients/existing-style) for a quick manual pass.
---

# Tailwind classNames → inline styles (stories)

Migrates `className="<tailwind utilities>"` on native HTML elements to inline
`style={{...}}`. A deterministic codemod does the bulk (near-zero tokens); the
model only resolves the small set of flagged judgment cases.

## Files

- **`codemod/convert.mjs`** — the codemod.
- **`codemod/REFERENCE.md`** — full mapping spec + rules for resolving flagged
  cases (read this when handling flags or extending the mapping).

## Procedure

1. **Dry run** (see scope + what gets flagged):
   ```bash
   node .claude/skills/tailwind-to-inline-styles/codemod/convert.mjs $(find apps/docs/stories -name '*.stories.tsx')
   ```
2. **Apply**:
   ```bash
   node .claude/skills/tailwind-to-inline-styles/codemod/convert.mjs --write $(find apps/docs/stories -name '*.stories.tsx')
   ```
3. **Resolve flagged classes** per `codemod/REFERENCE.md` (dark:/gradients/standard
   palette colors/hover:/responsive). The codemod lists them per file.
4. **Format**: `pnpm exec biome check --write apps/docs/stories`
5. **Verify**: `pnpm --filter docs build-storybook` renders.

The codemod only touches lowercase **HTML elements** (never `<Component>` props)
and skips elements that already have a `style=`. See `codemod/REFERENCE.md` for
the complete behaviour, the mapping tables, and the component-prop caveat.
