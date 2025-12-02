import * as React from "react";
import { InputTextarea as PrimeTextarea } from "primereact/inputtextarea";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    // Convert value to string for PrimeTextarea
    const value = props.value !== undefined ? String(props.value) : undefined;

    return (
      <PrimeTextarea
        className={cn("w-full", className)}
        ref={ref as any}
        {...props}
        value={value}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
