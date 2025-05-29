import React from "react";
import cn from "classnames";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string | boolean;
  success?: string | boolean;
  containerClassName?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      name,
      options,
      error,
      success,
      className,
      containerClassName,
      placeholder,
      ...props
    },
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
        <div className="relative">
          <select
            ref={ref}
            name={name}
            className={cn(
              "form-select",
              {
                "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.4)]":
                  error,
                "border-green-500/80 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.4)]":
                  success && !error,
                "text-gray-400": !props.value && placeholder,
              },
              className
            )}
            defaultValue={
              props.value === undefined && placeholder ? "" : props.defaultValue
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden={props.value !== undefined}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* L'icône de flèche est gérée par CSS dans .form-select */}
        </div>
        {/* Les messages d'erreur/succès peuvent être gérés par le composant FormMessage */}
      </div>
    );
  }
);

Select.displayName = "Select";
