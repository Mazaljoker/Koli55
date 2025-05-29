import React from "react";
import cn from "classnames";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  success?: string | boolean;
  // containerClassName pour styliser le div parent si besoin
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, name, error, success, className, containerClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("mb-4", containerClassName)}>
        {label && (
          <label
            htmlFor={name || props.id}
            className="block text-sm font-medium text-gray-200 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          name={name}
          className={cn(
            "form-input",
            {
              "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.4)]":
                error,
              "border-green-500/80 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.4)]":
                success && !error,
            },
            className
          )}
          {...props}
        />
        {/* Les messages d'erreur/succès peuvent être gérés par le composant FormMessage ci-dessous */}
      </div>
    );
  }
);

Input.displayName = "Input";
