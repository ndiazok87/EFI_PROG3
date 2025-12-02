import * as React from "react";
import { InputText as PrimeInputText } from "primereact/inputtext";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Convert value to string for PrimeInputText
    const value = props.value !== undefined ? String(props.value) : undefined;

    return (
      <PrimeInputText
        type={type}
        className={cn("w-full", className)}
        ref={ref as any}
        {...props}
        value={value}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
