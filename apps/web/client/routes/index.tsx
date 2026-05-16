import { Button } from "@workspace/ui";
import { createFileRoute } from "@tanstack/react-router";

import { SiteLogo } from "@/components/site-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Workspace UI",
      },
      {
        name: "description",
        content: "A shared Base UI, shadcn, Kumo, and custom component system for Workspace apps.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center border-border/80 border-x px-10 py-10 sm:px-12 lg:px-14">
        <div className="space-y-14">
          <SiteLogo href="/" aria-label="Workspace Logo" />

          <div>
            <h1 className="max-w-none font-medium text-[clamp(4.25rem,8.9vw,7.35rem)] leading-[0.9] tracking-normal">
              Modern stack running on Cloudflare Workers
            </h1>

            <p className="mt-9 max-w-2xl text-balance text-xl text-zinc-600 leading-9 sm:text-2xl">
              Skip the boilerplate. Scaffold TypeScript projects with battle-tested defaults, modern
              tooling, and configs you're free to bend to your will.
            </p>
            <Button
              size="lg"
              className="mt-8 h-14 gap-5 rounded-lg bg-black pr-2 pl-6 text-base text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] hover:bg-black/90"
            >
              Get started
              <span
                className="grid size-11 place-items-center rounded-md bg-lime-400 text-2xl text-black leading-none"
                aria-hidden="true"
              >
                ↗
              </span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
