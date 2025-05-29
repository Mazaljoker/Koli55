import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  background?: "default" | "surface" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  style?: React.CSSProperties;
}

const sectionBackgrounds = {
  default: "var(--allokoli-light-background)",
  surface: "var(--allokoli-light-surface)",
  gradient:
    "linear-gradient(135deg, var(--allokoli-primary-soft) 0%, var(--allokoli-secondary-light) 100%)",
} as const;

const sectionPadding = {
  sm: "var(--allokoli-spacing-8) var(--allokoli-spacing-6)", // 32px
  md: "var(--allokoli-spacing-12) var(--allokoli-spacing-6)", // 48px
  lg: "var(--allokoli-spacing-16) var(--allokoli-spacing-6)", // 64px
  xl: "var(--allokoli-spacing-20) var(--allokoli-spacing-6)", // 80px
} as const;

export const Section = ({
  id,
  className,
  background = "default",
  padding = "lg",
  children,
  style,
}: SectionProps) => {
  const getBackgroundStyle = () => {
    switch (background) {
      case "surface":
        return { background: "var(--allokoli-light-surface)" };
      case "gradient":
        return {
          background:
            "linear-gradient(135deg, var(--allokoli-primary-soft) 0%, var(--allokoli-secondary-light) 100%)",
        };
      default:
        return { background: "var(--allokoli-light-background)" };
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case "sm":
        return {
          padding: "var(--allokoli-spacing-8) var(--allokoli-spacing-6)",
        }; // 32px
      case "md":
        return {
          padding: "var(--allokoli-spacing-12) var(--allokoli-spacing-6)",
        }; // 48px
      case "lg":
        return {
          padding: "var(--allokoli-spacing-16) var(--allokoli-spacing-6)",
        }; // 64px
      case "xl":
        return {
          padding: "var(--allokoli-spacing-20) var(--allokoli-spacing-6)",
        }; // 80px
      default:
        return {
          padding: "var(--allokoli-spacing-16) var(--allokoli-spacing-6)",
        };
    }
  };

  return (
    <section
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...getBackgroundStyle(),
        ...getPaddingStyle(),
        maxWidth: "1200px",
        margin: "0 auto",
        padding: `${
          getPaddingStyle().padding.split(" ")[0]
        } var(--allokoli-spacing-6)`,
        ...style,
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1280px" }}>
        {children}
      </div>
    </section>
  );
};
