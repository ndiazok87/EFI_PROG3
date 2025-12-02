import * as React from "react";
import { Message } from "primereact/message";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }
>(({ className, variant = "default", children, ...props }, ref) => {
  const severity = variant === "destructive" ? "error" : "info";

  return (
    <div ref={ref} className="mb-4" {...props}>
      <Message
        severity={severity}
        content={children}
        className="w-full justify-content-start"
        style={{ justifyContent: 'flex-start' }}
      />
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className="font-bold mb-1" {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="text-sm" {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
