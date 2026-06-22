import { createFileRoute } from "@tanstack/react-router";
import { KumoBadge, KumoButton, KumoLayerCard } from "@workspace/ui";

import { AdminShell } from "@/components/admin-shell";

import { Route as AdminRoute } from "../../_admin";

export const Route = createFileRoute("/_admin/admin/settings")({
  component: AdminSettingsRoute,
});

function AdminSettingsRoute() {
  const { adminUser } = AdminRoute.useRouteContext();

  if (!adminUser) {
    return null;
  }

  return (
    <AdminShell
      user={adminUser}
      title="Settings"
      action={<KumoButton variant="secondary">Save changes</KumoButton>}
    >
      <section className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-8 max-sm:p-3 [&>*]:shrink-0">
        <KumoLayerCard className="rounded-xl p-4">
          <KumoBadge variant="secondary">policy</KumoBadge>
          <h2 className="text-kumo-default m-0 mt-4 text-2xl font-semibold tracking-normal">
            Admin settings
          </h2>
          <p className="text-kumo-subtle m-0 mt-2 max-w-2xl text-sm leading-6">
            Configure access rules and operational defaults for admin-only workflows.
          </p>
        </KumoLayerCard>

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ["Auth Studio access", "Admins only"],
            ["Audit log retention", "90 days"],
            ["User invitation policy", "Manual approval"],
            ["Sensitive action review", "Required"],
          ].map(([label, value]) => (
            <KumoLayerCard key={label} className="rounded-xl p-4">
              <p className="text-kumo-default m-0 text-sm font-medium">{label}</p>
              <p className="text-kumo-subtle m-0 mt-2 text-sm">{value}</p>
            </KumoLayerCard>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
