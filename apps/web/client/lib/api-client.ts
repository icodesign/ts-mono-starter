import { hc } from "hono/client";

import type { ApiType } from "#/app";

export const api = hc<ApiType>("/api");
