import { KumoBadge, KumoLayerCard } from "@cozydevs/ui";
import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin-shell";
import { Route as AdminRoute } from "../../_admin";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminOverviewRoute,
});

function AdminOverviewRoute() {
  const { adminUser } = AdminRoute.useRouteContext();

  if (!adminUser) {
    return null;
  }

  return (
    <AdminShell user={adminUser} title="Overview">
      <section className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-8 max-sm:p-3 [&>*]:shrink-0">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Active users", "24"],
            ["Admin seats", "3"],
            ["Pending reviews", "7"],
          ].map(([label, value]) => (
            <KumoLayerCard key={label} className="rounded-xl p-4">
              <p className="m-0 text-kumo-subtle text-sm">{label}</p>
              <p className="m-0 mt-3 font-semibold text-3xl text-kumo-default tracking-normal">
                {value}
              </p>
            </KumoLayerCard>
          ))}
        </div>

        <KumoLayerCard className="rounded-xl p-4">
          <KumoBadge variant="secondary">operations</KumoBadge>
          <h2 className="m-0 mt-4 font-semibold text-2xl text-kumo-default tracking-normal">
            Admin workspace
          </h2>
          <p className="m-0 mt-3 max-w-2xl text-kumo-subtle text-sm leading-6">
            Review account access, audit sensitive changes, and keep Auth Studio available for
            identity operations.
          </p>
        </KumoLayerCard>
      </section>
    </AdminShell>
  );
}
