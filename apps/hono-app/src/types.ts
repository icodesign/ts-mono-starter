import type { Context } from "hono";
import type { RequestIdVariables } from "hono/request-id";
import type { JwtPayload } from "./middlewares/auth.js";
import type { Config } from "./config.js";

export type Variables = {
  jwtPayload?: JwtPayload;
  userId?: string;
} & RequestIdVariables;

export type Bindings = Config;

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

export type AppContext = Context<AppEnv>;
