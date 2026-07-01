import { clerkClient } from "@clerk/tanstack-react-start/server";
import type { ConsoleAuthState, ConsoleUser } from "@shared/auth-types";
import { Hono } from "hono";

import type { AppEnv } from "#/types";

export function createMeRoutes() {
  const app = new Hono<AppEnv>().get("/", async (c) => {
    const userId = c.get("clerkUserId");

    if (!userId) {
      return c.json<ConsoleAuthState>({ status: "unauthenticated", user: null });
    }

    try {
      const clerk = clerkClient({
        secretKey: c.env.CLERK_SECRET_KEY,
        publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
      });
      const clerkUser = await clerk.users.getUser(userId);
      const email = clerkUser.primaryEmailAddress?.emailAddress ?? "";
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email;
      const role = (clerkUser.publicMetadata?.role as string | undefined) ?? null;

      const user: ConsoleUser = { id: userId, email, name, role };
      return c.json<ConsoleAuthState>({ status: "authenticated", user });
    } catch {
      return c.json<ConsoleAuthState>({ status: "unauthenticated", user: null });
    }
  });

  return app;
}
