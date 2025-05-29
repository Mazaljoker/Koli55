"use client";

import React from "react";
import { Skeleton, Card, Space } from "antd";

type LoadingSkeletonProps = {
  type?: "card" | "list" | "form" | "table";
  rows?: number;
  count?: number; // For list or card repetitions
  avatar?: boolean;
  paragraph?: boolean | { rows?: number; width?: (string | number)[] };
  title?: boolean | { width?: string | number };
  active?: boolean;
};

export const LoadingSkeleton = ({
  type = "card",
  rows = 3,
  count = 1,
  avatar = false,
  paragraph = { rows: 2 },
  title = true,
  active = true,
}: LoadingSkeletonProps) => {
  const renderSkeletonContent = () => {
    switch (type) {
      case "card":
        return (
          <Card className="glassmorphism shadow-lg rounded-xl mb-4">
            <Skeleton
              active={active}
              avatar={avatar}
              title={title}
              paragraph={paragraph}
            />
          </Card>
        );
      case "list":
        return (
          <Space direction="vertical" className="w-full">
            {[...Array(rows)].map((_, i) => (
              <Card
                key={i}
                className="glassmorphism shadow-lg rounded-xl w-full"
              >
                <Skeleton
                  active={active}
                  avatar={avatar}
                  title={title}
                  paragraph={paragraph}
                />
              </Card>
            ))}
          </Space>
        );
      case "form":
        return (
          <Card className="glassmorphism shadow-lg rounded-xl">
            <Skeleton
              active={active}
              title={{ width: "20%" }}
              paragraph={{ rows: 1, width: "40%" }}
              className="mb-4"
            />
            <Skeleton
              active={active}
              title={{ width: "20%" }}
              paragraph={{ rows: 1, width: "60%" }}
              className="mb-4"
            />
            <Skeleton
              active={active}
              title={{ width: "20%" }}
              paragraph={{ rows: 3, width: ["60%", "80%", "50%"] }}
              className="mb-4"
            />
            <Skeleton.Button
              active={active}
              size="large"
              style={{ width: 150, marginTop: 16 }}
            />
          </Card>
        );
      case "table":
        return (
          <Card className="glassmorphism shadow-lg rounded-xl">
            <Skeleton
              active={active}
              title={false}
              paragraph={{ rows: rows, width: "100%" }}
            />
          </Card>
        );
      default:
        return (
          <Skeleton
            active={active}
            avatar={avatar}
            title={title}
            paragraph={paragraph}
          />
        );
    }
  };

  if (count > 1 && (type === "card" || type === "list")) {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <React.Fragment key={i}>{renderSkeletonContent()}</React.Fragment>
        ))}
      </>
    );
  }

  return renderSkeletonContent();
};
