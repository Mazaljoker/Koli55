'use client';

import { Card, Title, Text, LineChart, BarChart, List, ListItem, Grid } from '@tremor/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { AssistantData } from '../../../lib/api/assistantsService';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CallData {
  id: string;
  date: string;
  duration: string;
  status: string;
}

interface OverviewTabProps {
  assistant: AssistantData;
}

export default function OverviewTab({ assistant }: OverviewTabProps) {
  const [callVolumeData, setCallVolumeData] = useState<any[]>([]);
  const [callDurationData, setCallDurationData] = useState<any[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallData[]>([]);

  useEffect(() => {
    // Simulation des données pour les graphiques
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Simuler 30 jours de données pour le volume d'appels
    const today = new Date();
    const callVolume = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      callVolume.push({
        date: date.toISOString().split('T')[0],
        Appels: Math.floor(Math.random() * 10)
      });
    }
    setCallVolumeData(callVolume);

    // Simuler la répartition des durées d'appel
    setCallDurationData([
      { duration: "< 1 min", value: 12 },
      { duration: "1-3 min", value: 18 },
      { duration: "3-5 min", value: 8 },
      { duration: "> 5 min", value: 4 }
    ]);

    // Simuler des appels récents
    setRecentCalls([
      { id: "call-123", date: "Aujourd'hui, 14:25", duration: "2:15", status: "Terminé" },
      { id: "call-122", date: "Aujourd'hui, 11:03", duration: "4:32", status: "Terminé" },
      { id: "call-121", date: "Hier, 16:45", duration: "1:12", status: "Terminé" },
      { id: "call-120", date: "Hier, 10:17", duration: "0:45", status: "Manqué" },
    ]);
  };

  return (
    <div className="space-y-6">
      <Grid numItemsMd={1} numItemsLg={2} className="gap-6">
        <Card>
          <Title>Volume d'appels (30 derniers jours)</Title>
          <LineChart
            className="mt-6"
            data={callVolumeData}
            index="date"
            categories={["Appels"]}
            colors={["blue"]}
            yAxisWidth={30}
          />
        </Card>
        <Card>
          <Title>Répartition des durées d'appel</Title>
          <BarChart
            className="mt-6"
            data={callDurationData}
            index="duration"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value) => `${value} appels`}
            yAxisWidth={30}
          />
        </Card>
      </Grid>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title>Activité Récente</Title>
          <Link href={`/assistants/${assistant.id}?tab=history`}>
            <Text className="text-blue-600 hover:underline flex items-center">
              Voir tout l'historique
              <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
            </Text>
          </Link>
        </div>
        
        <List>
          {recentCalls.map((call) => (
            <ListItem key={call.id}>
              <div className="flex justify-between w-full">
                <div>
                  <Text className="font-medium">{call.date}</Text>
                  <Text className="text-gray-500">ID: {call.id}</Text>
                </div>
                <div className="flex items-center gap-4">
                  <Text>{call.duration}</Text>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    call.status === 'Terminé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {call.status}
                  </span>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </div>
  );
} 