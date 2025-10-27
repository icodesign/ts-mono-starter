import type { AppEnv } from "@/types";
import { Hono } from "hono";
import { createConfigsRoutes } from "./configs";

export function createV1Routes() {
  const route = new Hono<AppEnv>();
  route.route("/configs", createConfigsRoutes());
  return route;
}
