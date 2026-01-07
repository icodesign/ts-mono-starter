import { Hono } from "hono";
import { registerEndpoints } from "./endpoints/index";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { trimTrailingSlash } from "hono/trailing-slash";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "@/types";
import "dotenv/config";
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

export default {
  port: parseInt(config.PORT),
  fetch: app.fetch,
};
