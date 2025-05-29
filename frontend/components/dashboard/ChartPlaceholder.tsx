"use client";

import React from "react";
import { Card, Typography } from "antd";
import { LineChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type ChartPlaceholderProps = {
  title: string;
  description?: string;
  aspectRatio?: string; // e.g., "16/9"
};

export const ChartPlaceholder = ({
  title,
  description,
  aspectRatio = "16/9",
}: ChartPlaceholderProps) => {
  return (
    <Card className="glassmorphism shadow-lg rounded-xl w-full h-full">
      <div
        className="flex flex-col items-center justify-center p-6 h-full"
        style={{ aspectRatio }}
      >
        <LineChartOutlined className="text-6xl text-allokoli-primary mb-4" />
        <Title level={4} className="!text-allokoli-text-primary text-center">
          {title}
        </Title>
        {description && (
          <Text className="text-allokoli-text-secondary text-center mt-1">
            {description}
          </Text>
        )}
        <Text className="text-allokoli-text-tertiary text-xs mt-4">
          (Graphique à implémenter)
        </Text>
      </div>
    </Card>
  );
};
