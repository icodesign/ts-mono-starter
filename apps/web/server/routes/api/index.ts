import { Hono } from "hono";

import type { AppEnv } from "#/types";

import { createMeRoutes } from "./me";

export function createApiRoutes() {
  const app = new Hono<AppEnv>().route("/me", createMeRoutes());
  return app;
}
