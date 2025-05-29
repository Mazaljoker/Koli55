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

export interface SectionProps {
  id?: string;
  className?: string;
  background?: "default" | "surface" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export interface GradientCardProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "glass";
  padding?: "sm" | "md" | "lg";
  borderRadius?: "sm" | "md" | "lg" | "xl";
  popular?: boolean;
}

export interface AnimatedCardProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "scale";
  delay?: number;
  once?: boolean;
  className?: string;
}

export interface StepIndicatorProps {
  number: number;
  color: string;
  size?: "sm" | "md" | "lg";
}
