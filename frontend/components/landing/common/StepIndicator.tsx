import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  number: number;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap = {
  "primary-default": "var(--allokoli-primary-default)",
  "primary-lighter": "var(--allokoli-primary-lighter)",
  "secondary-default": "var(--allokoli-secondary-default)",
  "primary-hover": "var(--allokoli-primary-hover)",
} as const;

export const StepIndicator = ({
  number,
  color,
  size = "md",
  className,
}: StepIndicatorProps) => {
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return {
          width: "32px",
          height: "32px",
          fontSize: "14px",
        };
      case "md":
        return {
          width: "48px",
          height: "48px",
          fontSize: "18px",
        };
      case "lg":
        return {
          width: "64px",
          height: "64px",
          fontSize: "24px",
        };
      default:
        return {
          width: "48px",
          height: "48px",
          fontSize: "18px",
        };
    }
  };

  const stepColor = colorMap[color as keyof typeof colorMap] || color;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-bold",
        "border-2 transition-all duration-300",
        "hover:scale-105 hover:shadow-lg",
        className
      )}
      style={{
        ...getSizeStyle(),
        borderRadius: "var(--allokoli-radius-full)",
        background: `linear-gradient(135deg, var(--allokoli-${color}) 0%, var(--allokoli-primary-lighter) 100%)`,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        boxShadow: `0 4px 12px var(--allokoli-${color})30`,
        margin: "0 auto var(--allokoli-spacing-4)",
      }}
    >
      {number}
    </div>
  );
};
