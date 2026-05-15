import { env } from "cloudflare:workers";

import type { StudioConfig } from "better-auth-studio";

import { createAuth } from "./server/auth";

export function createStudioConfig(): StudioConfig {
  return {
    auth: createAuth({
      env,
      baseURL: env.BETTER_AUTH_URL,
    }),
    basePath: "/admin/auth",
    metadata: {
      title: "CozyDevs Auth Studio",
      theme: "dark",
    },
    access: {
      roles: ["admin"],
    },
  };
}
