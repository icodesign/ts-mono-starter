import { queryOptions } from "@tanstack/react-query";

import { api } from "./api-client";

// Session query — uses the Hono RPC client directly for client-side refetching.
// For SSR / route guards, use getConsoleSession() / getAdminSession() from auth.functions.ts.
export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const res = await api.me.$get();
    if (!res.ok) return { status: "unauthenticated" as const, user: null };
    return res.json();
  },
  staleTime: 30_000,
});
