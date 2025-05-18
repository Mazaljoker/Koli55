# Guide de Migration de Tailwind CSS vers Ant Design

## Contexte

Ce document détaille le processus de migration des composants et styles de Tailwind CSS vers Ant Design dans le projet AlloKoli. Cette migration vise à standardiser l'interface utilisateur avec des composants Ant Design et à éliminer les classes Tailwind CSS.

## Modifications principales

### 1. Remplacement des propriétés dépréciées

Certaines propriétés de thème Ant Design ont été dépréciées et remplacées par des alternatives modernes :

- `colorBgBody` → `bodyBg` (composant Layout)

### 2. Structure des thèmes

Exemple de thème personnalisé avec Ant Design :

```typescript
const customTheme = {
  token: {
    colorPrimary: '#7745FF', // Violet
    colorSecondary: '#5769FF', // Blue
    colorTertiary: '#9CB8FF', // Light blue
    colorBgContainer: '#F7F7FC', // Background
    colorBgElevated: '#F2F5FF', // Accent
    colorText: '#1B1D2A', // Text
  },
  components: {
    Layout: {
      colorBgHeader: 'rgba(255, 255, 255, 0.7)',
      bodyBg: 'transparent',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemText: 'rgba(255, 255, 255, 0.85)',
      colorItemTextHover: '#ffffff',
      colorItemBgHover: 'rgba(255, 255, 255, 0.1)',
    },
  },
};
```

### 3. Styles inline vs Tailwind CSS

Avant (Tailwind) :
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
```

Après (Ant Design) :
```jsx
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  padding: 16, 
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
}}>
```

## Bonnes pratiques

1. **Centraliser les thèmes** : Définir un thème global dans un fichier dédié
2. **Utiliser ConfigProvider** : Envelopper l'application avec ConfigProvider pour appliquer le thème
3. **Respecter l'échelle de 8px** : Utiliser des multiples de 8 pour les espacements
4. **Utiliser les composants officiels** : Préférer les composants Ant Design aux composants personnalisés
5. **Glassmorphism** : Pour les effets glassmorphism, utiliser des styles inline avec des variables réutilisables

## Fichiers migrés

- `frontend/components/layout/DashboardLayout.tsx`
- `frontend/app/dashboard/page.tsx`
- `frontend/app/landing-page.tsx`

## Références

- [Documentation Ant Design](https://ant.design/docs/react/introduce)
- [Tokens de design Ant Design](https://ant.design/docs/react/customize-theme)
- [Guide de migration Ant Design](https://ant.design/docs/react/migration-v5) 