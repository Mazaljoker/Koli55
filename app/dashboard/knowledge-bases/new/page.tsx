import React from 'react';
import KnowledgeBaseNewForm from '@/components/dashboard/KnowledgeBaseNewForm';

export default function NewKnowledgeBasePage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-4xl">
      {/* max-w-4xl pour un formulaire est souvent plus confortable que max-w-7xl */}
      <KnowledgeBaseNewForm />
    </main>
  );
} 