import type { ThemeConfig } from "antd";

// Correspondance avec les couleurs de tailwind.config.ts
const ALLOKOLI_COLORS = {
  primary: "#7C3AED", // allokoli-primary
  secondary: "#A78BFA", // allokoli-secondary (utilisé pour hover/variations)
  accent: "#F59E0B", // allokoli-accent
  success: "#10B981", // allokoli-success
  warning: "#F59E0B", // allokoli-accent (AntD warning est souvent jaune/orange)
  error: "#EF4444", // allokoli-error
  background: "#1E1B2E", // allokoli-background
  surface: "#2D2A40", // allokoli-surface (pour les fonds de cartes/inputs légèrement plus clairs)
  textPrimary: "#F3F4F6",
  textSecondary: "#D1D5DB",
  focusVioletRing: "rgba(167, 139, 250, 0.6)", // allokoli-focus-violet (pour controlOutline)
};

export const allokoliTheme: ThemeConfig = {
  token: {
    // Couleurs de base
    colorPrimary: ALLOKOLI_COLORS.primary,
    colorSuccess: ALLOKOLI_COLORS.success,
    colorWarning: ALLOKOLI_COLORS.warning,
    colorError: ALLOKOLI_COLORS.error,
    colorInfo: ALLOKOLI_COLORS.secondary, // Souvent un bleu/violet clair

    // Texte
    colorTextBase: ALLOKOLI_COLORS.textPrimary,
    colorTextSecondary: ALLOKOLI_COLORS.textSecondary,
    colorTextPlaceholder: ALLOKOLI_COLORS.textSecondary,

    // Fond
    colorBgBase: ALLOKOLI_COLORS.background, // Fond général de la page si AntD la contrôle
    colorBgContainer: ALLOKOLI_COLORS.surface, // Fond des composants comme Card, Modal, Input
    colorBgLayout: ALLOKOLI_COLORS.background, // Fond pour les composants de layout
    colorBgElevated: ALLOKOLI_COLORS.surface, // Fond pour les éléments flottants (Dropdown, Modal, Popover)
    colorFillAlter: ALLOKOLI_COLORS.surface, // Utilisé pour les headers de Table, etc.

    // Bordures
    colorBorder: "rgba(255, 255, 255, 0.2)", // Bordure subtile pour inputs, etc.
    colorBorderSecondary: "rgba(255, 255, 255, 0.1)", // Bordure encore plus subtile

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
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Ombre subtile pour les éléments surélevés
    boxShadowSecondary: "0 8px 32px rgba(0, 0, 0, 0.35)", // Ombre pour cartes glassmorphism (plus prononcée)

    // Lien
    colorLink: ALLOKOLI_COLORS.secondary,
    colorLinkHover: ALLOKOLI_COLORS.primary,
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
      // Le gradient pour primary se fera via CSS car AntD ne le supporte pas nativement dans les tokens.
      // On définit une couleur de secours solide.
      colorPrimary: ALLOKOLI_COLORS.primary,
      colorPrimaryHover: ALLOKOLI_COLORS.secondary, // Hover plus clair
      colorPrimaryActive: ALLOKOLI_COLORS.primary, // Ou plus foncé si souhaité
      colorTextLightSolid: ALLOKOLI_COLORS.textPrimary, // Assure que le texte des boutons primaires est lisible

      // Pour les boutons "default" et "dashed" (souvent utilisés comme secondaires ou outline)
      colorBgContainerDisabled: "rgba(255,255,255,0.05)",
      borderColorDisabled: "rgba(255,255,255,0.1)",
      colorTextDisabled: "rgba(255,255,255,0.3)",
    },
    Input: {
      // Glassmorphism style
      colorBgContainer: "rgba(45, 42, 64, 0.7)", // ALLOKOLI_COLORS.surface avec plus de transparence pour l'input
      colorBorder: "rgba(255, 255, 255, 0.2)",
      borderRadius: 8,
      controlHeight: 44,
      // Focus violet
      colorPrimaryHover: ALLOKOLI_COLORS.primary, // Utilisé pour la couleur de la bordure au focus
      // controlOutline est déjà défini globalement.
      // Pour l'effet de glow plus prononcé au focus, du CSS personnalisé peut être nécessaire en plus.
    },
    Card: {
      // Pour le glassmorphism, la couleur de fond est importante.
      // Le blur et la transparence plus poussée via `backdrop-filter` nécessiteront du CSS.
      colorBgContainer: "rgba(45, 42, 64, 0.6)", // surface avec opacité pour effet semi-transparent
      borderRadiusLG: 12, // Utiliser le borderRadiusLG global
      paddingLG: 24, // Padding standard pour les cartes
      boxShadow: "none", // On gèrera les ombres via Tailwind ou CSS personnalisé pour glassmorphism
      boxShadowSecondary: "none",
    },
    Modal: {
      // Design cohérent avec glassmorphism
      colorBgElevated: "rgba(30, 27, 46, 0.85)", // background un peu plus opaque pour la lisibilité du contenu modal
      // Le backdrop-filter devra être appliqué via CSS sur la classe .ant-modal-content
      borderRadiusLG: 12, // Utiliser le borderRadiusLG global
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)", // Ombre de base pour les modales
    },
    Table: {
      // Headers avec fond glassmorphism
      colorFillAlter: "rgba(45, 42, 64, 0.7)", // Couleur de fond pour les rangées alternées (si utilisé)
      headerBg: "rgba(45, 42, 64, 0.8)", // Fond des en-têtes
      headerColor: ALLOKOLI_COLORS.textPrimary,
      borderColor: "rgba(255, 255, 255, 0.1)", // Bordures de cellules
      borderRadiusLG: 0, // Souvent les tables n'ont pas de radius sur les coins externes, mais sur les cellules
      padding: 12, // Padding des cellules
      paddingLG: 16,
      paddingSM: 8,
    },
    // ... autres composants à surcharger si nécessaire
  },
  // Algorithm pour le mode sombre (AntD v5 le gère bien si les tokens sont corrects)
  // Si on veut forcer un thème sombre spécifique qui diffère légèrement de allokoliTheme.
  // algorithm: theme.darkAlgorithm, // Exemple si on avait un `theme` importé d'antd
};

// allokoliDarkTheme sera identique à allokoliTheme car notre thème principal est déjà sombre.
// Si des variations spécifiques étaient nécessaires pour un "mode encore plus sombre" ou
// si allokoliTheme était clair, on définirait allokoliDarkTheme différemment ici.
export const allokoliDarkTheme: ThemeConfig = {
  ...allokoliTheme,
  // On peut surcharger des tokens spécifiques pour le mode sombre ici si nécessaire,
  // mais comme allokoliTheme est déjà sombre, c'est souvent redondant.
  // Par exemple, si on voulait un fond encore plus sombre pour le dark theme :
  // token: {
  //   ...allokoliTheme.token,
  //   colorBgBase: '#100E1C',
  // },
};

// Note importante pour le Glassmorphism avec Ant Design :
// Les effets de blur (`backdrop-filter`) ne peuvent pas être appliqués directement via les tokens.
// Il faudra cibler les classes CSS des composants AntD (ex: `.ant-card`, `.ant-modal-content`)
// et leur appliquer `backdrop-filter: blur(10px);` et un `background-color` avec transparence
// (comme `rgba(R,G,B, A)`) dans un fichier CSS global.
// Les tokens `colorBgContainer` dans `allokoliTheme` aident à définir cette couleur de fond transparente.
