import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

import { SiteLogo } from "@/components/site-logo";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen">
      <section className="border-border/80 mx-auto flex min-h-screen w-full max-w-7xl flex-col border-x px-5 py-6 sm:px-8 lg:px-10">
        <SiteLogo href="/" aria-label="Workspace Logo" />
        <div className="flex flex-1 items-center justify-center py-8">
          <SignIn routing="path" path="/sign-in" />
        </div>
      </section>
    </main>
  );
}
