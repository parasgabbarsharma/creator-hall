import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, id: externalId, ...props }, ref) => {
    const internalId = useId();
    const inputId = externalId || internalId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full bg-white border border-border/60 text-foreground rounded-xl py-2.5 outline-none transition-all duration-200 placeholder:text-muted/80 shadow-sm",
              "hover:border-border focus:border-accent focus:ring-4 focus:ring-accent/10",
              icon && "pl-10",
              !icon && "px-4",
              error && "border-destructive focus:border-destructive focus:ring-destructive/10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-destructive mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
