import type * as React from "react";

import { cn } from "#lib/utils";

type StatusPillProps = React.ComponentProps<"span"> & {
  tone?: "neutral" | "success" | "warning";
};

function StatusPill({ className, tone = "neutral", ...props }: StatusPillProps) {
  return (
    <span
      data-slot="status-pill"
      data-tone={tone}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs",
        "data-[tone=neutral]:bg-muted data-[tone=neutral]:text-muted-foreground",
        "data-[tone=success]:bg-emerald-50 data-[tone=success]:text-emerald-700",
        "data-[tone=warning]:bg-amber-50 data-[tone=warning]:text-amber-700",
        className,
      )}
      {...props}
    />
  );
}

export type { StatusPillProps };
export { StatusPill };
