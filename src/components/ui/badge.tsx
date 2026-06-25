import { cn } from "@/lib/utils";

const variants = {
  default: "bg-surface text-muted",
  accent: "bg-accent-light text-accent",
  destructive: "bg-accent-light text-destructive",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide border border-transparent", variants[variant], className)}>
      {children}
    </span>
  );
}
