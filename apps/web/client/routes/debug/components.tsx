import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  KumoBadge,
  KumoButton,
  KumoInput,
  KumoLayerCard,
  StatusPill,
  Switch,
} from "@workspace/ui";
import type { ReactNode } from "react";
import { useState } from "react";

export const Route = createFileRoute("/debug/components")({
  component: ComponentsDebugRoute,
});

function ComponentsDebugRoute() {
  const [enabled, setEnabled] = useState(true);

  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <StatusPill tone="neutral">debug/components</StatusPill>
          <h1 className="text-3xl font-semibold tracking-normal">Component Imports</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Smoke route for validating shared UI package imports across custom Base UI wrappers,
            shadcn Base UI components, and Kumo community components.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <DebugPanel title="custom / Base UI wrapper">
            <div className="flex items-center gap-3">
              <Switch
                aria-label="Toggle base switch"
                checked={enabled}
                onCheckedChange={(checked) => setEnabled(checked)}
              />
              <span className="text-muted-foreground text-sm">
                Switch is {enabled ? "enabled" : "disabled"}
              </span>
            </div>
          </DebugPanel>

          <DebugPanel title="community / shadcn base">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </DebugPanel>

          <DebugPanel title="community / Kumo">
            <KumoLayerCard className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Kumo package import</p>
                    <p className="text-muted-foreground text-xs">
                      Components from @cloudflare/kumo through @workspace/ui.
                    </p>
                  </div>
                  <KumoBadge variant="success">ready</KumoBadge>
                </div>
                <KumoInput aria-label="Kumo project name" placeholder="Project name" />
                <KumoButton variant="primary">Kumo Button</KumoButton>
              </div>
            </KumoLayerCard>
          </DebugPanel>

          <DebugPanel title="custom">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="neutral">neutral</StatusPill>
              <StatusPill tone="success">success</StatusPill>
              <StatusPill tone="warning">warning</StatusPill>
            </div>
          </DebugPanel>
        </section>
      </div>
    </main>
  );
}

function DebugPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-card rounded-lg border p-4 shadow-xs">
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}
