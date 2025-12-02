import * as React from "react";
import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<PrimeButtonProps, "severity" | "size"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Map our custom variants to PrimeReact severity/class
    const getSeverity = (): PrimeButtonProps["severity"] => {
      switch (variant) {
        case "destructive":
          return "danger";
        case "secondary":
          return "secondary";
        case "ghost":
        case "link":
          return "help"; // Using "help" instead of "text" for ghost/link
        case "outline":
          return "secondary";
        default:
          return undefined;
      }
    };

    const getSizeClass = () => {
      switch (size) {
        case "sm":
          return "p-button-sm";
        case "lg":
          return "p-button-lg";
        case "icon":
          return "p-button-icon-only";
        default:
          return "";
      }
    };

    const isOutline = variant === "outline";
    const isLink = variant === "link";

    return (
      <PrimeButton
        ref={ref}
        severity={getSeverity()}
        outlined={isOutline}
        link={isLink}
        className={cn(getSizeClass(), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
