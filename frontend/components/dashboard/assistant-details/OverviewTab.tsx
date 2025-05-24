'use client';

import React from 'react';
import { 
  Card, Title, Text, Grid, Col, Flex, Metric,
  DonutChart, AreaChart, BarList, Badge
} from '@tremor/react';
import { PhoneIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Assistant } from '../../../lib/api/allokoli-sdk';

interface OverviewTabProps {
  assistant: Assistant;
  metrics: {
    callsToday: number;
    avgDuration: string;
    successRate?: number;
    callsByDay?: { date: string; calls: number }[];
    topRequestTopics?: { name: string; value: number }[];
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ assistant, metrics }) => {
  const { callsToday, avgDuration, successRate = 92, callsByDay = [], topRequestTopics = [] } = metrics;
  
  // Données pour le graphique d'appels
  const callsData = callsByDay.length > 0 ? callsByDay : [
    { date: '2024-07-01', calls: 8 },
    { date: '2024-07-02', calls: 12 },
    { date: '2024-07-03', calls: 9 },
    { date: '2024-07-04', calls: 15 },
    { date: '2024-07-05', calls: 14 },
    { date: '2024-07-06', calls: 7 },
    { date: '2024-07-07', calls: 5 },
  ];
  
  // Données pour le graphique de donut
  const donutData = [
    { name: 'Réussite', value: successRate },
    { name: 'Échec', value: 100 - successRate },
  ];
  
  // Données pour la liste des sujets
  const topicsData = topRequestTopics.length > 0 ? topRequestTopics : [
    { name: 'Questions sur les prix', value: 34 },
    { name: 'Information produit', value: 28 },
    { name: 'Support technique', value: 16 },
    { name: 'Horaires d&apos;ouverture', value: 12 },
    { name: 'Réclamations', value: 10 },
  ];
  
  // Formatage de la date de création
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Carte d&apos;informations de base */}
      <Card className="p-6">
        <Title>Informations générales</Title>
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mt-6">
          <Col>
            <Text>Création</Text>
            <Metric className="mt-1 text-base">{formatDate(assistant.created_at)}</Metric>
          </Col>
          <Col>
            <Text>Modèle</Text>
            <Metric className="mt-1 text-base">
              {typeof assistant.model === 'string' 
                ? assistant.model 
                : assistant.model?.model || 'Non spécifié'}
            </Metric>
          </Col>
          <Col>
            <Text>Langue</Text>
            <Metric className="mt-1 text-base">{assistant.language || 'Non spécifiée'}</Metric>
          </Col>
          <Col>
            <Text>Statut</Text>
            <Flex className="mt-1">
              <Badge color={assistant.metadata?.status === 'active' ? 'green' : 'yellow'} size="xl">
                {assistant.metadata?.status === 'active' ? 'Actif' : 'En configuration'}
              </Badge>
            </Flex>
          </Col>
        </Grid>
      </Card>

      {/* Statistiques d&apos;appels */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card decoration="top" decorationColor="blue">
          <Flex justifyContent="start" className="space-x-4">
            <PhoneIcon className="h-8 w-8 text-blue-500" />
            <div>
              <Text>Appels aujourd&apos;hui</Text>
              <Metric>{callsToday}</Metric>
            </div>
          </Flex>
        </Card>
        <Card decoration="top" decorationColor="indigo">
          <Flex justifyContent="start" className="space-x-4">
            <ClockIcon className="h-8 w-8 text-indigo-500" />
            <div>
              <Text>Durée moyenne</Text>
              <Metric>{avgDuration}</Metric>
            </div>
          </Flex>
        </Card>
        <Card decoration="top" decorationColor="green">
          <Flex justifyContent="start" className="space-x-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <Text>Taux de succès</Text>
              <Metric>{successRate}%</Metric>
            </div>
          </Flex>
        </Card>
      </Grid>

      {/* Graphiques et analyses */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <Card>
          <Title>Volume d&apos;appels (7 derniers jours)</Title>
          <AreaChart
            className="mt-4 h-80"
            data={callsData}
            index="date"
            categories={['calls']}
            colors={['blue']}
            valueFormatter={(value) => `${value} appels`}
            yAxisWidth={40}
            showLegend={false}
            showAnimation={true}
          />
        </Card>
        <Col numColSpan={1} numColSpanLg={1}>
          <Grid numItems={1} numItemsMd={2} className="gap-6">
            <Card>
              <Title>Taux de succès</Title>
              <DonutChart
                className="mt-6"
                data={donutData}
                category="value"
                index="name"
                valueFormatter={(value) => `${value}%`}
                colors={['emerald', 'rose']}
                showLabel={true}
                showAnimation={true}
              />
            </Card>
            <Card>
              <Title>Sujets principaux</Title>
              <Flex className="mt-6">
                <Text>Sujet</Text>
                <Text className="text-right">Appels</Text>
              </Flex>
              <BarList
                data={topicsData}
                className="mt-2"
                valueFormatter={(value: number) => `${value}`}
                color="blue"
                showAnimation={true}
              />
            </Card>
          </Grid>
        </Col>
      </Grid>
    </div>
  );
};

export default OverviewTab; 