import * as React from "react";
import { Badge as PrimeBadge } from "primereact/badge";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const getSeverity = () => {
      switch (variant) {
        case "destructive":
          return "danger";
        case "secondary":
          return "info";
        case "outline":
          return "warning";
        default:
          return "success";
      }
    };

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
