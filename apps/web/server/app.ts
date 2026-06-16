import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { appendTrailingSlash } from "hono/trailing-slash";
import { createAuthRoutes } from "./routes/auth";
import type { ApiEnv } from "./types";

export function createApp() {
  const app = new Hono<ApiEnv>();

  app.use(appendTrailingSlash());
  app.use(logger());
  app.use("*", requestId());

  app.get("/api/healthz", (c) =>
    c.json({
      ok: true,
    }),
  );

  app.route("/api/auth", createAuthRoutes());

  return app;
}
