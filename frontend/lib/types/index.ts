export interface Assistant {
  id: string;
  name: string;
  // ... propriétés communes
}

export interface FormStepConfig {
  title: string;
  content: React.ReactNode;
  // validation?: ValidationSchema; // Décommenter et définir ValidationSchema si nécessaire
}

// Export des types landing
export * from "./landing";
