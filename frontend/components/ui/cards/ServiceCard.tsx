import React from "react";
import cn from "classnames"; // Vous pourriez avoir besoin d'installer classnames: pnpm add classnames

type ServiceCardProps = {
  title: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  isInteractive?: boolean;
  className?: string; // Pour des classes Tailwind supplémentaires
  // Ajoutez d'autres props spécifiques si nécessaire, ex: icon, link, etc.
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  children,
  variant = "secondary",
  isInteractive = false,
  className = "",
}) => {
  const cardClasses = cn(
    {
      "card-primary": variant === "primary",
      "card-secondary": variant === "secondary",
      "card-interactive": isInteractive,
    },
    className // Permet d'ajouter des classes Tailwind personnalisées depuis l'extérieur
  );

  return (
    <div className={cardClasses}>
      <h3
        className={`text-xl font-semibold mb-3 ${
          variant === "primary"
            ? "text-allokoli-primary"
            : "text-allokoli-foreground"
        }`}
      >
        {title}
      </h3>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  );
};
