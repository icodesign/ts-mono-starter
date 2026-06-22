import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type * as React from "react";

import { cn } from "#lib/utils";

type SwitchProps = React.ComponentProps<typeof BaseSwitch.Root>;

function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[disabled]:cursor-not-allowed data-[checked]:bg-primary data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {children ?? (
        <BaseSwitch.Thumb
          data-slot="switch-thumb"
          className="bg-background pointer-events-none block size-4 rounded-full shadow-sm ring-0 transition-transform data-[checked]:translate-x-4 data-[unchecked]:translate-x-0"
        />
      )}
    </BaseSwitch.Root>
  );
}

export type { SwitchProps };
export { Switch };
