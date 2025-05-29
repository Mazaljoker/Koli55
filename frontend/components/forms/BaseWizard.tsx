import React from "react";

// Définir WizardProps et ValidationSchema selon les besoins
// interface ValidationSchema { /* ... */ }

export interface WizardProps<T> {
  steps: FormStepConfig[];
  onSubmit: (data: T) => void;
  initialValues?: Partial<T>;
}

// Assurez-vous que FormStepConfig est importé ou défini ici
// import { FormStepConfig } from '@/lib/types'; // Exemple d'importation
// Ou définir localement si non importé
interface FormStepConfig {
  title: string;
  content: React.ReactNode;
  // validation?: ValidationSchema;
}

export const BaseWizard = <T extends object>({
  steps,
  onSubmit,
  initialValues,
}: WizardProps<T>) => {
  // Logique commune à tous les wizards
  // Exemple de logique de base :
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Partial<T>>(
    initialValues || {}
  );

  const handleNext = (stepData: Partial<T>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(updatedData as T);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <h2>{steps[currentStep].title}</h2>
      <div>
        {
          steps[currentStep]
            .content /* Logique de rendu du contenu du pas avec passage de handleNext, etc. */
        }
      </div>
      <div>
        {currentStep > 0 && <button onClick={handlePrev}>Précédent</button>}
        {/* Le bouton Suivant/Soumettre sera probablement dans le contenu du pas pour gérer la validation spécifique au pas */}
        {/* Exemple simplifié : */}
        {currentStep < steps.length - 1 ? (
          <button onClick={() => handleNext({})}>Suivant (Simplifié)</button>
        ) : (
          <button onClick={() => onSubmit(formData as T)}>
            Soumettre (Simplifié)
          </button>
        )}
      </div>
    </div>
  );
};
