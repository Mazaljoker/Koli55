import { Typography, Row, Col } from "antd";
import { Section } from "@/components/landing/common";
import { PricingCard } from "@/components/landing/pricing/PricingCard";
import { pricingPlans } from "@/lib/data/landing";

const { Title } = Typography;

interface PricingSectionProps {
  id?: string;
  className?: string;
}

export const PricingSection = ({
  id = "pricing",
  className,
}: PricingSectionProps) => {
  return (
    <Section id={id} background="default" padding="xl" className={className}>
      <div style={{ textAlign: "center" }}>
        <Title
          level={2}
          style={{
            marginBottom: "var(--allokoli-spacing-16)",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          Offres adaptées à vos besoins
        </Title>

        <Row gutter={[32, 32]} align="stretch">
          {pricingPlans.map((plan) => (
            <Col xs={24} md={8} key={plan.id}>
              <PricingCard plan={plan} />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  );
};
