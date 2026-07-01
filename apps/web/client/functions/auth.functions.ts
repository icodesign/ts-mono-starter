import type { AdminAuthState, ConsoleAuthState } from "@shared/auth-types";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export type { AdminAuthState, ConsoleAuthState, ConsoleUser } from "@shared/auth-types";

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
  const response = await fetch(`/api/me`, {
    headers: getRequestHeaders(),
  });
  if (!response.ok) return { status: "unauthenticated", user: null };
  return response.json() as Promise<ConsoleAuthState>;
}
