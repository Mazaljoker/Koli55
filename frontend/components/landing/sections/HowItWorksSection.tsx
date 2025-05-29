import { Typography, Row, Col } from "antd";
import { Section, StepCard } from "@/components/landing/common";
import { howItWorksSteps } from "@/lib/data/landing";

const { Title } = Typography;

interface HowItWorksSectionProps {
  id?: string;
  className?: string;
}

export const HowItWorksSection = ({
  id = "how-it-works",
  className,
}: HowItWorksSectionProps) => {
  return (
    <Section id={id} background="surface" padding="xl" className={className}>
      <div style={{ textAlign: "center" }}>
        <Title
          level={2}
          style={{
            marginBottom: "var(--allokoli-spacing-16)",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          Comment ça marche ?
        </Title>

        <Row gutter={[32, 48]}>
          {howItWorksSteps.map((step, index) => (
            <Col xs={24} md={12} lg={6} key={step.id}>
              <StepCard step={step} index={index} />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  );
};
