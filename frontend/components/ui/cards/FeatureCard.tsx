import React from "react";
import cn from "classnames";

export type FeatureCardProps = {
  icon: React.ReactElement;
  title: string;
  description: string;
  className?: string;
  // La variante pourrait être fixée à 'secondary' ou omise si les FeatureCards sont toujours neutres
  // isInteractive est true par défaut pour les FeatureCards de la landing page
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = "",
}) => {
  const cardClasses = cn(
    "card-secondary", // Base pour FeatureCard, aspect neutre
    "card-interactive", // Toujours interactif par défaut
    "flex flex-col items-center text-center", // Styles spécifiques à la FeatureCard
    "p-6 md:p-8", // Padding spécifique, peut différer de card-base
    className
  );

  return (
    <div className={cardClasses}>
      <div className="text-allokoli-primary mb-4 text-4xl md:text-5xl">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-allokoli-foreground">
        {title}
      </h3>
      <p className="text-gray-300 text-sm md:text-base">{description}</p>
    </div>
  );
};
