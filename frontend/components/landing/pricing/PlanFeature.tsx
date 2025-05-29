import { Typography } from "antd";
import { Check } from "lucide-react";

const { Text } = Typography;

interface PlanFeatureProps {
  feature: string;
  className?: string;
}

export const PlanFeature = ({ feature, className }: PlanFeatureProps) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "var(--allokoli-spacing-2)",
      }}
    >
      <Check
        style={{
          color: "var(--allokoli-primary-default)",
          width: "16px",
          height: "16px",
          marginRight: "var(--allokoli-spacing-2)",
          flexShrink: 0,
        }}
      />
      <Text
        style={{
          color: "var(--allokoli-light-textSecondary)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {feature}
      </Text>
    </div>
  );
};
