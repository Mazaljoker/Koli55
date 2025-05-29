"use client";

import React from "react";
import { Card, Typography, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

type MetricCardProps = {
  title: string;
  value: string;
  percentageChange?: number;
  icon: React.ReactNode;
  bgColorClass?: string; // e.g., 'from-blue-500 to-blue-700'
  textColorClass?: string; // e.g., 'text-white'
};

export const MetricCard = ({
  title,
  value,
  percentageChange,
  icon,
  bgColorClass = "bg-gradient-to-br from-allokoli-primary via-allokoli-secondary to-allokoli-accent",
  textColorClass = "text-white",
}: MetricCardProps) => {
  const changeColor =
    percentageChange === undefined
      ? "text-gray-500"
      : percentageChange >= 0
      ? "text-green-500"
      : "text-red-500";

  return (
    <Card
      className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
      variant="borderless"
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Space className="flex items-start justify-between w-full">
          <Text className={`!font-semibold ${textColorClass}`}>{title}</Text>
          <div className="text-2xl">{icon}</div>
        </Space>
        <Title level={2} className={`!m-0 ${textColorClass}`}>
          {value}
        </Title>
        {percentageChange !== undefined && (
          <Space>
            {percentageChange >= 0 ? (
              <ArrowUpOutlined className={changeColor} />
            ) : (
              <ArrowDownOutlined className={changeColor} />
            )}
            <Text className={`${changeColor} !font-semibold`}>
              {Math.abs(percentageChange)}%
            </Text>
            <Text className={`!text-xs ${textColorClass} opacity-80`}>
              depuis le mois dernier
            </Text>
          </Space>
        )}
      </Space>
    </Card>
  );
};
