'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';
import { 
  Button, Card, Title, Text, Metric, Badge, 
  TabGroup, TabList, Tab, TabPanels, TabPanel, 
  Grid, Flex
} from '@tremor/react';
import { 
  PhoneIcon, PencilIcon, PlayIcon, 
  EllipsisHorizontalIcon, DocumentDuplicateIcon, 
  CodeBracketIcon, TrashIcon, HomeIcon, ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from '../../../lib/hooks/useAlloKoliSDK';
import { Assistant } from '../../../lib/api/allokoli-sdk';

// Import Tab Components
import OverviewTab from '../../../components/dashboard/assistant-details/OverviewTab';
import ConfigurationTab from '../../../components/dashboard/assistant-details/ConfigurationTab';
import CallHistoryTab from '../../../components/dashboard/assistant-details/CallHistoryTab';
import KnowledgeBasesTab from '../../../components/dashboard/assistant-details/KnowledgeBasesTab';
import TestingTab from '../../../components/dashboard/assistant-details/TestingTab';
import WebhooksTab from '../../../components/dashboard/assistant-details/WebhooksTab';

export default function AssistantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const assistantId = params.id as string;
  const tabParam = searchParams.get('tab');
  
  // Utilisation du SDK AlloKoli
  const sdk = useAlloKoliSDKWithAuth();

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
      // Utiliser le SDK pour récupérer les détails de l'assistant
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      // Utiliser le SDK AlloKoli
      const response = await sdk.getAssistant(assistantId);
      setAssistant(response.data);
      
    } catch (err: unknown) {
      console.error('Error fetching assistant details with SDK:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      
      // Si en mode développement, utiliser des données de démo
      if (process.env.NODE_ENV === 'development') {
        setAssistant({
          id: assistantId,
          name: "Assistant Commercial Demo",
          model: "gpt-4o",
          voice: "jennifer",
          language: "fr-FR",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          firstMessage: "Bonjour, comment puis-je vous aider aujourd'hui?",
          instructions: "Vous êtes un assistant commercial qui aide les clients à choisir les meilleurs produits.",
          metadata: {
            status: "active",
            forwardingPhoneNumber: "+33755558899"
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

  async function handleDeleteAssistant() {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet assistant ? Cette action est irréversible.")) {
      try {
        await sdk.deleteAssistant(assistantId);
        router.push('/dashboard');
      } catch (err) {
        console.error('Error deleting assistant:', err);
        setError('Erreur lors de la suppression de l\'assistant');
      }
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
        <Text>Chargement des détails de l&apos;assistant...</Text>
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
          </Text>
        </div>
        <Flex justifyContent="end" className="gap-2 w-full md:w-auto">
          <Link href={`/assistants/${assistantId}/edit`}>
            <Button variant="primary" icon={PencilIcon}>Modifier l&apos;Assistant</Button>
          </Link>
          <Button variant="secondary" icon={PlayIcon}>
            Tester l&apos;Appel
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
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } group flex items-center px-4 py-2 text-sm`}
                        onClick={(e) => {
                          e.preventDefault();
                          // Logique pour dupliquer l'assistant avec le SDK
                        }}
                      >
                        <DocumentDuplicateIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Dupliquer
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } group flex items-center px-4 py-2 text-sm`}
                        onClick={(e) => {
                          e.preventDefault();
                          // Logique pour voir l'API
                        }}
                      >
                        <CodeBracketIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        API & Intégration
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-red-50 text-red-700' : 'text-red-600'
                        } group flex items-center px-4 py-2 text-sm`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAssistant();
                        }}
                      >
                        <TrashIcon
                          className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                          aria-hidden="true"
                        />
                        Supprimer
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </Flex>
      </div>

      {/* Carte de statistiques */}
      <Grid numItemsMd={2} numItemsLg={4} className="mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <Text>Appels aujourd&apos;hui</Text>
              <Metric>{callsToday}</Metric>
            </div>
            <PhoneIcon className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <Text>Temps moyen d&apos;appel</Text>
              <Metric>{avgDuration}</Metric>
            </div>
            <PhoneIcon className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        {/* Autres cartes de statistiques peuvent être ajoutées ici */}
      </Grid>
      
      {/* Onglets */}
      {assistant && (
        <Card>
          <TabGroup defaultIndex={selectedTab} onIndexChange={setSelectedTab}>
            <TabList>
              <Tab>Vue d&apos;ensemble</Tab>
              <Tab>Configuration</Tab>
              <Tab>Historique d&apos;appels</Tab>
              <Tab>Bases de connaissances</Tab>
              <Tab>Tests</Tab>
              <Tab>Webhooks</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <OverviewTab 
                  assistant={assistant} 
                  metrics={{
                    callsToday,
                    avgDuration,
                    successRate: 92, // simulation
                    callsByDay: [
                      { date: '2024-07-01', calls: 8 },
                      { date: '2024-07-02', calls: 12 },
                      { date: '2024-07-03', calls: 9 },
                      { date: '2024-07-04', calls: 15 },
                      { date: '2024-07-05', calls: 14 },
                      { date: '2024-07-06', calls: 7 },
                      { date: '2024-07-07', calls: callsToday },
                    ],
                    topRequestTopics: [
                      { name: 'Questions sur les prix', value: 34 },
                      { name: 'Information produit', value: 28 },
                      { name: 'Support technique', value: 16 },
                      { name: 'Horaires d\'ouverture', value: 12 },
                      { name: 'Réclamations', value: 10 },
                    ]
                  }}
                />
              </TabPanel>
              <TabPanel>
                <ConfigurationTab assistant={assistant} />
              </TabPanel>
              <TabPanel>
                <CallHistoryTab assistantId={assistantId} />
              </TabPanel>
              <TabPanel>
                <KnowledgeBasesTab assistant={assistant} />
              </TabPanel>
              <TabPanel>
                <TestingTab assistantId={assistantId} />
              </TabPanel>
              <TabPanel>
                <WebhooksTab assistantId={assistantId} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      )}
    </div>
  );
} 