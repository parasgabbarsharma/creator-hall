import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-2xl bg-white border border-border/50 shadow-sm", className)} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props}>{children}</div>;
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props}>{children}</div>;
}
