import type { createAuth } from "./auth";

type ApiEnv = {
  Bindings: Env;
  Variables: {
    auth: ReturnType<typeof createAuth>;
  };
};

export type { ApiEnv };
