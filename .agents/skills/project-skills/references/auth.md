# CozyDevs Auth Reference

Use this reference when changing Better Auth config, auth routes, session lookups, role checks, admin access, or auth-generated database schema.

## Ownership

- `apps/web/server/auth/index.ts` owns `createAuth(...)`, the Better Auth runtime configuration, plugins, and database adapter wiring.
- `apps/web/server/auth/auth.config.ts` exports a CLI-safe auth instance for Better Auth tooling.
- `apps/web/server/routes/auth.ts` owns the Hono auth route and request-scoped auth creation.
- `apps/web/client/lib/auth-functions.ts` owns server functions used by React routes to resolve console/admin session state.
- `packages/database/src/auth-schema.ts` is generated from Better Auth config and belongs to the database package after generation.

## Runtime Rules

- Create auth per request when Cloudflare `env`, request URL, or `cf` geolocation can vary.
- Keep request-scoped values out of module-level mutable state.
- Route Better Auth under `/api/auth` and keep `basePath: "/api/auth"` aligned with Hono routing.
- Use `createConfig(env)` for runtime config derived from Cloudflare bindings.
- Keep CLI/tooling fallbacks in `createCliConfig()` or equivalent CLI-safe paths; do not require Cloudflare runtime globals for schema generation.
- Use the Drizzle adapter and schema from `@cozydevs/database`; do not define duplicate auth tables in app code.

## Access Rules

- Signed-in console access should use `getConsoleSession`.
- Admin-only surfaces should use `getAdminSession` and check the Better Auth admin role.
- Do not reintroduce environment-variable allowlists for admin users. Use the database-backed role and the `packages/database` admin script.
- When resolving roles, prefer the Better Auth adapter/database state over trusting client-provided session fields alone.

## Config And Schema Changes

- When adding Better Auth plugins or changing auth model fields, update `apps/web/server/auth/index.ts`.
- Regenerate the generated schema after model/plugin changes:

```sh
bun run auth:schema
```

- If Cloudflare bindings or wrangler env shape changes, regenerate Worker types:

```sh
bun run --cwd apps/web cf-typegen
```

- If schema changes are durable, generate a Drizzle migration from `packages/database`.

## Validation

After auth changes, run:

```sh
bun run auth:schema
bun run --cwd apps/web check
bun run --cwd packages/database check
```

If generated Worker types or formatting-sensitive files changed, also run:

```sh
bun run fmt:check
```
