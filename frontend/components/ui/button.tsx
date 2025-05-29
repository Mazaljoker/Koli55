"use client";

import * as React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { clsx } from "clsx";

export interface ButtonProps
  extends Omit<AntButtonProps, "type" | "size" | "loading"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // Map our variants to Ant Design types
    const getAntType = (): AntButtonProps["type"] => {
      switch (variant) {
        case "primary":
          return "primary";
        case "secondary":
          return "default";
        case "outline":
          return "default";
        case "ghost":
          return "text";
        default:
          return "primary";
      }
    };

    // Map our sizes to Ant Design sizes
    const getAntSize = (): AntButtonProps["size"] => {
      switch (size) {
        case "sm":
          return "small";
        case "md":
          return "middle";
        case "lg":
          return "large";
        default:
          return "middle";
      }
    };

    // Custom CSS classes using Tailwind + CSS variables
    const buttonClasses = clsx(
      // Base styles
      "transition-all duration-200 font-medium inline-flex items-center justify-center gap-2",

      // Variant styles using CSS variables
      {
        // Primary variant
        "bg-[var(--allokoli-primary)] hover:bg-[var(--allokoli-primary)]/90 border-[var(--allokoli-primary)] text-white":
          variant === "primary",

        // Secondary variant
        "bg-[var(--allokoli-secondary)] hover:bg-[var(--allokoli-secondary)]/90 border-[var(--allokoli-secondary)] text-white":
          variant === "secondary",

        // Outline variant
        "bg-transparent hover:bg-[var(--allokoli-primary)]/10 border-[var(--allokoli-primary)] text-[var(--allokoli-primary)]":
          variant === "outline",

        // Ghost variant
        "bg-transparent hover:bg-[var(--allokoli-primary)]/10 border-transparent text-[var(--allokoli-primary)]":
          variant === "ghost",
      },

      // Size styles
      {
        "h-8 px-3 text-sm": size === "sm",
        "h-10 px-4 text-base": size === "md",
        "h-12 px-6 text-lg": size === "lg",
      },

      // Full width
      {
        "w-full": fullWidth,
      },

      // Loading state
      {
        "opacity-75 cursor-not-allowed": isLoading,
      },

      className
    );

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className={clsx("animate-spin", {
          "h-3 w-3": size === "sm",
          "h-4 w-4": size === "md",
          "h-5 w-5": size === "lg",
        })}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <AntButton
        ref={ref}
        type={getAntType()}
        size={getAntSize()}
        loading={false} // We handle loading ourselves
        className={buttonClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </AntButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
