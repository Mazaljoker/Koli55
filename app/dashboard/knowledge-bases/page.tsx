import React from 'react';
import KnowledgeBases from '@/components/dashboard/KnowledgeBases';
import { Title } from '@tremor/react';

export default function KnowledgeBasesPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <KnowledgeBases />
    </main>
  );
} 