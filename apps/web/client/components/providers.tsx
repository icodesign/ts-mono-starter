import { AuthProvider } from "@cozydevs/ui/components/community/better-auth-ui/auth-provider";
import { Toaster } from "@cozydevs/ui/components/community/shadcn/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/query-client";

type AuthLinkProps = ComponentProps<typeof Link> & {
  href?: string;
};

function AuthLink({ href, to, ...props }: AuthLinkProps) {
  return <Link to={to ?? href ?? "/"} {...props} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider
          authClient={authClient}
          redirectTo="/console"
          navigate={navigate}
          Link={AuthLink}
        >
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
