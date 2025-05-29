"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asyncAction?: () => Promise<void>;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  variant: {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:border-gray-200 disabled:text-gray-400",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
  },
  size: {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading: externalLoading = false,
      asyncAction,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isLoading = externalLoading;
    const isDisabled = disabled || isLoading;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (asyncAction) {
        await asyncAction();
      } else if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {leftIcon && !isLoading && (
          <span className="flex-shrink-0 mr-2">{leftIcon}</span>
        )}

        {isLoading && (
          <Loader2 className="flex-shrink-0 w-4 h-4 mr-2 animate-spin" />
        )}

        <span className="truncate">
          {isLoading && loadingText ? loadingText : children}
        </span>

        {rightIcon && !isLoading && (
          <span className="flex-shrink-0 ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
