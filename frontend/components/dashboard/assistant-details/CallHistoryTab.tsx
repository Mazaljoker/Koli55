'use client';

import React, { useState } from 'react';
import { 
  Card, Title, Text, Grid, Col, Table, TableHead, 
  TableHeaderCell, TableBody, TableRow, TableCell, 
  Badge, Button, Select, SelectItem, TextInput, Flex
} from '@tremor/react';
import { CalendarIcon, MagnifyingGlassIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface CallHistoryTabProps {
  assistantId: string;
}

// Type pour un appel dans l'historique
interface CallRecord {
  id: string;
  date: string;
  duration: string;
  from: string;
  status: 'completed' | 'failed' | 'in-progress' | 'voicemail';
  sentiment?: string;
  recordingUrl?: string;
}

const CallHistoryTab: React.FC<CallHistoryTabProps> = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Données fictives pour les appels (à remplacer par des données réelles)
  const callsMockData: CallRecord[] = [
    {
      id: 'call-001',
      date: '2024-07-07T14:32:10',
      duration: '3:45',
      from: '+33612345678',
      status: 'completed',
      sentiment: 'positive',
      recordingUrl: '#'
    },
    {
      id: 'call-002',
      date: '2024-07-07T10:15:22',
      duration: '1:20',
      from: '+33687654321',
      status: 'completed',
      sentiment: 'neutral'
    },
    {
      id: 'call-003',
      date: '2024-07-06T16:05:00',
      duration: '0:42',
      from: '+33611223344',
      status: 'failed'
    },
    {
      id: 'call-004',
      date: '2024-07-05T09:12:33',
      duration: '5:10',
      from: '+33699887766',
      status: 'completed',
      sentiment: 'negative',
      recordingUrl: '#'
    },
    {
      id: 'call-005',
      date: '2024-07-04T11:45:21',
      duration: '0:15',
      from: '+33655443322',
      status: 'voicemail'
    }
  ];
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Filtrer les appels en fonction des filtres
  const filteredCalls = callsMockData
    .filter(call => {
      // Filtre par statut
      if (statusFilter !== 'all' && call.status !== statusFilter) {
        return false;
      }
      
      // Filtre par date
      if (dateFilter !== 'all') {
        const callDate = new Date(call.date);
        const today = new Date();
        
        if (dateFilter === 'today') {
          const isToday = callDate.getDate() === today.getDate() && 
                          callDate.getMonth() === today.getMonth() && 
                          callDate.getFullYear() === today.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === 'week') {
          const lastWeek = new Date();
          lastWeek.setDate(today.getDate() - 7);
          if (callDate < lastWeek) return false;
        } else if (dateFilter === 'month') {
          const lastMonth = new Date();
          lastMonth.setMonth(today.getMonth() - 1);
          if (callDate < lastMonth) return false;
        }
      }
      
      // Filtre par recherche (numéro de téléphone)
      if (search && !call.from.includes(search)) {
        return false;
      }
      
      return true;
    });

  // Couleurs des badges par statut
  const statusColors: Record<string, string> = {
    'completed': 'green',
    'failed': 'red',
    'in-progress': 'blue',
    'voicemail': 'yellow'
  };
  
  // Labels des statuts
  const statusLabels: Record<string, string> = {
    'completed': 'Terminé',
    'failed': 'Échoué',
    'in-progress': 'En cours',
    'voicemail': 'Messagerie'
  };
  
  // Labels des sentiments
  const sentimentLabels: Record<string, string> = {
    'positive': 'Positif',
    'neutral': 'Neutre',
    'negative': 'Négatif'
  };
  
  // Couleurs des badges par sentiment
  const sentimentColors: Record<string, string> = {
    'positive': 'emerald',
    'neutral': 'gray',
    'negative': 'rose'
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title>Historique des appels</Title>
        <Text className="mt-2">Consultez tous les appels reçus par cet assistant</Text>
        
        {/* Filtres */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 mt-6 mb-6">
          <Col>
            <TextInput 
              icon={MagnifyingGlassIcon} 
              placeholder="Rechercher par numéro..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminés</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="voicemail">Messagerie</SelectItem>
            </Select>
          </Col>
          <Col>
            <Select 
              icon={CalendarIcon} 
              value={dateFilter} 
              onValueChange={setDateFilter}
            >
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd&apos;hui</SelectItem>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
            </Select>
          </Col>
        </Grid>
        
        {/* Tableau des appels */}
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date et heure</TableHeaderCell>
              <TableHeaderCell>Numéro</TableHeaderCell>
              <TableHeaderCell>Durée</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell>Sentiment</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCalls.length > 0 ? (
              filteredCalls.map(call => (
                <TableRow key={call.id}>
                  <TableCell>{formatDate(call.date)}</TableCell>
                  <TableCell>{call.from}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    <Badge color={statusColors[call.status] || 'gray'} size="sm">
                      {statusLabels[call.status] || call.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {call.sentiment ? (
                      <Badge color={sentimentColors[call.sentiment] || 'gray'} size="sm">
                        {sentimentLabels[call.sentiment] || call.sentiment}
                      </Badge>
                    ) : (
                      <Text className="text-gray-400">-</Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <Flex justifyContent="start" className="gap-2">
                      {call.recordingUrl && (
                        <Button 
                          size="xs" 
                          variant="secondary" 
                          icon={PhoneIcon}
                          tooltip="Écouter l'enregistrement"
                        >
                          Écouter
                        </Button>
                      )}
                      <Button 
                        size="xs" 
                        variant="light"
                        tooltip="Voir les détails de l'appel"
                      >
                        Détails
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <Text className="text-gray-500">Aucun appel trouvé avec ces critères</Text>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CallHistoryTab; 