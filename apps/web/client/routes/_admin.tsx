import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getAdminSession } from "../lib/auth-functions";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    if (isAdminAuthEntry(location.pathname)) {
      return { adminUser: null };
    }

    const authState = await getAdminSession();

    if (authState.status === "authenticated") {
      return { adminUser: authState.user };
    }

    if (authState.status === "forbidden") {
      throw redirect({ to: "/console" });
    }

    throw redirect({
      href: `/auth/sign-in?redirectTo=${encodeURIComponent(getAdminRedirectTarget(location))}`,
    });
  },
  component: () => <Outlet />,
});

function isAdminAuthEntry(pathname: string) {
  return (
    pathname === "/admin/auth" || pathname === "/admin/auth/" || pathname === "/admin/auth/login"
  );
}

function getAdminRedirectTarget(location: { href: string; pathname: string }) {
  return location.href;
}
