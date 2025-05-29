import type { ThemeConfig } from "antd";

// Correspondance avec les couleurs de tailwind.config.ts (Mode Clair)
const ALLOKOLI_COLORS = {
  primary: "#7C3AED", // allokoli-primary
  secondary: "#A78BFA", // allokoli-secondary (utilisé pour hover/variations)
  accent: "#F59E0B", // allokoli-accent
  success: "#10B981", // allokoli-success
  warning: "#F59E0B", // allokoli-accent (AntD warning est souvent jaune/orange)
  error: "#EF4444", // allokoli-error
  background: "#FFFFFF", // Fond blanc pour mode clair
  surface: "#F8FAFC", // Surface claire (pour les fonds de cartes/inputs)
  textPrimary: "#1E293B", // Texte sombre pour mode clair
  textSecondary: "#64748B", // Texte secondaire
  focusVioletRing: "rgba(124, 58, 237, 0.6)", // Focus violet adapté au mode clair
};

export const allokoliTheme: ThemeConfig = {
  token: {
    // Couleurs de base
    colorPrimary: ALLOKOLI_COLORS.primary,
    colorSuccess: ALLOKOLI_COLORS.success,
    colorWarning: ALLOKOLI_COLORS.warning,
    colorError: ALLOKOLI_COLORS.error,
    colorInfo: ALLOKOLI_COLORS.secondary, // Souvent un bleu/violet clair

    // Texte (adapté au mode clair)
    colorTextBase: ALLOKOLI_COLORS.textPrimary,
    colorTextSecondary: ALLOKOLI_COLORS.textSecondary,
    colorTextPlaceholder: ALLOKOLI_COLORS.textSecondary,

    // Fond (mode clair)
    colorBgBase: ALLOKOLI_COLORS.background, // Fond blanc
    colorBgContainer: ALLOKOLI_COLORS.background, // Fond des composants blanc
    colorBgLayout: ALLOKOLI_COLORS.surface, // Fond gris très clair pour les layouts
    colorBgElevated: ALLOKOLI_COLORS.background, // Fond blanc pour les éléments flottants
    colorFillAlter: ALLOKOLI_COLORS.surface, // Utilisé pour les headers de Table, etc.

    // Bordures (mode clair)
    colorBorder: "#E2E8F0", // Bordure claire
    colorBorderSecondary: "#F1F5F9", // Bordure encore plus claire

    // Police
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",

    // Radius
    borderRadius: 8, // Radius global pour beaucoup de composants
    borderRadiusLG: 12, // Pour les cartes, modales (plus grand)
    borderRadiusSM: 4, // Pour les petits éléments

    // Control (pour Input, Select, etc.)
    controlHeight: 44, // Hauteur des inputs pour correspondre à la hauteur des boutons
    controlOutline: `2px solid ${ALLOKOLI_COLORS.focusVioletRing}`, // Pour le focus
    controlItemBgActive: ALLOKOLI_COLORS.primary, // Pour les éléments actifs dans Select/Dropdown

    // Autres tokens pour la cohérence
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Ombre subtile pour les éléments surélevés
    boxShadowSecondary: "0 4px 6px rgba(0, 0, 0, 0.1)", // Ombre pour cartes

    // Lien
    colorLink: ALLOKOLI_COLORS.primary,
    colorLinkHover: ALLOKOLI_COLORS.secondary,
    colorLinkActive: ALLOKOLI_COLORS.primary,

    // Motion
    motionUnit: 0.15, // Ajuster la vitesse des animations (plus rapide)
  },
  components: {
    Button: {
      borderRadius: 8,
      borderRadiusLG: 8, // Assurer que les gros boutons ont aussi 8px
      borderRadiusSM: 6,
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
      colorPrimary: ALLOKOLI_COLORS.primary,
      colorPrimaryHover: ALLOKOLI_COLORS.secondary, // Hover plus clair
      colorPrimaryActive: ALLOKOLI_COLORS.primary,
      colorTextLightSolid: "#FFFFFF", // Texte blanc sur boutons primaires

      // Pour les boutons "default" et "dashed" (mode clair)
      colorBgContainerDisabled: "#F1F5F9",
      borderColorDisabled: "#E2E8F0",
      colorTextDisabled: "#94A3B8",
    },
    Input: {
      colorBgContainer: ALLOKOLI_COLORS.background, // Fond blanc
      colorBorder: "#E2E8F0",
      borderRadius: 8,
      controlHeight: 44,
      colorPrimaryHover: ALLOKOLI_COLORS.primary, // Utilisé pour la couleur de la bordure au focus
    },
    Card: {
      colorBgContainer: ALLOKOLI_COLORS.background, // Fond blanc
      borderRadiusLG: 12,
      paddingLG: 24,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Ombre claire
    },
    Modal: {
      colorBgElevated: ALLOKOLI_COLORS.background, // Fond blanc
      borderRadiusLG: 12,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Ombre claire pour les modales
    },
    Table: {
      colorFillAlter: ALLOKOLI_COLORS.surface, // Fond gris très clair pour les rangées alternées
      headerBg: ALLOKOLI_COLORS.surface, // Fond des en-têtes
      headerColor: ALLOKOLI_COLORS.textPrimary,
      borderColor: "#E2E8F0", // Bordures de cellules
      borderRadiusLG: 0,
      padding: 12,
      paddingLG: 16,
      paddingSM: 8,
    },
  },
  // Mode clair par défaut (pas d'algorithme sombre)
  algorithm: [],
};
