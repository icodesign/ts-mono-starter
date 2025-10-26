import type { Context } from "hono";
import type { RequestIdVariables } from "hono/request-id";
import type { Config } from "./config.js";

export type Variables = {
  // Custom payload can be added here
} & RequestIdVariables;

export type Bindings = Config;

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

export type AppContext = Context<AppEnv>;
