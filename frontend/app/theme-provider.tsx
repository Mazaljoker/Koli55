'use client';

import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import frFR from 'antd/locale/fr_FR';
import { allokoliTheme } from '@/lib/config/antd-theme';
import { PageErrorBoundary } from '@/components/ui/ErrorBoundary';

// Provider pour l'application avec le thème Ant Design et les Error Boundaries
export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <PageErrorBoundary>
      <ConfigProvider theme={allokoliTheme} locale={frFR}>
        {children}
      </ConfigProvider>
    </PageErrorBoundary>
  );
} 