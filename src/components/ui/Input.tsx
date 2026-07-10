import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** design.md → input-default / input-focus / input-error. Label siempre visible. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-label text-ink-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-10 rounded-md border border-border bg-surface px-3 text-body-sm text-ink placeholder:text-ink-muted outline-none transition-[border-color,box-shadow]",
          "focus:border-2 focus:border-border-brand focus:ring-4 focus:ring-primary-200/40",
          "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-ink-disabled disabled:opacity-65",
          error && "border-error bg-error-bg",
          className,
        )}
        {...props}
      />
      {error && <span className="text-caption text-error-text">{error}</span>}
    </div>
  ),
);
Input.displayName = "Input";
