import { Typography } from "antd";
import { GradientCard, AnimatedCard } from "@/components/landing/common";

const { Text } = Typography;

interface StatisticCardProps {
  title: string;
  subtitle: string;
  delay?: number;
  className?: string;
}

export const StatisticCard = ({
  title,
  subtitle,
  delay = 0,
  className,
}: StatisticCardProps) => {
  return (
    <AnimatedCard animation="slideUp" delay={delay} className={className}>
      <GradientCard
        variant="glass"
        padding="lg"
        borderRadius="lg"
        style={{
          background:
            "linear-gradient(135deg, var(--allokoli-primary-soft) 0%, transparent 100%)",
          border: "1px solid var(--allokoli-primary-lighter)",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "var(--allokoli-primary-default)",
            display: "block",
            marginBottom: "var(--allokoli-spacing-2)",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "var(--allokoli-light-textSecondary)",
            fontSize: "16px",
          }}
        >
          {subtitle}
        </Text>
      </GradientCard>
    </AnimatedCard>
  );
};
