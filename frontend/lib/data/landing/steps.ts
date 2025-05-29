import type { Step } from "@/lib/types/landing";

export const howItWorksSteps: Step[] = [
  {
    id: "create",
    title: "Créez votre agent",
    description:
      "Configurez votre assistant IA en quelques clics avec notre interface intuitive",
    color: "primary-default",
    order: 1,
  },
  {
    id: "configure",
    title: "Configurez vos scénarios",
    description:
      "Définissez les conversations et comportements selon vos besoins métier",
    color: "primary-lighter",
    order: 2,
  },
  {
    id: "deploy",
    title: "Déployez",
    description:
      "Intégrez votre assistant en un clic sur vos canaux de communication",
    color: "secondary-default",
    order: 3,
  },
  {
    id: "analyze",
    title: "Analysez et ajustez",
    description:
      "Suivez les performances et optimisez en continu avec nos analytics",
    color: "primary-hover",
    order: 4,
  },
];
