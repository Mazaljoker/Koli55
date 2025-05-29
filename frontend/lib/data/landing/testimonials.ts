import type { Testimonial } from "@/lib/types/landing";

export const testimonials: Testimonial[] = [
  {
    id: "marie-dubois",
    content:
      "AlloKoli a transformé notre service client. Nos agents peuvent maintenant se concentrer sur les cas complexes pendant que l'IA gère 80% des demandes courantes.",
    author: "Marie Dubois",
    company: "DirecteurGenerale, TechCorp",
    rating: 5,
  },
  {
    id: "jean-martin",
    content:
      "L'interface No-Code est vraiment intuitive. J'ai pu déployer notre premier assistant en 10 minutes sans aucune aide technique.",
    author: "Jean Martin",
    company: "Responsable IT, ServicePlus",
    rating: 5,
  },
  {
    id: "sophie-laurent",
    content:
      "Les analytics détaillées nous permettent d'optimiser en continu nos conversations. Le ROI a été visible dès le premier mois.",
    author: "Sophie Laurent",
    company: "Head of Customer Success, StartupFast",
    rating: 5,
  },
];

export const statistics = {
  companies: "+200 entreprises",
  satisfaction: "98% de satisfaction",
  timeReduction: "60% de réduction du temps de réponse",
  costSaving: "40% d'économies sur le support",
};
