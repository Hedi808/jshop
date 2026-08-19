import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-extrabold tracking-[0.04em] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(255,101,0,.18)] hover:-translate-y-0.5 hover:bg-[#e85500]",
        dark: "bg-[#0a0a0a] text-white hover:-translate-y-0.5 hover:bg-[#242424]",
        outline: "border border-[#cfcfcf] bg-transparent text-foreground hover:border-foreground hover:bg-secondary",
        ghost: "bg-transparent hover:bg-secondary",
        destructive: "bg-destructive text-white hover:bg-red-700",
        link: "h-auto rounded-none p-0 underline-offset-4 hover:text-primary hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-7 text-sm",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) return <Slot.Root className={classes} {...props} />;
  return <button type="button" className={classes} {...props} />;
}

export { Button, buttonVariants };
