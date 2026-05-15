import { KumoBadge, KumoButton, KumoLayerCard } from "@cozydevs/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/console/settings")({
  component: ConsoleSettingsRoute,
});

function ConsoleSettingsRoute() {
  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pb-8 max-sm:p-3 [&>*]:shrink-0">
      <KumoLayerCard className="rounded-xl p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <KumoBadge variant="secondary">settings</KumoBadge>
            <h2 className="m-0 mt-4 font-semibold text-2xl text-kumo-default tracking-normal">
              Workspace settings
            </h2>
            <p className="m-0 mt-2 max-w-2xl text-kumo-subtle text-sm leading-6">
              Manage the defaults used by console workflows and team-facing tools.
            </p>
          </div>
          <KumoButton variant="secondary">Save changes</KumoButton>
        </div>
      </KumoLayerCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          ["Default project visibility", "Private"],
          ["Notification channel", "Email"],
          ["Run retention", "30 days"],
          ["Invite permissions", "Admins only"],
        ].map(([label, value]) => (
          <KumoLayerCard key={label} className="rounded-xl p-4">
            <p className="m-0 font-medium text-kumo-default text-sm">{label}</p>
            <p className="m-0 mt-2 text-kumo-subtle text-sm">{value}</p>
          </KumoLayerCard>
        ))}
      </div>
    </section>
  );
}
