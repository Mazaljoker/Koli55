import { Collapse, Typography } from "antd";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "@/lib/types/landing";

const { Text, Paragraph } = Typography;

interface FAQCollapseProps {
  items: FAQItem[];
  className?: string;
}

export const FAQCollapse = ({ items, className }: FAQCollapseProps) => {
  const collapseItems = items.map((item) => ({
    key: item.id,
    label: (
      <Text
        strong
        style={{
          fontSize: "18px",
          color: "var(--allokoli-light-textPrimary)",
        }}
      >
        {item.question}
      </Text>
    ),
    children: (
      <Paragraph
        style={{
          color: "var(--allokoli-light-textSecondary)",
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: 0,
        }}
      >
        {item.answer}
      </Paragraph>
    ),
  }));

  return (
    <Collapse
      className={className}
      bordered={false}
      expandIcon={({ isActive }) =>
        isActive ? (
          <Minus
            style={{
              color: "var(--allokoli-primary-default)",
              width: "20px",
              height: "20px",
            }}
          />
        ) : (
          <Plus
            style={{
              color: "var(--allokoli-primary-default)",
              width: "20px",
              height: "20px",
            }}
          />
        )
      }
      style={{ background: "transparent" }}
      items={collapseItems}
    />
  );
};
