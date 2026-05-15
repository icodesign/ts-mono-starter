# CozyDevs Dev Infra

Local development services for CozyDevs.

## Postgres

Start:

```bash
bun run infra:dev:up
```

Stop:

```bash
bun run infra:dev:down
```

The local database URL is already wired in `apps/web/.env.local`:

```bash
postgres://cozydevs:cozydevs@127.0.0.1:54322/cozydevs
```

## Better Auth Studio

Start the web app:

```bash
bun run --cwd apps/web dev
```

Open Studio:

```bash
http://localhost:5173/admin/auth
```
