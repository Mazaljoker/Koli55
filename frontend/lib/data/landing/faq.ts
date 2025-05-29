import type { FAQItem } from "@/lib/types/landing";

export const faqItems: FAQItem[] = [
  {
    id: "deployment-time",
    question: "Combien de temps pour déployer un assistant ?",
    answer:
      "Moins de 5 minutes : tout se fait en ligne, sans installation ni compétences techniques requises.",
    category: "deployment",
  },
  {
    id: "coding-skills",
    question: "Dois-je savoir coder ?",
    answer:
      "Absolument pas. Notre interface No Code a été conçue pour les non-techniciens. Vous pouvez créer et configurer votre assistant entièrement via l'interface graphique.",
    category: "technical",
  },
  {
    id: "integrations",
    question: "Quelles intégrations sont disponibles ?",
    answer:
      "AlloKoli s'intègre avec les principales plateformes : téléphonie, chat web, WhatsApp, Messenger, Slack, Teams, CRM, et bien d'autres via notre API.",
    category: "integrations",
  },
  {
    id: "pricing-model",
    question: "Comment fonctionne la tarification ?",
    answer:
      "Nos prix sont basés sur le nombre d'assistants et de conversations mensuelles. Pas de frais cachés, pas d'engagement minimum.",
    category: "pricing",
  },
  {
    id: "data-security",
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui, nous utilisons un chiffrement de niveau bancaire et sommes conformes RGPD. Vos données restent en Europe et ne sont jamais partagées.",
    category: "security",
  },
  {
    id: "support",
    question: "Quel support proposez-vous ?",
    answer:
      "Support par email pour tous les plans, support prioritaire pour Business, et support dédié 24/7 pour Enterprise. Formation et consulting inclus selon les plans.",
    category: "support",
  },
];
