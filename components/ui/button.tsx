import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all tap-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-ring hover:brightness-105 active:brightness-95",
        secondary: "bg-muted text-foreground hover:bg-muted/70",
        outline: "border border-border bg-card text-foreground hover:bg-muted/50",
        ghost: "text-foreground hover:bg-muted/60",
        success: "bg-success text-white hover:brightness-105",
        danger: "bg-danger text-white hover:brightness-105",
        soft: "bg-primary-soft text-primary hover:brightness-[0.97]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-14 px-6 text-base",
        icon: "h-11 w-11",
        pill: "h-10 px-4 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
