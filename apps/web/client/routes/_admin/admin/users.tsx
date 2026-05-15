import { KumoBadge, KumoButton, KumoLayerCard } from "@cozydevs/ui";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin-shell";
import { Route as AdminRoute } from "../../_admin";

export const Route = createFileRoute("/_admin/admin/users")({
  component: AdminUsersRoute,
});

const users = [
  ["Lance", "lance@example.com", "admin"],
  ["Support Agent", "support@example.com", "user"],
  ["Ops Reviewer", "ops@example.com", "admin"],
];

function AdminUsersRoute() {
  const { adminUser } = AdminRoute.useRouteContext();

  if (!adminUser) {
    return null;
  }

  return (
    <AdminShell
      user={adminUser}
      title="Users"
      action={<KumoButton variant="secondary">Invite user</KumoButton>}
    >
      <section className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-8 max-sm:p-3 [&>*]:shrink-0">
        <KumoLayerCard className="overflow-hidden rounded-xl p-0">
          <div className="border-kumo-fill border-b p-4">
            <KumoBadge variant="secondary">directory</KumoBadge>
            <h2 className="m-0 mt-4 font-semibold text-2xl text-kumo-default tracking-normal">
              User access
            </h2>
            <p className="m-0 mt-2 max-w-2xl text-kumo-subtle text-sm leading-6">
              Manage who can use protected workspaces and who can enter admin-only surfaces.
            </p>
          </div>

          <div className="divide-y divide-kumo-fill">
            {users.map(([name, email, role]) => (
              <div key={email} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="m-0 font-medium text-kumo-default text-sm">{name}</p>
                  <p className="m-0 mt-1 truncate text-kumo-subtle text-sm">{email}</p>
                </div>
                <KumoBadge variant={role === "admin" ? "success" : "secondary"}>{role}</KumoBadge>
              </div>
            ))}
          </div>
        </KumoLayerCard>
      </section>
    </AdminShell>
  );
}
