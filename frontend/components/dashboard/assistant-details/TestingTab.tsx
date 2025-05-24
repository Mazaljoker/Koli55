'use client';

import React, { useState } from 'react';
import { 
  Card, Title, Text, Grid, Col, Flex,
  Button, TextInput, Divider, Badge
} from '@tremor/react';
import { 
  PhoneIcon, DocumentTextIcon,
  ChatBubbleLeftRightIcon, PlayIcon, StopIcon
} from '@heroicons/react/24/outline';

interface TestingTabProps {
  assistantId: string;
}

type MessageRole = 'user' | 'assistant';

interface TranscriptMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

const TestingTab: React.FC<TestingTabProps> = ({ assistantId }) => {
  const [testMode, setTestMode] = useState<'voice' | 'text'>('voice');
  const [isSimulating, setIsSimulating] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'in-progress' | 'completed' | 'failed'>('idle');
  const [userInput, setUserInput] = useState('');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  
  // Fonction pour formater la date pour l'horodatage du transcript
  const getTimestamp = () => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };
  
  // Simuler un test vocal
  const startVoiceTest = () => {
    setCallStatus('connecting');
    setIsSimulating(true);
    setTranscript([]);
    
    // Simuler un délai de connexion
    setTimeout(() => {
      setCallStatus('in-progress');
      
      // Simuler le premier message de l'assistant
      setTimeout(() => {
        const welcomeMessage = "Bonjour, merci de m'appeler. Comment puis-je vous aider aujourd'hui ?";
        setTranscript(prev => [...prev, {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: getTimestamp()
        }]);
      }, 1500);
    }, 2000);
  };
  
  // Simuler la fin d'un appel
  const endVoiceTest = () => {
    setCallStatus('completed');
    
    // Ajouter un message de fin
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        role: 'assistant',
        content: "Merci pour votre appel. Au revoir !",
        timestamp: getTimestamp()
      }]);
      
      setTimeout(() => {
        setIsSimulating(false);
      }, 1500);
    }, 1000);
  };
  
  // Simuler l'envoi d'un message texte
  const sendTextMessage = () => {
    if (!userInput.trim()) return;
    
    // Ajouter le message de l'utilisateur
    setTranscript(prev => [...prev, {
      role: 'user',
      content: userInput,
      timestamp: getTimestamp()
    }]);
    
    // Simuler un délai de réponse
    setTimeout(() => {
      // Simuler différentes réponses en fonction du message
      let response = "Je suis désolé, je ne comprends pas votre demande.";
      
      const input = userInput.toLowerCase();
      if (input.includes('bonjour') || input.includes('salut') || input.includes('hello')) {
        response = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
      } else if (input.includes('aide') || input.includes('help')) {
        response = "Je suis votre assistant virtuel. Vous pouvez me poser des questions ou me demander de l'aide pour différentes tâches.";
      } else if (input.includes('météo') || input.includes('temps')) {
        response = "Je ne suis pas connecté à des services météo en temps réel dans cette démo, mais je peux vous parler de la météo en général.";
      } else if (input.includes('merci')) {
        response = "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
      }
      
      // Ajouter la réponse de l'assistant
      setTranscript(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: getTimestamp()
      }]);
    }, 1000);
    
    // Réinitialiser l'input
    setUserInput('');
  };
  
  // Gérer l'envoi du message avec la touche Entrée
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendTextMessage();
    }
  };
  
  return (
    <Card>
      <Flex justifyContent="between" alignItems="start">
        <Title>Test de l&apos;assistant</Title>
        <Text>ID: {assistantId}</Text>
      </Flex>
      
      <Text className="mb-6">
        Testez votre assistant en simulant un appel vocal ou en échangeant par chat.
      </Text>
      
      <Grid numItems={1} numItemsLg={2} className="gap-6">
          <Col>
            <Card decoration="top" decorationColor="blue" className="h-full">
              <Flex alignItems="center" className="mb-4">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
                <Title className="text-base">Paramètres de test</Title>
              </Flex>
              
              <div className="space-y-4">
                <div>
                  <Text className="mb-2">Mode de test</Text>
                  <Flex className="gap-2">
                    <Button 
                      size="sm" 
                      variant={testMode === 'voice' ? 'primary' : 'secondary'}
                      icon={PhoneIcon}
                      onClick={() => setTestMode('voice')}
                      disabled={isSimulating}
                    >
                      Simulation d&apos;appel
                    </Button>
                    <Button 
                      size="sm" 
                      variant={testMode === 'text' ? 'primary' : 'secondary'}
                      icon={ChatBubbleLeftRightIcon}
                      onClick={() => setTestMode('text')}
                      disabled={isSimulating}
                    >
                      Chat texte
                    </Button>
                  </Flex>
                </div>
                
                <Divider />
                
                {testMode === 'voice' && (
                  <div className="flex justify-between items-center">
                    {callStatus === 'idle' ? (
                      <Button 
                        icon={PlayIcon} 
                        variant="primary"
                        onClick={startVoiceTest}
                      >
                        Démarrer l&apos;appel test
                      </Button>
                    ) : (
                      <Flex justifyContent="between" className="w-full">
                        <Badge 
                          color={
                            callStatus === 'connecting' ? 'yellow' : 
                            callStatus === 'in-progress' ? 'green' : 
                            callStatus === 'completed' ? 'gray' : 
                            callStatus === 'failed' ? 'red' : 'blue'
                          }
                          size="lg"
                        >
                          {callStatus === 'connecting' ? 'Connection...' : 
                           callStatus === 'in-progress' ? 'Appel en cours' : 
                           callStatus === 'completed' ? 'Appel terminé' : 
                           callStatus === 'failed' ? 'Erreur' : 'Inconnu'}
                        </Badge>
                        
                        {callStatus === 'in-progress' && (
                          <Button 
                            icon={StopIcon} 
                            variant="secondary"
                            color="red"
                            onClick={endVoiceTest}
                          >
                            Terminer l&apos;appel
                          </Button>
                        )}
                      </Flex>
                    )}
                  </div>
                )}
                
                {testMode === 'text' && (
                  <div className="space-y-2">
                    <Flex className="gap-2">
                      <TextInput 
                        placeholder="Entrez votre message" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isSimulating}
                      />
                      <Button 
                        variant="primary"
                        onClick={sendTextMessage}
                        disabled={!userInput.trim() || isSimulating}
                      >
                        Envoyer
                      </Button>
                    </Flex>
                  </div>
                )}
                
              </div>
            </Card>
          </Col>
          
          <Col>
            <Card decoration="top" decorationColor="indigo" className="h-full overflow-hidden">
              <Flex alignItems="center" className="mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <Title className="text-base">Conversation</Title>
              </Flex>
              
              <div className="overflow-y-auto max-h-[400px] space-y-3 mb-2">
                {transcript.length === 0 ? (
                  <div className="py-8 text-center text-gray-400">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <Text>La conversation apparaîtra ici</Text>
                  </div>
                ) : (
                  transcript.map((message, index) => (
                    <div
                      key={index}
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.role === 'assistant'
                          ? 'bg-blue-50 ml-0 mr-auto'
                          : 'bg-indigo-50 ml-auto mr-0'
                      }`}
                    >
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{message.role === 'assistant' ? 'Assistant' : 'Vous'}</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <Text>{message.content}</Text>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </Col>
        </Grid>
      </Card>
  );
};

export default TestingTab; 