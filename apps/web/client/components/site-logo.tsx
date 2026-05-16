import { cn } from "@workspace/ui";
import type { ComponentProps } from "react";

type SiteLogoProps = ComponentProps<"a"> & {
  label?: string;
};

export function SiteLogo({ className, label = "Workspace", ...props }: SiteLogoProps) {
  return (
    <a
      className={cn("flex items-center gap-2 font-semibold text-3xl tracking-normal", className)}
      {...props}
    >
      <span>{label}</span>
      <span className="h-8 w-5 rounded-[2px] bg-lime-400" aria-hidden="true" />
    </a>
  );
}
