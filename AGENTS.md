# Toolchain

This is a Bun workspaces monorepo (`apps/*`, `packages/*`). Linting and formatting run on
[Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter)
directly — no wrapper CLI. Each package finds its nearest `.oxlintrc.json`/`.oxfmtrc.json` by walking
up the directory tree, so `oxlint`/`oxfmt` give the same result whether run from the repo root or from
inside a package.

- `apps/web` is a TanStack Start app built with plain Vite (`vite`, `vite build`, `vite preview`).
- `packages/database` and `packages/ui` are plain TypeScript libraries with no bundling — they ship raw
  `.ts`/`.tsx` source via `exports`/`imports` maps and are typechecked with `tsc` (TypeScript 7, the
  native compiler).

## Review Checklist

- [ ] Run `bun install` after pulling remote changes.
- [ ] Run `bun run check` at the repo root (lint + format check) before considering changes done.
- [ ] Run `bun run --filter '*' --if-present check` (or `tsc -p tsconfig.json --noEmit` inside a
      specific package) to catch type errors.
- [ ] For `apps/web`-specific work, `cd apps/web && bun run dev` / `bun run build` drives the actual app.
