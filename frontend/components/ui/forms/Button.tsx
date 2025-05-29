import React from "react";
import cn from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      children,
      className,
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      "btn",
      {
        "btn-primary": variant === "primary",
        "btn-secondary": variant === "secondary",
        "btn-outline": variant === "outline",
        "opacity-75 cursor-not-allowed": isLoading || props.disabled,
      },
      className,
      "inline-flex items-center justify-center gap-2"
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="btn-icon">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="btn-icon">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
