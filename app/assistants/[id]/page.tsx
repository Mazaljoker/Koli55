'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';
import { 
  Button, Card, Title, Text, Metric, Badge, 
  TabGroup, TabList, Tab, TabPanels, TabPanel, 
  Grid, Col, Flex
} from '@tremor/react';
import { 
  PhoneIcon, PencilIcon, PlayIcon, 
  EllipsisHorizontalIcon, DocumentDuplicateIcon, 
  CodeBracketIcon, TrashIcon, HomeIcon, ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AssistantData } from '../../../lib/api/assistantsService';

// Import Tab Components
import OverviewTab from '../../../components/dashboard/assistant-details/OverviewTab';
import ConfigurationTab from '../../../components/dashboard/assistant-details/ConfigurationTab';
import CallHistoryTab from '../../../components/dashboard/assistant-details/CallHistoryTab';
import KnowledgeBasesTab from '../../../components/dashboard/assistant-details/KnowledgeBasesTab';
import TestingTab from '../../../components/dashboard/assistant-details/TestingTab';
import WebhooksTab from '../../../components/dashboard/assistant-details/WebhooksTab';

// Utiliser le type AssistantData du service
type Assistant = AssistantData;

export default function AssistantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const assistantId = params.id as string;
  const tabParam = searchParams.get('tab');

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(
    tabParam === 'configuration' ? 1 :
    tabParam === 'history' ? 2 :
    tabParam === 'kb-tools' ? 3 :
    tabParam === 'testing' ? 4 :
    tabParam === 'webhooks' ? 5 : 0
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [callsToday, setCallsToday] = useState(0);
  const [avgDuration, setAvgDuration] = useState('0:00');
  
  useEffect(() => {
    if (assistantId) {
      fetchAssistantDetails();
      fetchAssistantMetrics();
    }
  }, [assistantId]);
  
  // Mettre à jour l'URL quand on change d'onglet
  useEffect(() => {
    const tabNames = ['overview', 'configuration', 'history', 'kb-tools', 'testing', 'webhooks'];
    const newUrl = `/assistants/${assistantId}${selectedTab > 0 ? `?tab=${tabNames[selectedTab]}` : ''}`;
    
    // Utiliser window.history pour éviter de recharger la page
    window.history.replaceState({}, '', newUrl);
  }, [selectedTab, assistantId]);

  // Gérer le clic en dehors du menu pour le fermer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    // Attacher l'événement au document seulement si le menu est ouvert
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Nettoyer l'événement
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  async function fetchAssistantDetails() {
    setLoading(true);
    setError(null);
    try {
      // Utiliser le service pour récupérer les détails de l'assistant
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      const response = await fetch(`/api/assistants/${assistantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assistant: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        setAssistant(data.data);
      } else {
        throw new Error('Assistant not found or no data returned.');
      }
    } catch (err: any) {
      console.error('Client-side error fetching assistant details:', err);
      setError(err.message || 'An unexpected error occurred.');
      
      // Si en mode développement, utiliser des données de démo
      if (process.env.NODE_ENV === 'development') {
        setAssistant({
          id: assistantId,
          name: "Assistant Commercial Demo",
          model: "gpt-4o",
          language: "fr-FR",
          forwarding_phone_number: "+33755558899",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          firstMessage: "Bonjour, comment puis-je vous aider aujourd'hui?",
          instructions: "Vous êtes un assistant commercial qui aide les clients à choisir les meilleurs produits.",
          tools_config: {
            knowledgeBases: ["kb_1", "kb_2"],
            functions: ["function_1", "function_2"]
          },
          metadata: {
            status: "active"
          }
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchAssistantMetrics() {
    // Cette fonction récupérera les métriques comme le nombre d'appels, la durée moyenne, etc.
    // Pour l'instant, utilisons des données fictives
    setCallsToday(12);
    setAvgDuration('2:45');
  }

  function handleDeleteAssistant() {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet assistant ? Cette action est irréversible.")) {
      // Logique de suppression
      router.push('/dashboard');
    }
  }

  function getAssistantStatus(assistant: Assistant | null) {
    if (!assistant) return { status: 'loading', label: 'Chargement...' };
    
    if (!assistant.model || !assistant.language) {
      return { status: 'config', label: 'Configuration requise' };
    }
    
    if (assistant.metadata && 'error' in assistant.metadata) {
      return { status: 'error', label: 'Erreur' };
    }
    
    return { status: 'active', label: 'Actif' };
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Text>Chargement des détails de l'assistant...</Text>
      </div>
    );
  }

  if (error && !assistant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-red-50">
          <Title className="text-red-700">Erreur</Title>
          <Text className="text-red-600">{error}</Text>
          <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')} variant="secondary">
              Retour au Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { status, label } = getAssistantStatus(assistant);
  const statusColorMap: Record<string, string> = {
    active: 'green',
    config: 'yellow',
    error: 'red',
    loading: 'gray'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/dashboard" className="hover:text-blue-600 flex items-center">
          <HomeIcon className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
        <ArrowRightIcon className="h-3 w-3 mx-2" />
        <Link href="/dashboard" className="hover:text-blue-600">
          Assistants
        </Link>
        <ArrowRightIcon className="h-3 w-3 mx-2" />
        <span className="text-gray-700 font-medium">{assistant?.name || assistantId}</span>
      </div>

      {/* En-tête de l'Assistant */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-800">{assistant?.name || 'Assistant'}</h1>
            <Badge color={statusColorMap[status]} size="md">{label}</Badge>
          </div>
          <Text className="text-gray-600 mt-1">
            ID: {assistant?.id} 
            {assistant?.vapi_assistant_id && ` / ID Vapi: ${assistant.vapi_assistant_id}`}
          </Text>
        </div>
        <Flex justifyContent="end" className="gap-2 w-full md:w-auto">
          <Link href={`/assistants/${assistantId}/edit`}>
            <Button variant="primary" icon={PencilIcon}>Modifier l'Assistant</Button>
          </Link>
          <Button variant="secondary" icon={PlayIcon}>
            Tester l'Appel
          </Button>
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex justify-center rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none">
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Dupliquer
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Voir JSON de configuration Vapi
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDeleteAssistant}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full px-4 py-2 text-left text-sm text-red-600`}
                      >
                        Supprimer
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </Flex>
      </div>

      {/* Bloc de Métriques Clés */}
      <Grid numItemsMd={2} numItemsLg={4} className="mt-6 gap-6">
        <Card>
          <Title>Appels Aujourd'hui</Title>
          <Metric>{callsToday}</Metric>
        </Card>
        <Card>
          <Title>Durée Moyenne d'Appel (7j)</Title>
          <Metric>{avgDuration}</Metric>
        </Card>
        <Card>
          <Title>Numéro Principal Assigné</Title>
          <div className="mt-2 flex items-center">
            <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
            <Text className="text-blue-600 hover:underline cursor-pointer">
              {assistant?.forwarding_phone_number || 'Non assigné'}
            </Text>
          </div>
        </Card>
        <Card>
          <Title>Base de Connaissances Principale</Title>
          <div className="mt-2">
            {assistant?.tools_config?.knowledgeBases?.length ? (
              <Link href={`/dashboard/knowledge-bases/${assistant.tools_config.knowledgeBases[0]}`}>
                <Text className="text-blue-600 hover:underline cursor-pointer">
                  {assistant.tools_config.knowledgeBases[0]}
                </Text>
              </Link>
            ) : (
              <Text>Non assignée</Text>
            )}
          </div>
        </Card>
      </Grid>

      {/* Navigation par Onglets */}
      <div className="mt-6">
        <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
          <TabList>
            <Tab>Aperçu & Performance</Tab>
            <Tab>Configuration Détaillée</Tab>
            <Tab>Historique des Appels</Tab>
            <Tab>Bases de Connaissances & Outils</Tab>
            <Tab>Test & Débogage</Tab>
            <Tab>Webhooks & Intégrations</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Aperçu & Performance */}
              {loading ? (
                <Card className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <Text className="ml-3">Chargement des données...</Text>
                </Card>
              ) : assistant ? (
                <OverviewTab assistant={assistant} />
              ) : (
                <Card className="bg-red-50">
                  <Text className="text-red-600">Impossible de charger les données de l'assistant</Text>
                </Card>
              )}
            </TabPanel>
            <TabPanel>
              {/* Configuration Détaillée */}
              {loading ? (
                <Card className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <Text className="ml-3">Chargement de la configuration...</Text>
                </Card>
              ) : assistant ? (
                <ConfigurationTab assistant={assistant} />
              ) : (
                <Card className="bg-red-50">
                  <Text className="text-red-600">Impossible de charger la configuration de l'assistant</Text>
                </Card>
              )}
            </TabPanel>
            <TabPanel>
              {/* Historique des Appels */}
              <CallHistoryTab assistantId={assistantId} />
            </TabPanel>
            <TabPanel>
              {/* Bases de Connaissances & Outils */}
              {loading ? (
                <Card className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <Text className="ml-3">Chargement des bases de connaissances...</Text>
                </Card>
              ) : assistant ? (
                <KnowledgeBasesTab assistant={assistant} />
              ) : (
                <Card className="bg-red-50">
                  <Text className="text-red-600">Impossible de charger les bases de connaissances</Text>
                </Card>
              )}
            </TabPanel>
            <TabPanel>
              {/* Test & Débogage */}
              {loading ? (
                <Card className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <Text className="ml-3">Chargement de l'environnement de test...</Text>
                </Card>
              ) : assistant ? (
                <TestingTab assistant={assistant} />
              ) : (
                <Card className="bg-red-50">
                  <Text className="text-red-600">Impossible de charger l'environnement de test</Text>
                </Card>
              )}
            </TabPanel>
            <TabPanel>
              {/* Webhooks & Intégrations */}
              <WebhooksTab assistantId={assistantId} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {error && (
        <Card className="mt-6 bg-red-50">
          <Text className="text-red-600">{error}</Text>
          <Button onClick={fetchAssistantDetails} variant="light" className="mt-2">
            Réessayer
          </Button>
        </Card>
      )}
    </div>
  );
} 