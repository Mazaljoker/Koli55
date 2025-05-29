"use client";

import React from "react";
import { Empty as AntEmpty, Typography, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph } = Typography;

type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  height?: string | number;
};

export const EmptyState = ({
  icon = <InboxOutlined />,
  title = "Rien à afficher pour le moment",
  description,
  actionText,
  onActionClick,
  height = "300px",
}: EmptyStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 border border-gray-300 border-dashed rounded-lg bg-allokoli-body-background dark:border-gray-700"
      style={{ minHeight: height }}
    >
      <AntEmpty
        image={icon}
        imageStyle={{
          fontSize: "48px",
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        description={
          <Space direction="vertical" align="center">
            <Title level={4} className="!text-allokoli-text-secondary !mb-1">
              {title}
            </Title>
            <Paragraph className="!text-allokoli-text-tertiary text-center max-w-xs">
              {description}
            </Paragraph>
          </Space>
        }
      >
        {actionText && onActionClick && (
          <Button variant="primary" onClick={onActionClick} size="large">
            {actionText}
          </Button>
        )}
      </AntEmpty>
    </div>
  );
};
