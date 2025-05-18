'use client';

import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import frFR from 'antd/locale/fr_FR';

// Thème personnalisé pour Ant Design
const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
};

// Provider pour l'application avec le thème Ant Design
export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={theme} locale={frFR}>
      {children}
    </ConfigProvider>
  );
} 