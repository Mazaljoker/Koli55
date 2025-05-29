import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  padding?: "sm" | "md" | "lg";
  borderRadius?: "sm" | "md" | "lg" | "xl";
  popular?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GradientCard = ({
  children,
  variant = "glass",
  padding = "md",
  borderRadius = "lg",
  popular = false,
  className,
  style,
}: GradientCardProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          background:
            "linear-gradient(135deg, var(--allokoli-primary-soft) 0%, var(--allokoli-primary-lighter) 100%)",
          border: "1px solid var(--allokoli-primary-lighter)",
        };
      case "secondary":
        return {
          background:
            "linear-gradient(135deg, var(--allokoli-secondary-light) 0%, transparent 100%)",
          border: "1px solid var(--allokoli-secondary-lighter)",
        };
      case "glass":
        return {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        };
      default:
        return {};
    }
  };

  const getPaddingValue = () => {
    switch (padding) {
      case "sm":
        return "var(--allokoli-spacing-4)"; // 16px
      case "md":
        return "var(--allokoli-spacing-6)"; // 24px
      case "lg":
        return "var(--allokoli-spacing-8)"; // 32px
      default:
        return "var(--allokoli-spacing-6)";
    }
  };

  const getBorderRadiusValue = () => {
    switch (borderRadius) {
      case "sm":
        return "var(--allokoli-radius-sm)"; // 2px
      case "md":
        return "var(--allokoli-radius-md)"; // 6px
      case "lg":
        return "var(--allokoli-radius-lg)"; // 8px
      case "xl":
        return "var(--allokoli-radius-xl)"; // 12px
      default:
        return "var(--allokoli-radius-lg)";
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        className
      )}
      style={{
        ...getVariantStyle(),
        padding: getPaddingValue(),
        borderRadius: getBorderRadiusValue(),
        boxShadow: popular
          ? "0 8px 30px var(--allokoli-primary-lighter)"
          : "var(--allokoli-shadow-md)",
        ...style,
      }}
    >
      {popular && (
        <div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-bold text-white"
          style={{
            background: "var(--allokoli-primary-default)",
            borderRadius: "var(--allokoli-radius-xl)",
          }}
        >
          LE PLUS POPULAIRE
        </div>
      )}
      {children}
    </div>
  );
};
