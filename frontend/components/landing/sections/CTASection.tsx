import { Typography } from "antd";
import Link from "next/link";
import {
  Section,
  AnimatedCard,
  GradientCard,
} from "@/components/landing/common";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph } = Typography;

interface CTASectionProps {
  id?: string;
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export const CTASection = ({
  id = "cta",
  className,
  title = "Prêt à transformer vos conversations clients?",
  description = "Testez AlloKoli dès aujourd'hui et découvrez comment notre solution peut booster vos performances.",
  buttonText = "Essayer Gratuitement",
  buttonHref = "/dashboard",
}: CTASectionProps) => {
  return (
    <Section
      id={id}
      background="gradient"
      padding="xl"
      className={className}
      style={{
        marginTop: "var(--allokoli-spacing-20)", // 80px
      }}
    >
      <AnimatedCard animation="scale" delay={0.2}>
        <GradientCard
          variant="glass"
          padding="lg"
          borderRadius="xl"
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--allokoli-primary-lighter)",
            boxShadow: "0 20px 40px rgba(124, 58, 237, 0.1)",
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: "var(--allokoli-spacing-6)", // 24px
              color: "var(--allokoli-light-textPrimary)",
            }}
          >
            {title}
          </Title>

          <Paragraph
            style={{
              fontSize: "18px",
              marginBottom: "var(--allokoli-spacing-10)", // 40px
              color: "var(--allokoli-light-textSecondary)",
              lineHeight: "1.6",
            }}
          >
            {description}
          </Paragraph>

          <Link href={buttonHref}>
            <Button
              variant="primary"
              size="large"
              style={{
                height: "48px",
                paddingLeft: "var(--allokoli-spacing-8)", // 32px
                paddingRight: "var(--allokoli-spacing-8)", // 32px
                background:
                  "linear-gradient(135deg, var(--allokoli-primary-default) 0%, var(--allokoli-secondary-default) 100%)",
                border: "none",
                boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
              }}
            >
              {buttonText}
            </Button>
          </Link>
        </GradientCard>
      </AnimatedCard>
    </Section>
  );
};
