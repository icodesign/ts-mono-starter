import { Hono } from "hono";
import { registerEndpoints } from "./endpoints/index";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/types";
import "dotenv/config";
import { serve } from "@hono/node-server";
import { config } from "@/config";
import { log } from "@workspace/utils/logger";

const app = new Hono<AppEnv>();

app.use(trimTrailingSlash());
app.use("*", requestId());
app.use(logger());
app.get("/ping", (c) => {
  return c.text("Hello World!");
});

registerEndpoints(app);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  log.error("Global unhandled error caught:", err);
  return c.json({ code: 500, message: "Internal Server Error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: parseInt(config.PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
