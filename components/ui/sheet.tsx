"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--color-text)]/40 backdrop-blur-[2px] transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
};

const sideClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
  top: "inset-x-0 top-0 max-h-[85vh] rounded-b-[var(--radius-lg)] border-b",
  bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-[var(--radius-lg)] border-t",
  left: "inset-y-0 left-0 h-full w-[min(100vw,18rem)] border-r sm:max-w-sm",
  right: "inset-y-0 right-0 h-full w-[min(100vw,18rem)] border-l sm:max-w-sm",
};

const sideMotion: Record<NonNullable<SheetContentProps["side"]>, string> = {
  top: "data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
  bottom: "data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
  left: "data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
  right: "data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
};

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-[var(--color-surface)] p-6 shadow-[var(--shadow-nav)] transition-transform duration-300 ease-out",
        sideClasses[side],
        sideMotion[side],
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-[var(--radius-md)] p-1.5 text-[var(--color-muted)] opacity-80 ring-offset-[var(--color-bg)] transition hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:pointer-events-none"
        aria-label="Fermer le menu"
      >
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-10 text-left", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-[var(--font-display)] text-lg font-semibold text-[var(--color-text)]", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-[var(--color-muted)]", className)}
      {...props}
    />
  );
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetPortal, SheetTitle, SheetTrigger };
