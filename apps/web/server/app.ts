import { Hono } from "hono";

import { createAuthRoutes } from "./routes/auth";
import type { ApiEnv } from "./types";

export function createApp() {
  const app = new Hono<ApiEnv>();

  app.get("/api/healthz", (c) =>
    c.json({
      ok: true,
    }),
  );

  app.route("/api/auth", createAuthRoutes());

  return app;
}
