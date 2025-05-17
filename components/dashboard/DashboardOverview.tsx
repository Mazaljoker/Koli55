'use client';

import { Card, Title, Text, Metric } from '@tremor/react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface DashboardOverviewProps {
  assistantsCount: number;
  conversationsCount: number;
  apiCallsCount: number;
  conversationsTrend?: 'up' | 'down' | null;
  apiCallsTrend?: 'up' | 'down' | null;
}

export default function DashboardOverview({ 
  assistantsCount, 
  conversationsCount, 
  apiCallsCount,
  conversationsTrend = null,
  apiCallsTrend = null
}: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <Title>Nombre Total d'Assistants</Title>
        <Metric>{assistantsCount}</Metric>
      </Card>
      
      <Card>
        <Title>Appels Total (30j)</Title>
        <div className="flex items-center">
          <Metric>{conversationsCount}</Metric>
          {conversationsTrend && (
            <span className="ml-2">
              {conversationsTrend === 'up' ? (
                <ArrowUpIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              )}
            </span>
          )}
        </div>
      </Card>
      
      <Card>
        <Title>Utilisation API Vapi (30j)</Title>
        <div className="flex items-center">
          <Metric>{apiCallsCount}</Metric>
          {apiCallsTrend && (
            <span className="ml-2">
              {apiCallsTrend === 'up' ? (
                <ArrowUpIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              )}
            </span>
          )}
        </div>
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