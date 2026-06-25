import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full border border-border shrink-0 relative overflow-hidden bg-surface",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
