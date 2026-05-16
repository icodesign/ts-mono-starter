import {
  cn,
  KumoBadge,
  type KumoBadgeProps,
  KumoBreadcrumbs,
  KumoDropdownMenu,
  KumoSidebar,
} from "@workspace/ui";
import { GearSixIcon } from "@phosphor-icons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";

export type ShellUser = {
  email: string;
  name: string;
  role: string | null;
};

export type ShellNavItem = {
  label: string;
  to?: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
};

export type ShellNavGroup = {
  label: string;
  items: ShellNavItem[];
};

type ConsoleShellProps = {
  user: ShellUser;
  brand: string;
  title: string;
  navGroups: ShellNavGroup[];
  statusLabel?: string;
  statusVariant?: KumoBadgeProps["variant"];
  action?: ReactNode;
  children: ReactNode;
};

export function ConsoleShell({
  user,
  brand,
  title,
  navGroups,
  statusLabel,
  statusVariant = "secondary",
  action,
  children,
}: ConsoleShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <KumoSidebar.Provider
      resizable
      defaultWidth={248}
      minWidth={196}
      maxWidth={360}
      className={cn(
        "flex h-dvh min-h-dvh overflow-hidden bg-kumo-canvas text-kumo-default",
        "[&>aside]:h-dvh [&>aside]:min-h-dvh",
        "max-[767px]:[&>aside[data-sidebar=sidebar]]:hidden",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-brand-text]]:invisible",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-brand-text]]:-translate-x-0.5",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-brand-text]]:opacity-0",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-settings-text]]:hidden",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-row]]:flex-col",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-row]]:justify-center",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-settings]]:w-full",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-settings]]:justify-center",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-toggle]]:w-full",
        "[&_[data-sidebar=sidebar][data-state=collapsed]_[data-shell-footer-toggle]]:justify-center",
      )}
    >
      <KumoSidebar>
        <KumoSidebar.Header>
          <Link
            to="/"
            className="grid w-full min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2.5 overflow-hidden pl-0.5 font-bold text-kumo-default"
            aria-label="Workspace home"
          >
            <span className="inline-grid size-7 place-items-center justify-self-center rounded-lg border border-kumo-fill bg-kumo-base font-bold text-[0.8rem] text-kumo-link shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              C
            </span>
            <span
              data-shell-brand-text
              className="block min-w-0 overflow-hidden whitespace-nowrap opacity-100 transition-[opacity,transform,visibility] duration-150"
            >
              {brand}
            </span>
          </Link>
        </KumoSidebar.Header>

        <KumoSidebar.Content>
          <KumoSidebar.Input placeholder="Quick search..." shortcut="⌘K" />
          {navGroups.map((group) => (
            <KumoSidebar.Group key={group.label}>
              <KumoSidebar.GroupLabel>{group.label}</KumoSidebar.GroupLabel>
              <KumoSidebar.Menu>
                {group.items.map((item) => (
                  <KumoSidebar.MenuButton
                    key={item.label}
                    icon={item.icon}
                    href={item.to}
                    active={item.to ? isShellItemActive(pathname, item) : false}
                    disabled={!item.to}
                    tooltip={item.label}
                  >
                    {item.label}
                    {item.badge ? (
                      <KumoSidebar.MenuBadge>{item.badge}</KumoSidebar.MenuBadge>
                    ) : null}
                  </KumoSidebar.MenuButton>
                ))}
              </KumoSidebar.Menu>
            </KumoSidebar.Group>
          ))}
        </KumoSidebar.Content>

        <KumoSidebar.Footer className="gap-2">
          <div data-shell-footer-row className="flex w-full items-center gap-2">
            <KumoDropdownMenu>
              <KumoDropdownMenu.Trigger
                render={
                  <button
                    data-shell-footer-settings
                    type="button"
                    className="group/menu-button flex min-h-[34px] w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 font-medium text-kumo-default text-sm transition-[color,background-color,padding] duration-0 hover:bg-kumo-tint focus-visible:ring-2 focus-visible:ring-kumo-brand group-data-[state=collapsed]/sidebar:px-2 [&>svg]:text-kumo-subtle"
                  >
                    <GearSixIcon className="size-4" />
                    <span data-shell-footer-settings-text>Settings</span>
                  </button>
                }
              />
              <KumoDropdownMenu.Content className="w-64">
                <KumoDropdownMenu.Group>
                  <KumoDropdownMenu.Label>Signed in as</KumoDropdownMenu.Label>
                  <div className="px-2 py-1.5">
                    <p className="m-0 truncate font-medium text-kumo-default text-sm">
                      {user.name}
                    </p>
                    <p className="m-0 mt-1 truncate text-kumo-subtle text-xs">{user.email}</p>
                    <KumoBadge
                      variant={user.role === "admin" ? "success" : "secondary"}
                      className="mt-3"
                    >
                      {user.role ?? "user"}
                    </KumoBadge>
                  </div>
                </KumoDropdownMenu.Group>
              </KumoDropdownMenu.Content>
            </KumoDropdownMenu>
            <KumoSidebar.Trigger
              data-shell-footer-toggle
              aria-label="Toggle sidebar"
              className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-1.5 text-kumo-subtle transition-colors duration-150 hover:bg-kumo-tint hover:text-kumo-default focus-visible:outline focus-visible:outline-1 focus-visible:outline-kumo-focus focus-visible:outline-offset-2 [&>svg]:size-4"
            />
          </div>
        </KumoSidebar.Footer>
        <KumoSidebar.ResizeHandle />
      </KumoSidebar>

      <main className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-20 flex min-h-18 shrink-0 items-center justify-between gap-4 border-kumo-fill border-b bg-kumo-canvas/90 px-5 py-3.5 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <KumoSidebar.Trigger
              aria-label="Open sidebar"
              className="hidden shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-1.5 text-kumo-subtle transition-colors duration-150 hover:bg-kumo-tint hover:text-kumo-default focus-visible:outline focus-visible:outline-1 focus-visible:outline-kumo-focus focus-visible:outline-offset-2 max-[767px]:inline-flex [&>svg]:size-4"
            />
            <div className="min-w-0">
              <KumoBreadcrumbs size="sm" className="min-w-0">
                <KumoBreadcrumbs.Current>{title}</KumoBreadcrumbs.Current>
              </KumoBreadcrumbs>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {statusLabel ? (
              <KumoBadge variant={statusVariant} className="hidden sm:inline-flex">
                {statusLabel}
              </KumoBadge>
            ) : null}
            {action}
          </div>
        </header>

        {children}
      </main>
    </KumoSidebar.Provider>
  );
}

function isShellItemActive(pathname: string, item: ShellNavItem) {
  if (!item.to) {
    return false;
  }

  if (item.exact) {
    return pathname === item.to || pathname === `${item.to}/`;
  }

  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
