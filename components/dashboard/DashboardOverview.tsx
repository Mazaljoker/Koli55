'use client';

import { Card, Title, Text, Metric } from '@tremor/react';

interface DashboardOverviewProps {
  assistantsCount: number;
  conversationsCount: number; // Placeholder
  apiCallsCount: number; // Placeholder
}

export default function DashboardOverview({ 
  assistantsCount, 
  conversationsCount, 
  apiCallsCount 
}: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <Title>Mes Assistants</Title>
        <Metric>{assistantsCount}</Metric>
      </Card>
      
      <Card>
        <Title>Conversations (30j)</Title>
        <Metric>{conversationsCount}</Metric>
        <Text>Bientôt disponible</Text>
      </Card>
      
      <Card>
        <Title>Appels API (30j)</Title>
        <Metric>{apiCallsCount}</Metric>
        <Text>Bientôt disponible</Text>
      </Card>

      {/* Placeholder pour les graphiques de tendance 
      <Card className="col-span-full lg:col-span-2">
        <Title>Volume d'appels</Title>
        <Text className="text-center py-8">Graphique de tendance des appels à venir...</Text>
      </Card>
      */}

      {/* Placeholder pour les alertes 
      <Card className="col-span-full">
        <Title>Alertes Récentes</Title>
        <Text className="text-center py-8">Section des alertes à venir...</Text>
      </Card>
      */}
    </div>
  );
} 