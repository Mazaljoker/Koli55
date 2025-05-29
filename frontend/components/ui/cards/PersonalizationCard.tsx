import React from "react";
import cn from "classnames";

type PersonalizationCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode; // Pour le contenu principal (ex: un sélecteur de couleur, un input)
  variant?: "primary" | "secondary";
  isInteractive?: boolean;
  className?: string;
  // Props spécifiques : ex: onSave, onReset
};

export const PersonalizationCard: React.FC<PersonalizationCardProps> = ({
  title,
  description,
  children,
  variant = "secondary",
  isInteractive = false, // Peut-être moins pertinent ici, ou pour des éléments internes
  className = "",
}) => {
  const cardClasses = cn(
    {
      "card-primary": variant === "primary",
      "card-secondary": variant === "secondary",
      // 'card-interactive': isInteractive, // L'interactivité pourrait être sur les enfants
    },
    "p-4 md:p-6", // Padding ajusté pour ce type de carte
    className
  );

  return (
    <div className={cardClasses}>
      <h3
        className={`text-lg font-semibold mb-1 ${
          variant === "primary"
            ? "text-allokoli-primary"
            : "text-allokoli-foreground"
        }`}
      >
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-400 mb-4">{description}</p>
      )}
      <div>{children}</div>
      {/* Section pour les boutons d'action comme 'Sauvegarder' ou 'Réinitialiser' */}
    </div>
  );
};
