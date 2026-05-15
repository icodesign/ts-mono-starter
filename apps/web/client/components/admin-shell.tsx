import { KumoButton } from "@cozydevs/ui";
import { GearSixIcon, HouseIcon, ShieldCheckIcon, UsersThreeIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { ConsoleShell, type ShellNavGroup } from "@/components/console-shell";

type AdminUser = {
  email: string;
  name: string;
  role: string | null;
};

type AdminShellProps = {
  user: AdminUser;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

const navGroups: ShellNavGroup[] = [
  {
    label: "Control",
    items: [
      { label: "Overview", to: "/admin", icon: HouseIcon, exact: true },
      { label: "Users", to: "/admin/users", icon: UsersThreeIcon },
      { label: "Settings", to: "/admin/settings", icon: GearSixIcon },
    ],
  },
  {
    label: "Security",
    items: [{ label: "Auth Studio", to: "/admin/auth", icon: ShieldCheckIcon }],
  },
];

export function AdminShell({ user, title, action, children }: AdminShellProps) {
  return (
    <ConsoleShell
      user={user}
      brand="CozyDevs Admin"
      title={title}
      navGroups={navGroups}
      statusLabel="admin"
      statusVariant="success"
      action={action ?? <KumoButton variant="secondary">Review changes</KumoButton>}
    >
      {children}
    </ConsoleShell>
  );
}
