// Exporter les composants UI réutilisables

// Effets 3D avec framer-motion
export {
  TiltCard,
  FloatingElement,
  ParallaxContainer,
  RotatingBadge,
  AnimatedBackground,
  AppearingElement,
  addMotionStyles,
} from "./3d-effects";

// Core UI Components - AlloKoli Design System
export { Button } from "./Button";
export type { ButtonProps } from "./Button";

// Autres composants UI pourront être ajoutés ici au fur et à mesure
// Exemple: export { Card, Input } from './base-components';

// Multi-step form component
export { default as MultiStepForm } from "./multi-step-form";

// Error boundaries and feedback
export { default as ErrorBoundary } from "./ErrorBoundary";

// Form components
export { default as VapiFormBuilder } from "./vapi-form-builder";
export { default as VapiKnowledgeBaseForm } from "./vapi-knowledge-base-form";

// Status components
export { SupabaseStatus } from "./supabase-status";
