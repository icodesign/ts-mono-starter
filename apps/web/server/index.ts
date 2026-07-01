import { createServerEntry } from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { createApp } from "./app";

let app: ReturnType<typeof createApp> | undefined;

function getApp() {
  app ??= createApp();
  return app;
}

export default createServerEntry({
  async fetch(request) {
    return getApp().fetch(request, env);
  },
});
