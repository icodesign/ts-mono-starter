import { clerkClient } from "@clerk/tanstack-react-start/server";
import handler from "@tanstack/react-start/server-entry";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";

import { createApiRoutes } from "#/routes/api";
import type { AppEnv } from "#/types";

// For hono rpc use
export type ApiType = ReturnType<typeof createApiRoutes>;

export function createApp() {
  const app = new Hono<AppEnv>();

  // Clerk session verification for Hono API routes
  app.use("*", async (c, next) => {
    try {
      const clerk = clerkClient({
        secretKey: c.env.CLERK_SECRET_KEY,
        publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
      });
      const requestState = await clerk.authenticateRequest(c.req.raw);
      const auth = requestState.toAuth();
      c.set("clerkUserId", auth?.userId ?? null);
    } catch {
      c.set("clerkUserId", null);
    }

    await next();
  });

  const api = app.basePath("/api");
  api.use("/*", trimTrailingSlash());
  api.use("/*", logger());
  api.use("/*", requestId());
  api.route("/", createApiRoutes());

  app.all("*", (c) => handler.fetch(c.req.raw));

  return app;
}
