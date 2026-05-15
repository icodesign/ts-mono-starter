import { createFileRoute } from "@tanstack/react-router";
import { betterAuthStudioCloudflare } from "../../../../server/auth/studio-adapter";
import { createStudioConfig } from "../../../../studio.config";

const handler = betterAuthStudioCloudflare(createStudioConfig);

export const Route = createFileRoute("/_admin/admin/auth")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
      PUT: handler,
      DELETE: handler,
      PATCH: handler,
    },
  },
});
