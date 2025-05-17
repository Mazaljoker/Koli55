'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Text, 
  Button,
  Badge,
  TextInput,
  Select,
  SelectItem,
  Flex,
  Card,
  Title
} from '@tremor/react';
import { AssistantData } from '../../lib/api/assistantsService';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  ChartBarIcon,
  PlayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Utiliser le type AssistantData du service
type Assistant = AssistantData;

interface AssistantsListProps {
  assistants: Assistant[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  onDelete: (assistantId: string) => void;
}

export default function AssistantsList({
  assistants,
  loading,
  error,
  deletingId,
  onDelete,
}: AssistantsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Fonction pour determiner le statut d'un assistant
  const getAssistantStatus = (assistant: Assistant): { status: 'active' | 'config' | 'error', label: string } => {
    // Ici vous pouvez implémenter la logique pour déterminer le statut
    // Par exemple, vérifier si tous les champs obligatoires sont remplis
    
    if (!assistant.model || !assistant.language) {
      return { status: 'config', label: 'Configuration requise' };
    }
    
    // Vérifier s'il y a une erreur dans les métadonnées ou d'autres indicateurs
    // La propriété vapi_error n'existe pas directement sur AssistantData, on vérifie dans metadata
    if (assistant.metadata && 'error' in assistant.metadata) {
      return { status: 'error', label: 'Erreur' };
    }
    
    return { status: 'active', label: 'Actif' };
  };

  // Filtrer et trier les assistants
  const filteredAssistants = assistants
    .filter(assistant => {
      // Filtre de recherche
      const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par statut
      const { status } = getAssistantStatus(assistant);
      const matchesStatus = statusFilter === 'all' || statusFilter === status;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Tri
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'last_activity':
          // Utiliser updated_at ou un champ plus spécifique si disponible
          return new Date(b.updated_at || b.created_at).getTime() - 
                 new Date(a.updated_at || a.created_at).getTime();
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
        Erreur: {error}
      </div>
    );
  }
  
  if (assistants.length === 0) {
    return (
      <div className="text-center py-8 bg-white p-6 rounded-lg shadow-md">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun assistant trouvé</h3>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'assistants.</p>
        <Link href="/assistants/new">
          <Button variant="primary">Créer mon premier assistant</Button>
        </Link>
      </div>
    );
  }

  // Function pour afficher le badge de statut
  const renderStatusBadge = (assistant: Assistant) => {
    const { status, label } = getAssistantStatus(assistant);
    
    const colorMap = {
      active: 'green',
      config: 'yellow',
      error: 'red'
    };
    
    return (
      <Badge color={colorMap[status]} size="sm">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full bg-${colorMap[status]}-500 mr-1.5`}></div>
          {label}
        </div>
      </Badge>
    );
  };

  return (
    <Card>
      <div className="mb-6">
        <Title className="text-xl font-bold text-gray-800 mb-4">Mes Assistants</Title>
        
        {/* Outils de filtrage et recherche */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <TextInput
            icon={MagnifyingGlassIcon}
            placeholder="Rechercher un assistant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          
          <div className="flex flex-1 gap-3">
            <Select
              placeholder="Filtrer par statut"
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full md:w-1/2"
            >
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="config">Configuration requise</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
            </Select>
            
            <Select
              placeholder="Trier par"
              value={sortBy}
              onValueChange={setSortBy}
              className="w-full md:w-1/2"
            >
              <SelectItem value="created_at">Date de création</SelectItem>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="last_activity">Dernière activité</SelectItem>
            </Select>
          </div>
        </div>
      </div>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Statut</TableHeaderCell>
            <TableHeaderCell>Nom de l'Assistant</TableHeaderCell>
            <TableHeaderCell>Modèle LLM</TableHeaderCell>
            <TableHeaderCell>Numéro(s) de Téléphone</TableHeaderCell>
            <TableHeaderCell>Appels Récents (7j)</TableHeaderCell>
            <TableHeaderCell>Dernière Activité</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAssistants.map((assistant) => {
            const modelName = typeof assistant.model === 'string' 
              ? assistant.model 
              : assistant.model?.model || 'N/A';
              
            return (
              <TableRow key={assistant.id}>
                <TableCell>{renderStatusBadge(assistant)}</TableCell>
                <TableCell>
                  <Link href={`/assistants/${assistant.id}`} className="hover:text-blue-600 font-medium">
                    {assistant.name}
                  </Link>
                </TableCell>
                <TableCell><Text>{modelName}</Text></TableCell>
                <TableCell>
                  <Text>
                    {assistant.forwarding_phone_number || 'Non assigné'}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>0 appels</Text> {/* Placeholder - à remplacer par les données réelles */}
                </TableCell>
                <TableCell>
                  <Text>
                    {new Date(assistant.updated_at || assistant.created_at).toLocaleDateString()}
                  </Text>
                </TableCell>
                <TableCell>
                  <Flex className="justify-end gap-2">
                    <Link href={`/assistants/${assistant.id}`}>
                      <Button size="xs" variant="secondary" icon={EyeIcon} tooltip="Voir les détails" />
                    </Link>
                    <Link href={`/assistants/${assistant.id}/edit`}>
                      <Button size="xs" variant="secondary" icon={PencilIcon} tooltip="Modifier" />
                    </Link>
                    <Link href={`/assistants/${assistant.id}?tab=analytics`}>
                      <Button size="xs" variant="secondary" icon={ChartBarIcon} tooltip="Analytics" />
                    </Link>
                    <Button 
                      size="xs" 
                      variant="secondary" 
                      color="green"
                      icon={PlayIcon}
                      tooltip="Test rapide"
                      onClick={() => alert('Fonction de test à implémenter')}
                    />
                    <Button 
                      size="xs" 
                      variant="secondary" 
                      color="red"
                      icon={TrashIcon}
                      tooltip="Supprimer"
                      onClick={() => onDelete(assistant.id)}
                      disabled={deletingId === assistant.id}
                      loading={deletingId === assistant.id}
                    />
                  </Flex>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
} 