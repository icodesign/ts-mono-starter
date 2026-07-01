import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getConsoleSession } from "../functions/auth.functions";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location }) => {
    const authState = await getConsoleSession();

    if (authState.status === "authenticated") {
      return { user: authState.user };
    }

    throw redirect({
      href: `/sign-in?redirectTo=${encodeURIComponent(location.href)}`,
    });
  },
  component: () => <Outlet />,
});
