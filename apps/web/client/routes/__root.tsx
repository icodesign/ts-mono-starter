import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import "@workspace/ui/globals.css";
import { ErrorPage } from "@/components/error-page";
import { Providers } from "@/components/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Workspace",
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  errorComponent: ServerErrorPage,
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}

function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="This page does not exist or has moved. Head back to the main workspace and keep going."
    />
  );
}

function ServerErrorPage({ reset }: ErrorComponentProps) {
  return (
    <ErrorPage
      code="500"
      title="Something broke"
      description="The app hit an unexpected error. Try again, or return home while the request settles."
      action={{
        label: "Try again",
        onClick: reset,
      }}
    />
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
