# @workspace/ui

Shared React UI package for Workspace apps.

## Design

This package should be source-first and small at the public boundary. Apps import CSS tokens once and then consume stable components from package exports.

```tsx
import "@workspace/ui/globals.css";
import { Button } from "@workspace/ui";
```

The package uses Base UI as the default primitive dependency, not as a source
directory. Components are organized by ownership:

- `src/components/community/shadcn`: shadcn registry components configured to use the Base UI-backed registry.
- `src/components/community/kumo`: Kumo components adapted behind our UI package exports.
- `src/components/custom`: Workspace-owned components. Custom Base UI wrappers live here too.
- `src/styles`: Tailwind v4 entrypoint, CSS variables, and design tokens.
- `src/lib`: framework-neutral helpers.

## Primitive Strategy

Prefer Base UI for custom interactive components when the API is mature enough for the component we need. It is headless, accessible, and ships as a tree-shakable package.

The first custom Base UI wrapper is `Switch`:

```tsx
import { Switch } from "@workspace/ui";

<Switch defaultChecked aria-label="Enable notifications" />;
```

Use community components when they save real implementation time, but keep them behind this package so apps do not depend on each community source directly.

Use community components as source material, not as permanent public API. A shadcn CLI install lands in `components/community/shadcn` by default. Move code to `custom` only after we own the accessibility, keyboard behavior, and responsive states.

Put Workspace-owned product components directly in `custom`.

## CLI

Base UI-backed shadcn components use the config in `src/components/community/shadcn/components.json`:

```sh
bun run shadcn:add button
bun run shadcn:docs button
```

The command installs into `components/community/shadcn`.

Better Auth UI registry components live in `components/better-auth-ui`. When
refreshing them from the registry, pass the output path explicitly:

```sh
bunx shadcn@latest add https://better-auth-ui.com/r/auth.json --path packages/ui/components/better-auth-ui
```

Base UI is installed as `@base-ui/react` and used directly by components in
`components/custom`; it does not have a generator script in this package.

The runner in `scripts/shadcn.ts` is still needed because `components.json`
lives under `components/community/shadcn`, while `shadcn add` expects its cwd to
contain `package.json`. The runner temporarily projects the selected config to
the package root, runs the CLI, and removes the temporary root config.

## Guardrails

- Public exports should be stable and boring. Do not expose raw primitive internals unless the wrapper intentionally preserves the full primitive composition model.
- Do not mix multiple primitive libraries inside one component family unless there is a specific compatibility reason.
- Keep component files self-contained and copy-friendly, following the shadcn model, but keep package-level ownership clearer than a flat shadcn dump.
- Wrapper APIs should preserve required provider or group relationships. For example, menu labels or items that require a group context should either enforce that structure in the wrapper or document it at the component boundary.
- Styling should flow through CSS variables and Tailwind classes. Avoid app-specific colors, layout assumptions, and data fetching in this package.
