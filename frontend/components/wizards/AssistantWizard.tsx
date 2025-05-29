import React, { useState } from "react";
import cn from "classnames";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/forms/Button";
// Importer d'autres composants de formulaire si nécessaire (Select, Textarea, etc.)

// Définition des types pour les données du formulaire de l'assistant
interface AssistantFormData {
  name: string;
  description: string;
  voiceModel?: string;
  avatarUrl?: string;
  // ... autres champs pour les réponses, etc.
}

// Définition des types pour la configuration d'une étape (similaire à BaseWizard)
interface WizardStepConfig {
  id: string; // Pour la gestion des clés et potentiellement des transitions
  title: string;
  // Le contenu de l'étape sera un composant qui reçoit des props pour gérer les données et la navigation
  // content: React.ReactNode;
}

// Props pour le composant AssistantWizard
interface AssistantWizardProps {
  onSubmit: (data: AssistantFormData) => void;
  initialValues?: Partial<AssistantFormData>;
}

// Placeholder simple pour le contenu d'une étape
const StepContentPlaceholder: React.FC<{
  title: string;
  stepData: Partial<AssistantFormData>;
  onDataChange: (field: keyof AssistantFormData, value: any) => void;
}> = ({ title, stepData, onDataChange }) => (
  <div className="p-4">
    <h4 className="mb-4 text-lg">Contenu pour: {title}</h4>
    {/* Exemple de champ simple pour la démo */}
    {title === "Configuration de base" && (
      <Input
        label="Nom de l'assistant"
        value={stepData.name || ""}
        onChange={(e) => onDataChange("name", e.target.value)}
        placeholder="Ex: Assistant Commercial"
      />
    )}
    <p className="text-sm text-gray-400">
      Plus de champs et de logique de validation ici...
    </p>
  </div>
);

export const AssistantWizard: React.FC<AssistantWizardProps> = ({
  onSubmit,
  initialValues = { name: "", description: "" },
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] =
    useState<Partial<AssistantFormData>>(initialValues);
  // const [isStepValid, setIsStepValid] = useState(false); // Pour la validation en temps réel

  const steps: WizardStepConfig[] = [
    { id: "baseConfig", title: "Configuration de base" },
    { id: "voiceAvatar", title: "Voix et Avatar" },
    { id: "responses", title: "Configuration des réponses" },
    { id: "testValidate", title: "Test et Validation" },
  ];

  const handleDataChange = (field: keyof AssistantFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Ici, ajouter la logique de validation en temps réel pour l'étape actuelle
    // et mettre à jour isStepValid
  };

  const handleNext = () => {
    // Valider l'étape actuelle avant de passer à la suivante
    // if (!isStepValid) return;

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onSubmit(formData as AssistantFormData);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-2xl p-4 mx-auto md:p-6">
      {/* Indicateur d'étapes et barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    {
                      "bg-allokoli-primary border-allokoli-primary text-white":
                        index === currentStepIndex,
                      "bg-allokoli-surface border-allokoli-secondary text-allokoli-secondary":
                        index > currentStepIndex,
                      "bg-allokoli-success border-allokoli-success text-white":
                        index < currentStepIndex, // Étape complétée
                    }
                  )}
                >
                  {index < currentStepIndex ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs md:text-sm mt-1 text-center",
                    { "text-allokoli-primary": index === currentStepIndex },
                    { "text-gray-400": index !== currentStepIndex }
                  )}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-1 sm:mx-2 md:mx-4",
                    { "bg-allokoli-primary": index < currentStepIndex },
                    { "bg-allokoli-surface": index >= currentStepIndex }
                  )}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Barre de progression */}
        <div className="w-full bg-allokoli-surface rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-allokoli-secondary to-allokoli-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Carte de l'étape actuelle */}
      <div className="card-secondary p-6 md:p-8 min-h-[300px]">
        {/* Ici, nous afficherions le contenu dynamique de l'étape */}
        {/* Pour l'instant, un placeholder */}
        <StepContentPlaceholder
          title={steps[currentStepIndex].title}
          stepData={formData}
          onDataChange={handleDataChange}
        />
        {/* TODO: Ajouter la logique de transition entre étapes (ex: slide effect) */}
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-between sm:items-center">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={cn("w-full sm:w-auto", {
            invisible: currentStepIndex === 0,
          })}
        >
          Précédent
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          className="w-full sm:w-auto"
          // disabled={!isStepValid} // Activer quand la validation est prête
        >
          {currentStepIndex === steps.length - 1
            ? "Terminer et Valider"
            : "Suivant"}
        </Button>
      </div>
    </div>
  );
};
