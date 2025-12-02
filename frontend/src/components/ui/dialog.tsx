import * as React from "react";
import { Dialog as PrimeDialog } from "primereact/dialog";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

const Dialog: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }> = ({
  open = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(open);

  React.useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return <DialogContext.Provider value={{ open: internalOpen, onOpenChange: handleOpenChange }}>{children}</DialogContext.Provider>;
};

const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ asChild, children }) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used within Dialog");

  const handleClick = () => context.onOpenChange(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick } as any);
  }

  return <div onClick={handleClick}>{children}</div>;
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  return (
    <PrimeDialog
      visible={context.open}
      onHide={() => context.onOpenChange(false)}
      className={cn(className)}
      draggable={false}
      {...props}
    >
      <div ref={ref}>{children}</div>
    </PrimeDialog>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
};
DialogHeader.displayName = "DialogHeader";

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
};
DialogTitle.displayName = "DialogTitle";

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
};
DialogDescription.displayName = "DialogDescription";

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
};
DialogFooter.displayName = "DialogFooter";

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
