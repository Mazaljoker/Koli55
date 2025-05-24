import type { ThemeConfig } from 'antd'

// Configuration du thème AlloKoli pour Ant Design
export const allokoliTheme: ThemeConfig = {
  token: {
    // Couleurs primaires AlloKoli
    colorPrimary: '#8b5cf6', // allokoli-purple-500
    colorSuccess: '#10b981', // green-500
    colorWarning: '#f59e0b', // yellow-500
    colorError: '#ef4444', // red-500
    colorInfo: '#3b82f6', // allokoli-blue-500
    
    // Polices
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Espacements
    sizeUnit: 4,
    sizeStep: 4,
    
    // Bordures et radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // Layout
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Couleurs supplémentaires
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#ffffff',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    
    // Text colors
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#cbd5e1',
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    
    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  },
  
  components: {
    Button: {
      primaryShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
      algorithm: true,
      borderRadius: 8,
      fontWeight: 500,
      paddingInline: 20,
      paddingBlock: 8,
    },
    
    Input: {
      borderRadius: 8,
      paddingInline: 12,
      paddingBlock: 8,
    },
    
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    },
    
    Form: {
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 8px',
      labelColor: '#374151',
      labelFontSize: 14,
    },
    
    Select: {
      borderRadius: 8,
      optionPadding: '8px 12px',
    },
    
    Modal: {
      borderRadius: 12,
      paddingLG: 24,
    },
    
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
      headerColor: '#374151',
      headerSplitColor: '#e2e8f0',
    },
    
    Tabs: {
      cardPadding: '12px 16px',
      horizontalMargin: '0 0 16px 0',
      inkBarColor: '#8b5cf6',
      itemActiveColor: '#8b5cf6',
      itemHoverColor: '#a78bfa',
      itemSelectedColor: '#8b5cf6',
    },
    
    Alert: {
      borderRadius: 8,
      paddingContentHorizontalLG: 16,
    },
    
    Drawer: {
      borderRadius: 0, // Drawers don't typically have border radius
    },
    
    Menu: {
      borderRadius: 8,
      itemPaddingInline: 16,
      itemMarginInline: 4,
      activeBarBorderWidth: 0,
      itemSelectedBg: 'rgba(139, 92, 246, 0.1)',
      itemSelectedColor: '#8b5cf6',
      itemHoverBg: 'rgba(139, 92, 246, 0.05)',
      itemHoverColor: '#7c3aed',
    },
    
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
    },
    
    Switch: {
      colorPrimary: '#8b5cf6',
      colorPrimaryHover: '#7c3aed',
    },
    
    Progress: {
      colorSuccess: '#10b981',
      remainingColor: 'rgba(139, 92, 246, 0.1)',
    },
    
    Tag: {
      borderRadiusSM: 6,
      defaultBg: 'rgba(139, 92, 246, 0.1)',
      defaultColor: '#7c3aed',
    },
    
    Badge: {
      dotSize: 8,
      textFontSize: 12,
      textFontWeight: 500,
    },
    
    Pagination: {
      borderRadius: 6,
      itemActiveBg: '#8b5cf6',
      itemBg: 'transparent',
      itemInputBg: '#ffffff',
      itemLinkBg: 'transparent',
      itemSize: 32,
    },
  },
  
  algorithm: [], // Utilise l'algorithme par défaut
}

// Configuration pour le mode sombre (optionnel)
export const allokoliDarkTheme: ThemeConfig = {
  ...allokoliTheme,
  token: {
    ...allokoliTheme.token,
    colorBgContainer: '#1e293b',
    colorBgElevated: '#334155',
    colorBgLayout: '#0f172a',
    colorBgSpotlight: '#1e293b',
    colorBorder: '#475569',
    colorBorderSecondary: '#334155',
    colorText: '#f1f5f9',
    colorTextSecondary: '#cbd5e1',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#64748b',
  },
}

// Export des variables CSS pour une utilisation avec Tailwind
export const allokoliCSSVars = {
  '--color-primary': '#8b5cf6',
  '--color-primary-hover': '#7c3aed',
  '--color-primary-active': '#6d28d9',
  '--color-primary-light': 'rgba(139, 92, 246, 0.1)',
  '--color-success': '#10b981',
  '--color-warning': '#f59e0b',
  '--color-error': '#ef4444',
  '--color-info': '#3b82f6',
  '--color-text': '#1e293b',
  '--color-text-secondary': '#64748b',
  '--border-radius': '8px',
  '--border-radius-lg': '12px',
  '--spacing': '16px',
  '--spacing-lg': '24px',
  '--shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  '--shadow-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
} 