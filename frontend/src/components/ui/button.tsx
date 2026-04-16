import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-accent text-accent-foreground hover:bg-accent/90",
          variant === "outline" &&
            "border border-border bg-transparent hover:bg-surface text-foreground",
          variant === "ghost" && "hover:bg-surface text-foreground",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4 text-sm",
          size === "lg" && "h-12 px-6 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
