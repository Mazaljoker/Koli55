/**
 * Design System Tokens - AlloKoli
 * Tokens centralisés pour maintenir la cohérence du design
 */

// Couleurs principales
export const colors = {
  // Couleurs de marque
  primary: {
    default: "#7C3AED", // allokoli-primary
    hover: "#7745FF",
    active: "#6D28D9",
    light: "#A78BFA", // allokoli-secondary
    lighter: "#9CB8FF",
  },

  secondary: {
    default: "#A78BFA", // allokoli-secondary
    hover: "#8B5CF6",
    active: "#7C3AED",
  },

  accent: {
    default: "#F59E0B", // allokoli-accent
    hover: "#E59E0B",
    active: "#D59E0B",
  },

  // Couleurs sémantiques
  success: {
    default: "#10B981", // allokoli-success
    hover: "#059669",
    active: "#047857",
    light: "#A7F3D0",
    bg: "#ECFDF5",
  },

  warning: {
    default: "#F59E0B",
    hover: "#D97706",
    active: "#B45309",
    light: "#FDE68A",
    bg: "#FFFBEB",
  },

  error: {
    default: "#EF4444", // allokoli-error
    hover: "#DC2626",
    active: "#B91C1C",
    light: "#FCA5A5",
    bg: "#FEF2F2",
  },

  info: {
    default: "#3B82F6",
    hover: "#2563EB",
    active: "#1D4ED8",
    light: "#93C5FD",
    bg: "#EFF6FF",
  },

  // Couleurs neutres
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Couleurs spécifiques au thème clair
  light: {
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceHover: "#F1F5F9",
    textPrimary: "#1E293B",
    textSecondary: "#64748B",
    textTertiary: "#94A3B8",
    border: "#E2E8F0",
    borderSecondary: "#F1F5F9",
  },

  // Couleurs d'avatar
  avatar: {
    orange: "#F59E0B",
    green: "#10B981",
    blue: "#3B82F6",
    gray: "#9CA3AF",
    purple: "#8B5CF6",
  },

  // Couleurs pures (utilitaires)
  pure: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
  },

  // Couleurs de progression/status
  status: {
    pending: "#F59E0B",
    processing: "#3B82F6",
    completed: "#10B981",
    failed: "#EF4444",
  },
} as const;

// Espacement
export const spacing = {
  // Espacement de base (multiples de 4px)
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px",

  // Espacement sémantique
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",

  // Espacement de composants spécifiques
  component: {
    paddingSmall: "8px",
    paddingMedium: "16px",
    paddingLarge: "24px",
    marginSmall: "8px",
    marginMedium: "16px",
    marginLarge: "24px",
    gapSmall: "8px",
    gapMedium: "16px",
    gapLarge: "24px",
  },
} as const;

// Rayons de bordure
export const radius = {
  // Rayons de base
  none: "0px",
  sm: "2px",
  default: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  xxl: "16px",
  full: "9999px",

  // Rayons sémantiques
  button: "6px",
  card: "8px",
  input: "6px",
  modal: "12px",
  avatar: "9999px",

  // Rayons de composants spécifiques
  component: {
    small: "4px",
    medium: "8px",
    large: "12px",
    round: "9999px",
  },
} as const;

// Opacité
export const opacity = {
  0: "0",
  5: "0.05",
  10: "0.1",
  20: "0.2",
  25: "0.25",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  75: "0.75",
  80: "0.8",
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

// Ombres
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  xxl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",

  // Ombres colorées
  primary: "0 4px 14px 0 rgb(124 58 237 / 0.25)",
  success: "0 4px 14px 0 rgb(16 185 129 / 0.25)",
  warning: "0 4px 14px 0 rgb(245 158 11 / 0.25)",
  error: "0 4px 14px 0 rgb(239 68 68 / 0.25)",
} as const;

// Z-index
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Transitions
export const transitions = {
  fast: "150ms ease",
  base: "200ms ease",
  slow: "300ms ease",
  slower: "500ms ease",

  // Transitions spécifiques
  fadeIn: "200ms ease-in",
  fadeOut: "200ms ease-out",
  slideIn: "300ms ease-out",
  slideOut: "300ms ease-in",
  scaleIn: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  scaleOut: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Types pour TypeScript
export type ColorTokens = typeof colors;
export type SpacingTokens = typeof spacing;
export type RadiusTokens = typeof radius;
export type OpacityTokens = typeof opacity;
export type ShadowTokens = typeof shadows;
export type ZIndexTokens = typeof zIndex;
export type TransitionTokens = typeof transitions;

// Helper pour créer des variables CSS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCSSVars = (
  tokens: Record<string, any>,
  prefix = "--allokoli"
) => {
  const vars: Record<string, string> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatten = (obj: Record<string, any>, parentKey = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const cssKey = parentKey ? `${parentKey}-${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flatten(value, cssKey);
      } else {
        vars[`${prefix}-${cssKey}`] = String(value);
      }
    });
  };

  flatten(tokens);
  return vars;
};

// Variables CSS pour les couleurs
export const colorVars = createCSSVars(colors, "--allokoli");

// Export par défaut avec tous les tokens
export default {
  colors,
  spacing,
  radius,
  opacity,
  shadows,
  zIndex,
  transitions,
  colorVars,
} as const;
