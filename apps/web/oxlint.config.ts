import { defineConfig } from "oxlint";

import rootConfig from "../../oxlint.config.ts";

export default defineConfig({
  extends: [rootConfig],
  ignorePatterns: rootConfig.ignorePatterns.concat(["public/**", "worker-configuration.d.ts"]),
  overrides: [
    {
      files: ["shared/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["#/*", "@/*", "cloudflare:*"],
                message:
                  "apps/web/shared/** must not import server/ or client/ code (even type-only) so it stays safe to bundle into either side.",
              },
            ],
          },
        ],
      },
    },
    {
      // All client files except .server.ts may not import server code.
      // Server imports must be wrapped in a .server.ts file and called
      // via a .functions.ts createServerFn boundary.
      files: ["client/**"],
      excludeFiles: ["**/*.server.ts", "**/*.functions.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["#/*"],
                // allowTypeImports: type-only imports (import type) are safe — erased at
                // compile time and skipped by TanStack Start's Import Protection plugin.
                allowTypeImports: true,
                message:
                  "Only .server.ts/.functions.ts files in client/ may import server modules via #/. For types, use `import type` instead.",
              },
              {
                // Matches ../server/module but NOT ../server/module.server (dotted filenames
                // indicate .server.ts bridge files, which are intentional cross-boundary imports).
                regex: "\\.\\./(.*/)?server/[^.]+$",
                message:
                  "Only .server.ts files in client/ may import from server/ via relative paths. Wrap the call in a .server.ts file and expose it through a .functions.ts createServerFn.",
              },
            ],
          },
        ],
      },
    },
  ],
});
