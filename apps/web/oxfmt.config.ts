import { defineConfig } from "oxfmt";

import rootConfig from "../../oxfmt.config.ts";

export default defineConfig({
  ...rootConfig,
  ignorePatterns: rootConfig.ignorePatterns.concat([
    "client/routeTree.gen.ts",
    "public/**",
    "worker-configuration.d.ts",
  ]),
});
