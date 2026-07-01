---
name: project-skills
description: Use when creating, moving, or reviewing project code. Covers repo-local conventions for UI, database, and auth modules, including ownership boundaries, import rules, generation workflows, and validation commands.
references:
  - ui
  - database
  - auth
---

# CozyDevs Project Skill

Use this skill for project-specific CozyDevs conventions. Load only the reference files that match the task instead of reading every module by default.

## Reference Index

| Area     | Reference                | Use when                                                                                               |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| UI       | `references/ui.md`       | Creating, moving, exporting, or reviewing React/UI components                                          |
| Database | `references/database.md` | Changing Drizzle schema, migrations, database clients, seed/admin scripts, or database package exports |
| Auth     | `references/auth.md`     | Changing Better Auth config, auth routes, session access, admin access, or auth-generated schema       |

## Loading Rules

- For UI-only changes, read `references/ui.md`.
- For schema, query, migration, or Postgres client changes, read `references/database.md`.
- For Better Auth, session, role, or route-protection changes, read `references/auth.md`.
- For auth model/plugin changes, read both `references/auth.md` and `references/database.md` because auth schema generation writes into `packages/database`.
- For visible page changes that depend on session state, read `references/ui.md` and `references/auth.md`.

## Baseline Validation

Use the narrowest validation that covers the changed surface:

```sh
bun run fmt:check
bun run --cwd apps/web check
```

Add package-specific validation from the relevant reference file when shared UI, database, auth config, or generated types changed.
