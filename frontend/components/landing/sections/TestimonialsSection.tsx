import { Typography, Row, Col } from "antd";
import { Section } from "@/components/landing/common";
import { StatisticCard } from "@/components/landing/testimonials/StatisticCard";
import { statistics } from "@/lib/data/landing";

const { Title } = Typography;

interface TestimonialsSectionProps {
  id?: string;
  className?: string;
}

export const TestimonialsSection = ({
  id = "testimonials",
  className,
}: TestimonialsSectionProps) => {
  // Convertir l'objet statistics en array pour le mapping
  const statisticsArray = [
    { title: statistics.companies, subtitle: "utilisent déjà AlloKoli" },
    { title: statistics.satisfaction, subtitle: "de clients satisfaits" },
    { title: statistics.timeReduction, subtitle: "du temps de réponse" },
    { title: statistics.costSaving, subtitle: "d'économies support" },
  ];

  return (
    <Section id={id} background="surface" padding="xl" className={className}>
      <div style={{ textAlign: "center" }}>
        <Title
          level={2}
          style={{
            marginBottom: "var(--allokoli-spacing-8)",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          Ils nous font confiance
        </Title>

        <Row gutter={[24, 24]} justify="center">
          {statisticsArray.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <StatisticCard
                title={stat.title}
                subtitle={stat.subtitle}
                delay={index * 0.1}
              />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  );
};
