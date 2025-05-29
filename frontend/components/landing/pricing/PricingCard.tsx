import { Typography } from "antd";
import Link from "next/link";
import { GradientCard } from "@/components/landing/common";
import { PopularBadge } from "./PopularBadge";
import { PlanFeature } from "./PlanFeature";
import { Button } from "@/components/ui/Button";
import type { PricingPlan } from "@/lib/types/landing";

const { Title, Text } = Typography;

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export const PricingCard = ({ plan, className }: PricingCardProps) => {
  return (
    <GradientCard
      variant="glass"
      padding="lg"
      borderRadius="lg"
      popular={plan.popular}
      className={className}
      style={{
        height: "100%",
        border: plan.popular
          ? "2px solid var(--allokoli-primary-default)"
          : "1px solid rgba(255, 255, 255, 0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {plan.popular && <PopularBadge />}

      {/* Header du plan */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--allokoli-spacing-6)",
        }}
      >
        <Text
          style={{
            color: "var(--allokoli-primary-default)",
            fontWeight: "bold",
            fontSize: "14px",
            display: "block",
            marginBottom: "var(--allokoli-spacing-2)",
          }}
        >
          {plan.name}
        </Text>

        <Title
          level={2}
          style={{
            marginTop: "var(--allokoli-spacing-2)",
            marginBottom: "var(--allokoli-spacing-1)",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          {plan.price}
        </Title>

        {plan.period && (
          <Text
            style={{
              color: "var(--allokoli-light-textSecondary)",
              fontSize: "14px",
            }}
          >
            {plan.period}
          </Text>
        )}
      </div>

      {/* Features */}
      <div style={{ flex: 1, marginBottom: "var(--allokoli-spacing-6)" }}>
        {plan.features.map((feature, index) => (
          <PlanFeature key={index} feature={feature} />
        ))}
      </div>

      {/* CTA Button */}
      <Link href={plan.href}>
        <Button
          variant={plan.popular ? "primary" : "secondary"}
          block
          style={{ height: "44px" }}
        >
          {plan.buttonText}
        </Button>
      </Link>
    </GradientCard>
  );
};
