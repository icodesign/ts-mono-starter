import { Link } from "@tanstack/react-router";

import { SiteLogo } from "@/components/site-logo";

type ErrorPageProps = {
  code: "404" | "500";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function ErrorPage({ code, title, description, action }: ErrorPageProps) {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="border-border/80 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center border-x px-10 py-10 sm:px-12 lg:px-14">
        <div className="space-y-14">
          <SiteLogo href="/" aria-label="Workspace Logo" />

          <div>
            <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-lime-500 uppercase">
              {code}
            </p>
            <h1 className="max-w-4xl text-[clamp(4rem,8vw,6.5rem)] leading-[0.9] font-medium tracking-normal">
              {title}
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-balance text-zinc-600 sm:text-2xl">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex h-14 items-center gap-5 rounded-lg bg-black pr-2 pl-6 text-base font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-colors hover:bg-black/90"
              >
                Back home
                <span
                  className="grid size-11 place-items-center rounded-md bg-lime-400 text-2xl leading-none text-black"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>

              {action ? (
                <button
                  type="button"
                  className="border-border bg-background text-foreground inline-flex h-14 items-center rounded-lg border px-6 text-base font-medium transition-colors hover:bg-zinc-50"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
