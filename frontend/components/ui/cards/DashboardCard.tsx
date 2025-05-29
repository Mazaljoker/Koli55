import React from "react";
import cn from "classnames";

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  isInteractive?: boolean;
  className?: string;
  // Props spécifiques au dashboard : icon, statistic, linkToDetails, etc.
  icon?: React.ReactElement;
  statistic?: string | number;
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  variant = "secondary",
  isInteractive = false,
  className = "",
  icon,
  statistic,
}) => {
  const cardClasses = cn(
    {
      "card-primary": variant === "primary",
      "card-secondary": variant === "secondary",
      "card-interactive": isInteractive,
    },
    className
  );

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`text-lg font-semibold ${
            variant === "primary"
              ? "text-allokoli-primary"
              : "text-allokoli-foreground"
          }`}
        >
          {title}
        </h3>
        {icon && <div className="text-2xl text-allokoli-secondary">{icon}</div>}
      </div>
      {statistic && (
        <div className="text-3xl font-bold text-allokoli-foreground mb-2">
          {statistic}
        </div>
      )}
      <div className="text-sm text-gray-300">{children}</div>
      {/* Vous pouvez ajouter un pied de carte ici avec des actions ou des liens */}
    </div>
  );
};
