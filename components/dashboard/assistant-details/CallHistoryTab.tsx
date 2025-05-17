'use client';

import { useState, useEffect } from 'react';
import { 
  Card, Title, Text, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, Badge, 
  Button, DateRangePicker, DateRangePickerValue, 
  Select, SelectItem, TextInput, Flex
} from '@tremor/react';
import { 
  MagnifyingGlassIcon, ArrowPathIcon, 
  PlayIcon, DocumentTextIcon, SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface Call {
  id: string;
  date: string;
  timestamp: Date;
  phone_number: string;
  duration: string;
  status: 'completed' | 'missed' | 'in_progress' | 'failed';
  has_recording: boolean;
  has_transcript: boolean;
}

interface CallHistoryTabProps {
  assistantId: string;
}

export default function CallHistoryTab({ assistantId }: CallHistoryTabProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours avant
    to: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCallHistory();
  }, [dateRange, statusFilter, searchTerm, currentPage, assistantId]);

  const fetchCallHistory = async () => {
    setLoading(true);
    
    try {
      // Simulation de données pour l'historique des appels
      // Dans une implémentation réelle, vous feriez un appel API ici
      
      // Créer des données fictives pour la démo
      const mockCalls: Call[] = Array.from({ length: 35 }, (_, i) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        const statuses: Array<'completed' | 'missed' | 'in_progress' | 'failed'> = ['completed', 'missed', 'failed', 'in_progress'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: `call-${i + 1}`,
          date: date.toISOString(),
          timestamp: date,
          phone_number: `+337${Math.floor(10000000 + Math.random() * 90000000)}`,
          duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          status,
          has_recording: Math.random() > 0.3,
          has_transcript: Math.random() > 0.4
        };
      });
      
      // Filtrer par date
      let filteredCalls = mockCalls.filter(call => {
        const callDate = new Date(call.date);
        const from = dateRange.from;
        const to = dateRange.to;
        
        if (from && to) {
          return callDate >= from && callDate <= to;
        } else if (from) {
          return callDate >= from;
        } else if (to) {
          return callDate <= to;
        }
        
        return true;
      });
      
      // Filtrer par statut
      if (statusFilter !== 'all') {
        filteredCalls = filteredCalls.filter(call => call.status === statusFilter);
      }
      
      // Filtrer par terme de recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredCalls = filteredCalls.filter(call => 
          call.id.toLowerCase().includes(term) || 
          call.phone_number.toLowerCase().includes(term)
        );
      }
      
      // Trier par date (plus récent en premier)
      filteredCalls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setCalls(filteredCalls);
    } catch (error) {
      console.error('Error fetching call history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Paginer les données
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalls = calls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(calls.length / itemsPerPage);

  const renderPagination = () => {
    return (
      <div className="mt-4 flex justify-between items-center">
        <Text>
          Affichage de {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, calls.length)} sur {calls.length} appels
        </Text>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Text className="mx-2">
            Page {currentPage} sur {totalPages || 1}
          </Text>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Suivant
          </Button>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: 'green',
      missed: 'yellow',
      in_progress: 'blue',
      failed: 'red'
    };
    
    const labelMap: Record<string, string> = {
      completed: 'Terminé',
      missed: 'Manqué',
      in_progress: 'En cours',
      failed: 'Échec'
    };
    
    return (
      <Badge color={colorMap[status] || 'gray'} size="xs">
        {labelMap[status] || status}
      </Badge>
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title className="mb-4">Historique des Appels pour cet Assistant</Title>
        
        {/* Filtres */}
        <div className="mb-6 space-y-4">
          <Flex className="flex-col md:flex-row gap-4">
            <DateRangePicker
              className="w-full md:max-w-md"
              value={dateRange}
              onValueChange={setDateRange}
              placeholder="Filtrer par période"
            />
            
            <Select
              className="w-full md:max-w-xs"
              placeholder="Filtrer par statut"
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminés</SelectItem>
              <SelectItem value="missed">Manqués</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
            </Select>
            
            <div className="flex-grow flex gap-2">
              <TextInput
                className="w-full"
                placeholder="Rechercher par ID ou numéro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
              />
              <Button
                variant="secondary"
                icon={ArrowPathIcon}
                onClick={fetchCallHistory}
                loading={loading}
              >
                Actualiser
              </Button>
            </div>
          </Flex>
        </div>
        
        {/* Tableau des appels */}
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <Text>Chargement de l'historique...</Text>
          </div>
        ) : calls.length === 0 ? (
          <div className="py-8 text-center">
            <Text>Aucun appel trouvé pour cet assistant.</Text>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Date / Heure</TableHeaderCell>
                  <TableHeaderCell>ID Appel</TableHeaderCell>
                  <TableHeaderCell>Numéro Appelant</TableHeaderCell>
                  <TableHeaderCell>Durée</TableHeaderCell>
                  <TableHeaderCell>Statut</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{formatDate(call.date)}</TableCell>
                    <TableCell>
                      <Text className="font-medium">{call.id}</Text>
                    </TableCell>
                    <TableCell>{call.phone_number}</TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell>{getStatusBadge(call.status)}</TableCell>
                    <TableCell>
                      <Flex justifyContent="end" className="gap-2">
                        <Button size="xs" variant="light" tooltip="Voir détails de l'appel">
                          Détails
                        </Button>
                        {call.has_transcript && (
                          <Button 
                            size="xs" 
                            variant="light" 
                            icon={DocumentTextIcon}
                            tooltip="Voir la transcription"
                          />
                        )}
                        {call.has_recording && (
                          <Button 
                            size="xs" 
                            variant="light" 
                            icon={SpeakerWaveIcon}
                            tooltip="Écouter l'enregistrement"
                          />
                        )}
                        <Button 
                          size="xs" 
                          variant="light" 
                          icon={PlayIcon}
                          tooltip="Refaire cet appel"
                        />
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </Card>
    </div>
  );
} 