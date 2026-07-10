import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// design.md → Components → Buttons. Un único CTA de color por pantalla
// (btn-primary); btn-destructive nunca convive con otro primario.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-on hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-surface text-ink border border-border hover:bg-surface-subtle hover:border-border-strong",
        ghost: "bg-transparent text-ink-brand hover:bg-primary-50",
        destructive: "bg-error text-primary-on hover:brightness-95",
      },
      size: {
        sm: "text-button-sm px-[14px] py-[6px] rounded-md",
        md: "text-button-md px-[18px] py-[9px]",
        lg: "text-button-lg px-6 py-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
