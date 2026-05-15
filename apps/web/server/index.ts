import { env } from "cloudflare:workers";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { createApp } from "./app";

let apiApp: ReturnType<typeof createApp> | undefined;

function getApiApp() {
  apiApp ??= createApp();
  return apiApp;
}

function isApiRequest(request: Request) {
  const pathname = new URL(request.url).pathname;
  return pathname === "/api" || pathname.startsWith("/api/");
}

export default createServerEntry({
  async fetch(request) {
    if (isApiRequest(request)) {
      return getApiApp().fetch(request, env);
    }

    return handler.fetch(request);
  },
});
