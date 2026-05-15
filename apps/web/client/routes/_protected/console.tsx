import { GearSixIcon, HouseIcon, ListChecksIcon, RobotIcon } from "@phosphor-icons/react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

import { ConsoleShell, type ShellNavGroup } from "@/components/console-shell";
import { Route as ProtectedRoute } from "../_protected";

export const Route = createFileRoute("/_protected/console")({
  component: ConsoleRoute,
});

const navGroups: ShellNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", to: "/console", icon: HouseIcon, exact: true },
      { label: "Settings", to: "/console/settings", icon: GearSixIcon },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Projects", icon: ListChecksIcon, badge: "soon" },
      { label: "Runs", icon: RobotIcon, badge: "soon" },
    ],
  },
];

function ConsoleRoute() {
  const { user } = ProtectedRoute.useRouteContext();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (!user) {
    return null;
  }

  return (
    <ConsoleShell
      user={user}
      brand="CozyDevs"
      title={getConsoleTitle(pathname)}
      navGroups={navGroups}
    >
      <Outlet />
    </ConsoleShell>
  );
}

function getConsoleTitle(pathname: string) {
  if (pathname === "/console" || pathname === "/console/") {
    return "Overview";
  }
  if (pathname.startsWith("/console/settings")) {
    return "Settings";
  }
  return "Workspace";
}
