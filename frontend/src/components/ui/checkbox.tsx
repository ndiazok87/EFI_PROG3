import * as React from "react";
import { Checkbox as PrimeCheckbox } from "primereact/checkbox";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<typeof PrimeCheckbox>, "checked"> & { checked?: boolean }>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center", className)}>
        <PrimeCheckbox {...props} checked={props.checked || false} />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
