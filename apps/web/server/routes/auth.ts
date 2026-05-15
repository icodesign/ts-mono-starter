import type { CloudflareGeolocation } from "better-auth-cloudflare";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "../auth";
import { createConfig } from "../config/create-config";
import type { ApiEnv } from "../types";

export function createAuthRoutes() {
  const app = new Hono<ApiEnv>();

  app.use("/*", async (c, next) => {
    const config = createConfig(c.env);

    return cors({
      origin: config.cors.origins.length > 0 ? config.cors.origins : "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })(c, next);
  });

  app.use("/*", async (c, next) => {
    c.set(
      "auth",
      createAuth({
        env: c.env,
        cf: c.req.raw.cf as CloudflareGeolocation | undefined,
        baseURL: new URL(c.req.url).origin,
      }),
    );
    await next();
  });

  app.all("/*", (c) => {
    const auth = c.get("auth");
    return auth.handler(c.req.raw);
  });

  return app;
}
