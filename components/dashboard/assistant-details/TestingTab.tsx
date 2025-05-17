'use client';

import { useState } from 'react';
import { Card, Title, Text, Button, TextInput, Flex, Subtitle, Divider } from '@tremor/react';
import { PhoneIcon, PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { AssistantData } from '../../../lib/api/assistantsService';

interface TestingTabProps {
  assistant: AssistantData;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'error' | 'transcription' | 'response' | 'event';
  content: string;
}

export default function TestingTab({ assistant }: TestingTabProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [recentErrors, setRecentErrors] = useState<LogEntry[]>([]);

  const startTestCall = () => {
    if (!phoneNumber.trim()) {
      // Afficher un message d'erreur
      return;
    }

    setIsTestRunning(true);
    setLogs([]);
    
    // Simuler des logs pour la démo
    const initialLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type: 'info',
      content: `Appel de test initié vers ${phoneNumber}...`
    };
    
    setLogs([initialLog]);
    
    // Simuler des événements de log qui arrivent progressivement
    let count = 0;
    const logTypes: Array<'info' | 'transcription' | 'response' | 'event'> = ['info', 'transcription', 'response', 'event'];
    
    const addLogInterval = setInterval(() => {
      count++;
      
      if (count > 10) {
        clearInterval(addLogInterval);
        setIsTestRunning(false);
        
        // Ajouter un log final
        setLogs(prevLogs => [
          ...prevLogs,
          {
            id: `log-${Date.now()}`,
            timestamp: new Date(),
            type: 'info',
            content: 'Appel de test terminé.'
          }
        ]);
        
        return;
      }
      
      const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
      let logContent = '';
      
      switch (logType) {
        case 'info':
          logContent = 'Statut de l\'appel: en cours...';
          break;
        case 'transcription':
          logContent = 'Utilisateur: "Bonjour, je voudrais savoir comment fonctionne votre service."';
          break;
        case 'response':
          logContent = 'Assistant: "Bonjour ! Je suis ravi de vous aider. Notre service fonctionne en..."';
          break;
        case 'event':
          logContent = 'Événement: speech-update (duration: 2.5s)';
          break;
      }
      
      setLogs(prevLogs => [
        ...prevLogs,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date(),
          type: logType,
          content: logContent
        }
      ]);
    }, 1500);
  };

  const stopTestCall = () => {
    setIsTestRunning(false);
    
    // Ajouter un log d'arrêt
    setLogs(prevLogs => [
      ...prevLogs,
      {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: 'info',
        content: 'Appel de test arrêté manuellement.'
      }
    ]);
  };

  // Simuler des erreurs récentes pour la démo
  const generateMockErrors = () => {
    return [
      {
        id: 'err-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        type: 'error' as const,
        content: 'API error: Failed to transcribe speech (status 429, rate limit exceeded)'
      },
      {
        id: 'err-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        type: 'error' as const,
        content: 'Call dropped: No audio detected for 30 seconds'
      },
      {
        id: 'err-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        type: 'error' as const,
        content: 'OpenAI API error: Rate limit exceeded, please try again later'
      }
    ];
  };

  // Formatter le timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Rendu d'une entrée de log avec couleur en fonction du type
  const renderLogEntry = (log: LogEntry) => {
    const styles: Record<string, string> = {
      info: 'text-gray-600',
      error: 'text-red-600 font-medium',
      transcription: 'text-blue-600',
      response: 'text-green-600',
      event: 'text-purple-600 italic'
    };
    
    return (
      <div key={log.id} className="py-1 border-b border-gray-100 last:border-0">
        <div className="flex gap-2">
          <Text className="text-gray-400 text-xs">{formatTimestamp(log.timestamp)}</Text>
          <Text className={`${styles[log.type]} text-sm`}>{log.content}</Text>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Interface d'appel de test */}
      <Card>
        <Title className="mb-4">Tester l'Assistant</Title>
        
        <div className="mb-6">
          <Subtitle className="mb-2">1. Configurer le test</Subtitle>
          <Flex className="gap-4 flex-col md:flex-row">
            <div className="flex-grow">
              <Text className="mb-1">Numéro de téléphone à appeler</Text>
              <TextInput
                placeholder="+33612345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                icon={PhoneIcon}
                disabled={isTestRunning}
                className="w-full"
              />
            </div>
            
            <div className="flex items-end">
              {!isTestRunning ? (
                <Button 
                  icon={PlayIcon} 
                  onClick={startTestCall}
                  disabled={!phoneNumber.trim()}
                >
                  Lancer l'appel test
                </Button>
              ) : (
                <Button 
                  icon={StopIcon} 
                  color="red"
                  onClick={stopTestCall}
                >
                  Arrêter l'appel
                </Button>
              )}
            </div>
          </Flex>
        </div>
        
        <Divider />
        
        <div className="mt-4">
          <Subtitle className="mb-2">2. Logs en temps réel</Subtitle>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <Text className="text-gray-500 italic text-center py-4">
                Les logs d'appel apparaîtront ici une fois le test lancé.
              </Text>
            ) : (
              <div className="space-y-1">
                {logs.map(renderLogEntry)}
              </div>
            )}
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button 
              size="xs" 
              variant="light" 
              icon={ArrowPathIcon}
              onClick={() => setLogs([])}
              disabled={logs.length === 0}
            >
              Effacer les logs
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Logs d'erreurs récents */}
      <Card>
        <Title className="mb-4">Erreurs Récentes</Title>
        
        <div className="bg-gray-50 border border-gray-200 rounded-md">
          {generateMockErrors().length === 0 ? (
            <Text className="text-gray-500 italic text-center py-4">
              Aucune erreur récente pour cet assistant.
            </Text>
          ) : (
            <div className="divide-y divide-gray-200">
              {generateMockErrors().map(renderLogEntry)}
            </div>
          )}
        </div>
      </Card>
      
      {/* Options avancées de test */}
      <Card>
        <Title className="mb-4">Options Avancées de Test</Title>
        
        <Text className="text-gray-500 italic">
          Des options pour surcharger les variables d'assistant, tester des conditions spécifiques ou simuler différents scénarios seront disponibles ici.
        </Text>
      </Card>
    </div>
  );
} 