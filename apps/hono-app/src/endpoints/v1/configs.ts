import type { AppEnv } from "@/types";
import { Hono } from "hono";

export function createConfigsRoutes() {
  const route = new Hono<AppEnv>();
  route.get("/", (c) => {
    return c.json({});
  });
  return route;
}
