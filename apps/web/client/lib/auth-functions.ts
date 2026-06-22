import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import type { CloudflareGeolocation } from "better-auth-cloudflare";
import { env } from "cloudflare:workers";

import { createAuth } from "#/auth";

type ConsoleUser = {
  id: string;
  email: string;
  name: string;
  role: string | null;
};

type ConsoleAuthState =
  | {
      status: "authenticated";
      user: ConsoleUser;
    }
  | {
      status: "unauthenticated";
      user: null;
    };

type AdminAuthState =
  | {
      status: "authenticated";
      user: ConsoleUser;
    }
  | {
      status: "forbidden";
      user: ConsoleUser;
    }
  | {
      status: "unauthenticated";
      user: null;
    };

type SessionUser = {
  id?: string;
  email?: string;
  name?: string | null;
  role?: string | null;
};

export const getConsoleSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConsoleAuthState> => getSessionState(),
);

export const getAdminSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminAuthState> => {
    const authState = await getSessionState();

    if (authState.status !== "authenticated") {
      return authState;
    }

    if (authState.user.role !== "admin") {
      return { status: "forbidden", user: authState.user };
    }

    return authState;
  },
);

async function getSessionState(): Promise<ConsoleAuthState> {
  const request = getRequest();
  const auth = createAuth({
    env,
    cf: (request as Request & { cf?: CloudflareGeolocation }).cf,
    baseURL: new URL(request.url).origin,
  });

  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });
  const user = await resolveConsoleUser(auth, session?.user);

  if (!user) {
    return { status: "unauthenticated", user: null };
  }

  return { status: "authenticated", user };
}

async function resolveConsoleUser(
  auth: ReturnType<typeof createAuth>,
  sessionUser?: SessionUser | null,
): Promise<ConsoleUser | null> {
  if (!sessionUser?.id || !sessionUser.email) {
    return null;
  }

  const userWithRole = await getUserWithRole(auth, sessionUser.id);

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name: userWithRole?.name ?? sessionUser.name ?? sessionUser.email,
    role: userWithRole?.role ?? sessionUser.role ?? null,
  };
}

async function getUserWithRole(
  auth: ReturnType<typeof createAuth>,
  userId: string,
): Promise<Partial<ConsoleUser> | undefined> {
  const context = await Promise.resolve(auth.$context).catch(() => undefined);
  const users = await context?.adapter
    ?.findMany?.({
      model: "user",
      where: [{ field: "id", value: userId }],
      limit: 1,
    })
    .catch?.(() => undefined);

  return users?.[0] as Partial<ConsoleUser> | undefined;
}
