import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  noExternal: [/@workspace\/.*/],
  bundle: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: "dist",
  target: "node19",
});
