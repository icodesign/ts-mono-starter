import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  ignorePatterns: ["dist/**", "coverage/**", "vendor/**", "test/snapshots/**", "node_modules/**"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
