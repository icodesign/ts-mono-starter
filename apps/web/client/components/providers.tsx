import { ClerkProvider } from "@clerk/tanstack-react-start";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/community/shadcn/sonner";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ClerkProvider>
          {children}
          <Toaster />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
