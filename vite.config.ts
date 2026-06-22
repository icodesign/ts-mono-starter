import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["dist/**", ".agents/**", ".vscode/**", "apps/web/client/routeTree.gen.ts"],
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
  },
  lint: {
    ignorePatterns: [
      "dist/**",
      "coverage/**",
      "vendor/**",
      "test/snapshots/**",
      "packages/ui/src/components/community/**",
    ],
    plugins: ["typescript"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
