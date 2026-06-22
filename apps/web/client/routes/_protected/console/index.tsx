import { createFileRoute } from "@tanstack/react-router";
import { KumoBadge, KumoLayerCard } from "@workspace/ui";

export const Route = createFileRoute("/_protected/console/")({
  component: ConsoleOverviewRoute,
});

function ConsoleOverviewRoute() {
  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-8 max-sm:p-3 [&>*]:shrink-0">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Active projects", "12"],
          ["Pending invites", "4"],
          ["Runs today", "128"],
        ].map(([label, value]) => (
          <KumoLayerCard key={label} className="rounded-xl p-4">
            <p className="text-kumo-subtle m-0 text-sm">{label}</p>
            <p className="text-kumo-default m-0 mt-3 text-3xl font-semibold tracking-normal">
              {value}
            </p>
          </KumoLayerCard>
        ))}
      </div>

      <KumoLayerCard className="flex min-h-105 flex-1 items-center justify-center rounded-xl border-dashed p-6">
        <div className="max-w-sm text-center">
          <KumoBadge variant="secondary">overview</KumoBadge>
          <h2 className="text-kumo-default m-0 mt-4 text-2xl font-semibold tracking-normal">
            Console workspace
          </h2>
          <p className="text-kumo-subtle m-0 mt-3 text-sm leading-6">
            The right-side workspace is reserved for dashboards, tables, and operational tools.
          </p>
        </div>
      </KumoLayerCard>
    </section>
  );
}
