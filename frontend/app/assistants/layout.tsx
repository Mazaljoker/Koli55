'use client';

import React from 'react';
import '../styles/wizard.css';

interface AssistantsLayoutProps {
  children: React.ReactNode;
}

export default function AssistantsLayout({ children }: AssistantsLayoutProps) {
  return (
    <main>
      {children}
    </main>
  );
} 