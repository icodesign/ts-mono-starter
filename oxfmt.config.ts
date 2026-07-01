import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: ["dist/**", ".agents/**", ".vscode/**", "node_modules/**"],
  sortImports: true,
  sortPackageJson: true,
  sortTailwindcss: true,
});
