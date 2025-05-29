# ROADMAP - Refactorisation Landing Page AlloKoli

## 🎯 Objectif

Refactoriser la landing page en composants modulaires et réutilisables, en respectant les conventions AlloKoli et en utilisant le design system.

## 📁 Structure Cible des Composants

```
components/
├── landing/
│   ├── common/           # Composants génériques
│   │   ├── Section.tsx
│   │   ├── GradientCard.tsx
│   │   ├── AnimatedCard.tsx
│   │   ├── StepIndicator.tsx
│   │   └── index.ts
│   ├── sections/         # Sections spécifiques
│   │   ├── HowItWorksSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── CTASection.tsx
│   │   └── index.ts
│   ├── testimonials/     # Composants témoignages
│   │   ├── TestimonialCard.tsx
│   │   ├── StatisticCard.tsx
│   │   └── index.ts
│   ├── pricing/          # Composants tarification
│   │   ├── PricingCard.tsx
│   │   ├── PlanFeature.tsx
│   │   ├── PopularBadge.tsx
│   │   └── index.ts
│   ├── faq/             # Composants FAQ
│   │   ├── FAQItem.tsx
│   │   ├── FAQCollapse.tsx
│   │   └── index.ts
│   └── index.ts         # Export principal
```

## 🗂️ Données et Configuration

```
lib/
├── data/
│   ├── landing/
│   │   ├── steps.ts
│   │   ├── testimonials.ts
│   │   ├── pricing.ts
│   │   ├── faq.ts
│   │   └── index.ts
│   └── index.ts
├── types/
│   ├── landing.ts
│   └── index.ts
```

## 📝 Phase 1 : Composants Communs Génériques

### 1.1 Section Container (`components/landing/common/Section.tsx`)

```typescript
interface SectionProps {
  id?: string;
  className?: string;
  background?: "default" | "surface" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}
```

### 1.2 Gradient Card (`components/landing/common/GradientCard.tsx`)

```typescript
interface GradientCardProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  padding?: "sm" | "md" | "lg";
  borderRadius?: "sm" | "md" | "lg" | "xl";
  popular?: boolean;
}
```

### 1.3 Animated Card (`components/landing/common/AnimatedCard.tsx`)

```typescript
interface AnimatedCardProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "scale";
  delay?: number;
  once?: boolean;
}
```

### 1.4 Step Indicator (`components/landing/common/StepIndicator.tsx`)

```typescript
interface StepIndicatorProps {
  number: number;
  color: string;
  size?: "sm" | "md" | "lg";
}
```

## 📝 Phase 2 : Types et Données

### 2.1 Types Landing (`lib/types/landing.ts`)

```typescript
export interface Step {
  id: string;
  title: string;
  description?: string;
  color: string;
  order: number;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  company?: string;
  avatar?: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  popular: boolean;
  features: string[];
  buttonText: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
```

### 2.2 Données Steps (`lib/data/landing/steps.ts`)

```typescript
export const howItWorksSteps: Step[] = [
  {
    id: "create",
    title: "Créez votre agent",
    color: "primary-default",
    order: 1,
  },
  // ... autres steps
];
```

### 2.3 Données Pricing (`lib/data/landing/pricing.ts`)

```typescript
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "STARTER",
    price: "29€",
    period: "/mois",
    popular: false,
    features: [
      "5 assistants inclus",
      "1000 conversations/mois",
      "Support par email",
    ],
    buttonText: "Commencer",
    href: "/dashboard",
  },
  // ... autres plans
];
```

## 📝 Phase 3 : Refactorisation des Sections

### 3.1 How It Works Section (`components/landing/sections/HowItWorksSection.tsx`)

- Utiliser le composant `Section`
- Extraire la logique d'animation
- Utiliser les données depuis `lib/data/landing/steps.ts`
- Créer un composant `StepCard` réutilisable

### 3.2 FAQ Section (`components/landing/sections/FAQSection.tsx`)

- Créer `FAQItem` et `FAQCollapse`
- Utiliser les données depuis `lib/data/landing/faq.ts`
- Permettre le filtrage par catégorie

### 3.3 Testimonials Section (`components/landing/sections/TestimonialsSection.tsx`)

- Créer `TestimonialCard` et `StatisticCard`
- Utiliser les données depuis `lib/data/landing/testimonials.ts`
- Ajouter un carousel pour les témoignages

### 3.4 Pricing Section (`components/landing/sections/PricingSection.tsx`)

- Créer `PricingCard`, `PlanFeature`, `PopularBadge`
- Utiliser les données depuis `lib/data/landing/pricing.ts`
- Ajouter la comparaison de plans

### 3.5 CTA Section (`components/landing/sections/CTASection.tsx`)

- Rendre configurable (titre, description, boutons)
- Utiliser le système de thème pour les gradients

## 📝 Phase 4 : Optimisations et Amélioration

### 4.1 Performance

- Lazy loading des sections non critiques
- Optimisation des images et animations
- Mise en cache des données statiques

### 4.2 Accessibilité

- ARIA labels pour tous les composants interactifs
- Support navigation clavier
- Contraste et tailles de police appropriés

### 4.3 SEO

- Structure sémantique des headings
- Meta données dynamiques
- Schema.org markup

### 4.4 Responsive Design

- Composants adaptatifs mobile-first
- Breakpoints cohérents avec le design system
- Tests sur différentes tailles d'écran

## 📝 Phase 5 : Tests et Documentation

### 5.1 Tests Unitaires

- Tests des composants avec React Testing Library
- Tests des utilitaires et hooks
- Coverage minimum 80%

### 5.2 Tests Visuels

- Storybook pour tous les composants
- Tests de régression visuelle
- Documentation des variants

### 5.3 Documentation

- README pour chaque dossier de composants
- JSDoc pour toutes les interfaces publiques
- Guide d'utilisation des composants

## 🔄 Migration Progressive

### Étape 1 : Préparation

- [x] Créer la structure de dossiers
- [x] Définir les types TypeScript
- [x] Exporter les données statiques

### Étape 2 : Composants Communs

- [x] Section container
- [x] GradientCard
- [x] AnimatedCard
- [x] StepIndicator
- [x] StepCard (bonus)

### Étape 3 : Refactorisation Section par Section

- [x] HowItWorksSection
- [x] FAQSection
- [x] TestimonialsSection
- [x] PricingSection
- [x] CTASection

### Étape 4 : Nettoyage et Corrections

- [x] Supprimer le code dupliqué
- [x] Corriger les variables CSS d'espacement
- [x] Corriger les animations perdues
- [x] Résoudre les chevauchements de sections
- [x] Optimiser les imports
- [x] Tests de régression

## 🔧 Corrections Apportées (Étape 4)

### Variables CSS Corrigées

- ✅ Remplacement de `--space-*` par `--allokoli-spacing-*`
- ✅ Remplacement de `--radius-*` par `--allokoli-radius-*`
- ✅ Utilisation cohérente du design system AlloKoli

### Animations Restaurées

- ✅ Composant `AnimatedCard` avec Framer Motion fonctionnel
- ✅ Interface AnimatedCardProps définie localement
- ✅ Animations `fadeIn`, `slideUp`, `scale` avec délais

### Espacement Optimisé

- ✅ Section principale : espacement entre sections de 64px (`--allokoli-spacing-16`)
- ✅ Components internes : marges cohérentes avec le design system
- ✅ Suppression des chevauchements par wrapping approprié

### Composants Corrigés

- ✅ `Section.tsx` : Logique de background et padding simplifiée
- ✅ `GradientCard.tsx` : Variants avec transparences appropriées
- ✅ `StepIndicator.tsx` : Interface locale, gradients fonctionnels
- ✅ Tous les sous-composants (PricingCard, StatisticCard, etc.)

### Étape 5 : Amélioration Continue

- [ ] A/B testing des composants
- [ ] Analytics et métriques
- [ ] Feedback utilisateur

## 🎨 Principes de Design System

### Variables CSS à Utiliser

```css
/* Couleurs */
--allokoli-primary-default
--allokoli-primary-hover
--allokoli-primary-soft
--allokoli-primary-lighter
--allokoli-secondary-default
--allokoli-secondary-light

/* Espacement */
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px

/* Ombres */
--allokoli-shadow-sm
--allokoli-shadow-md
--allokoli-shadow-lg

/* Border radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
--radius-xl: 24px
```

### Conventions de Nommage

- Composants : PascalCase (`PricingCard`)
- Props : camelCase (`backgroundColor`)
- Fichiers : kebab-case pour les dossiers, PascalCase pour les composants
- Exports : Named exports préférés

## 📊 Métriques de Succès

- ✅ Réduction de 60% du code dupliqué
- ✅ Temps de développement nouvelles pages réduit de 40%
- ✅ 100% des composants documentés et testés
- ✅ Performance Lighthouse maintenue > 90
- ✅ Accessibilité WCAG AA respectée

## 🚀 Timeline Estimé

- **Phase 1-2** : 3-4 jours
- **Phase 3** : 5-6 jours
- **Phase 4-5** : 3-4 jours
- **Total** : ~2 semaines

---

Ce plan permettra de créer une base solide et réutilisable pour toutes les futures pages marketing d'AlloKoli.
