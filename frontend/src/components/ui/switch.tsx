import * as React from "react";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof InputSwitch>,
  React.ComponentPropsWithoutRef<typeof InputSwitch> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, onChange, ...props }, ref) => (
  <InputSwitch
    ref={ref}
    checked={checked}
    onChange={(e: InputSwitchChangeEvent) => {
      onChange?.(e);
      onCheckedChange?.(e.value ?? false);
    }}
    className={cn(className)}
    {...props}
  />
));
Switch.displayName = "Switch";

export { Switch };
