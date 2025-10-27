import type { AppEnv } from "@/types";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { basicAuth } from "hono/basic-auth";
import { config } from "@/config";
import { Scalar } from "@scalar/hono-api-reference";
import { createV1Routes } from "./v1";

export function registerEndpoints(app: Hono<AppEnv>) {
  const openApiServers = [];
  if (config.NODE_ENV === "production") {
    if (!config.DOCS_USERNAME || !config.DOCS_PASSWORD) {
      throw new Error(
        "DOCS_USERNAME or DOCS_PASSWORD is not set in production"
      );
    }
    app.use(
      "/docs/*",
      basicAuth({
        username: config.DOCS_USERNAME,
        password: config.DOCS_PASSWORD,
      })
    );
  } else {
    openApiServers.push({
      url: "http://localhost:4000",
      description: "Development Server",
    });
  }
  openApiServers.push({
    url: "xxxx",
    description: "Production Server",
  });

  app.get(
    "/docs/openapi",
    openAPISpecs(app, {
      documentation: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            ApiKeyAuth: {
              type: "apiKey",
              in: "header",
              name: "X-API-KEY",
            },
          },
        },
        security: [{ bearerAuth: [] }, { ApiKeyAuth: [] }],
        info: {
          title: "Cuto API",
          version: "3.0.0",
          description: "Cuto API",
        },
        servers: openApiServers,
      },
    })
  );

  app.get("/docs", Scalar({ url: "/docs/openapi" }));

  const v1Routes = createV1Routes();
  app.route("/v1", v1Routes);
}
