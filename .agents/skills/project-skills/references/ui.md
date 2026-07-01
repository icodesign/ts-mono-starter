# CozyDevs UI Reference

Use this reference when creating, moving, or reviewing UI components in this monorepo.

## Component Ownership

Use these boundaries before adding a component:

- `apps/web/client/components`: web app-only UI. Put route shells, marketing sections, console widgets, app branding, and feature-specific composition here.
- `packages/ui/src/components/custom`: shared CozyDevs-owned UI that multiple apps should consume.
- `packages/ui/src/components/community/shadcn`: shadcn registry components. This package uses the Base UI-backed shadcn registry.
- `packages/ui/src/components/community/kumo`: Kumo community components adapted behind the UI package exports.

Do not add app-specific product copy, data fetching, route assumptions, or console-only layouts to `packages/ui`.

## Import Rules

- Web app components should import shared UI from `@cozydevs/ui`.
- Web app components should import other app-local code through `@/*`, for example `@/components/site-logo`.
- Routes in `apps/web/client/routes` should stay thin. Extract repeated or bulky app UI into `apps/web/client/components`.
- Shared UI should be exported from `packages/ui/src/index.ts` only when it is part of the stable app-facing API.

## Promotion Rule

Start in `apps/web/client/components` when the component is only used by the web app or is still product-specific.

Move to `packages/ui/src/components/custom` only when:

- at least two apps or surfaces need it,
- the API is generic and stable,
- accessibility and keyboard behavior are owned by the component,
- styling is token-based and not tied to one route.

## Styling

- Use Tailwind classes and the CSS variables from `@cozydevs/ui/globals.css`.
- Prefer existing shared primitives like `Button`, `StatusPill`, and Base UI-backed wrappers before adding new styling patterns.
- Keep cards at small radii and avoid nested card structures.
- Keep text sizing proportional to context: route shells and compact panels should not use hero-scale type.

## Generator Usage

For new shadcn components in the shared UI package, run from `packages/ui`:

```sh
bun run shadcn:add <component>
```

The shadcn runner is intentionally kept because its `components.json` lives under `src/components/community/shadcn`.

Base UI itself is installed as a foundation dependency. Custom Base UI wrappers belong in `packages/ui/src/components/custom` if shared, or `apps/web/client/components` if web-only.

## Validation

After UI component changes, run:

```sh
bun run fmt:check
bun run --cwd apps/web check
```

If shared UI changed, also run:

```sh
bun run --cwd packages/ui check
```

For visible page changes, start the web dev server and verify the affected route in the browser.
