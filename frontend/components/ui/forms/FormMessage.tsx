import React from "react";
import cn from "classnames";

export interface FormMessageProps {
  message?: string;
  type: "error" | "success";
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({
  message,
  type,
  className,
}) => {
  if (!message) return null;

  const messageClasses = cn(
    "form-message",
    {
      "form-message-error": type === "error",
      "form-message-success": type === "success",
    },
    className
  );

  return (
    <div
      className={messageClasses}
      {...(type === "error" && { role: "alert" })}
    >
      {message}
    </div>
  );
};
