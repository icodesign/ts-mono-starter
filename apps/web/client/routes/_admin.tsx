import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAdminSession } from "../functions/auth.functions";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    const authState = await getAdminSession();

    if (authState.status === "authenticated") {
      return { adminUser: authState.user };
    }

    if (authState.status === "forbidden") {
      throw redirect({ to: "/console" });
    }

    throw redirect({
      href: `/sign-in?redirectTo=${encodeURIComponent(location.href)}`,
    });
  },
  component: () => <Outlet />,
});
