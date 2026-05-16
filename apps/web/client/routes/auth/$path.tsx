import { viewPaths } from "@better-auth-ui/core";
import { Auth } from "@workspace/ui/components/community/better-auth-ui/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { SiteLogo } from "@/components/site-logo";

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!Object.values(viewPaths.auth).includes(path)) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const { path } = Route.useParams();

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col border-border/80 border-x px-5 py-6 sm:px-8 lg:px-10">
        <SiteLogo href="/" aria-label="Workspace Logo" />
        <div className="flex flex-1 items-center justify-center py-8">
          <Auth path={path} />
        </div>
      </section>
    </main>
  );
}
