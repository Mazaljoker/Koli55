import { Typography } from "antd";
import { AnimatedCard } from "./AnimatedCard";
import { StepIndicator } from "./StepIndicator";
import type { Step } from "@/lib/types/landing";

const { Title, Text } = Typography;

interface StepCardProps {
  step: Step;
  index: number;
  className?: string;
}

export const StepCard = ({ step, index, className }: StepCardProps) => {
  return (
    <AnimatedCard animation="slideUp" delay={index * 0.1} className={className}>
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <StepIndicator number={step.order} color={step.color} size="md" />
        </div>

        <Title
          level={4}
          className="mb-3"
          style={{
            color: "var(--allokoli-light-textPrimary)",
            marginBottom: "var(--space-md)",
          }}
        >
          {step.title}
        </Title>

        {step.description && (
          <Text
            className="block"
            style={{
              color: "var(--allokoli-light-textSecondary)",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            {step.description}
          </Text>
        )}
      </div>
    </AnimatedCard>
  );
};
