import { Typography } from "antd";
import { Section } from "@/components/landing/common";
import { FAQCollapse } from "@/components/landing/faq/FAQCollapse";
import { faqItems } from "@/lib/data/landing";

const { Title } = Typography;

interface FAQSectionProps {
  id?: string;
  className?: string;
}

export const FAQSection = ({ id = "faq", className }: FAQSectionProps) => {
  return (
    <Section id={id} background="default" padding="xl" className={className}>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: "var(--allokoli-spacing-16)",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          Questions fréquentes
        </Title>

        <FAQCollapse items={faqItems} />
      </div>
    </Section>
  );
};
