'use client';

import React, { useState } from 'react';
import { 
  Card, Title, Text, Grid, Col, Flex, 
  Button, TextInput, Select, SelectItem, 
  Divider, Switch, Table, TableHead, 
  TableRow, TableHeaderCell, TableBody, TableCell, Badge
} from '@tremor/react';
import { 
  CodeBracketIcon, PlusIcon, TrashIcon, 
  InformationCircleIcon, CheckIcon, XMarkIcon
} from '@heroicons/react/24/outline';

interface WebhooksTabProps {
  assistantId: string;
}

interface Webhook {
  id: string;
  url: string;
  event: 'call.started' | 'call.ended' | 'call.failed' | 'transcription.available';
  active: boolean;
  created: string;
  secret?: string;
}

const WebhooksTab: React.FC<WebhooksTabProps> = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'webhook_1',
      url: 'https://api.example.com/webhooks/calls',
      event: 'call.ended',
      active: true,
      created: '2024-06-15T14:30:00Z'
    },
    {
      id: 'webhook_2',
      url: 'https://crm.enterprise.com/api/transcriptions',
      event: 'transcription.available',
      active: true,
      created: '2024-06-10T09:15:00Z'
    }
  ]);
  
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState<Partial<Webhook>>({
    url: '',
    event: 'call.ended',
    active: true
  });
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  
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
  
  // Ajouter un nouveau webhook
  const handleAddWebhook = () => {
    if (!newWebhook.url || !newWebhook.event) return;
    
    const webhook: Webhook = {
      id: `webhook_${Date.now()}`,
      url: newWebhook.url,
      event: newWebhook.event as Webhook['event'],
      active: newWebhook.active ?? true,
      created: new Date().toISOString(),
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`
    };
    
    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ url: '', event: 'call.ended', active: true });
    setShowNewWebhookForm(false);
  };
  
  // Supprimer un webhook
  const handleDeleteWebhook = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce webhook ?')) {
      setWebhooks(webhooks.filter(hook => hook.id !== id));
    }
  };
  
  // Basculer l'état actif d'un webhook
  const toggleWebhookActive = (id: string) => {
    setWebhooks(webhooks.map(hook => 
      hook.id === id ? { ...hook, active: !hook.active } : hook
    ));
  };
  
  // Tester un webhook
  const testWebhook = (webhookUrl: string) => {
    setIsTestingWebhook(true);
    setTestResult(null);
    
    console.log(`Tentative d'envoi d'un test POST vers ${webhookUrl}...`);
    
    // Simuler un appel API pour tester le webhook
    setTimeout(() => {
      // Simuler une réponse aléatoire (succès ou échec)
      const success = Math.random() > 0.3;
      
      setTestResult({
        success,
        message: success 
          ? `Webhook testé avec succès à ${webhookUrl}. Statut: 200 OK` 
          : `Échec du test à ${webhookUrl}. Erreur: Le serveur a répondu avec le code 404`
      });
      
      setIsTestingWebhook(false);
    }, 2000);
  };

  // Libellés pour les événements de webhook
  const eventLabels: Record<string, string> = {
    'call.started': 'Appel commencé',
    'call.ended': 'Appel terminé',
    'call.failed': 'Appel échoué',
    'transcription.available': 'Transcription disponible'
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <Flex justifyContent="between" alignItems="center" className="mb-6">
          <div>
            <Title>Webhooks</Title>
            <Text className="mt-2">
              Configurez des webhooks pour être notifié des événements liés à votre assistant
            </Text>
          </div>
          <Button 
            icon={PlusIcon} 
            variant="primary"
            onClick={() => setShowNewWebhookForm(true)}
            disabled={showNewWebhookForm}
          >
            Ajouter un webhook
          </Button>
        </Flex>
        
        {showNewWebhookForm && (
          <Card className="mb-6 bg-gray-50">
            <Title className="text-base mb-4">Nouveau webhook</Title>
            
            <div className="space-y-4">
              <div>
                <Text className="mb-2">URL du webhook</Text>
                <TextInput 
                  placeholder="https://example.com/webhook" 
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                />
              </div>
              
              <div>
                <Text className="mb-2">Événement déclencheur</Text>
                <Select 
                  value={newWebhook.event} 
                  onValueChange={(value) => setNewWebhook({...newWebhook, event: value as Webhook['event']})}
                >
                  <SelectItem value="call.started">Appel commencé</SelectItem>
                  <SelectItem value="call.ended">Appel terminé</SelectItem>
                  <SelectItem value="call.failed">Appel échoué</SelectItem>
                  <SelectItem value="transcription.available">Transcription disponible</SelectItem>
                </Select>
              </div>
              
              <div>
                <Flex alignItems="center" className="gap-2">
                  <Switch 
                    checked={newWebhook.active ?? true}
                    onChange={() => setNewWebhook({...newWebhook, active: !newWebhook.active})}
                  />
                  <Text>Actif</Text>
                </Flex>
              </div>
              
              <Flex justifyContent="end" className="gap-2 pt-4">
                <Button 
                  variant="secondary"
                  onClick={() => setShowNewWebhookForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleAddWebhook}
                  disabled={!newWebhook.url}
                >
                  Ajouter
                </Button>
              </Flex>
            </div>
          </Card>
        )}
        
        {testResult && (
          <Card 
            className={`mb-6 ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <Flex alignItems="center" className="gap-2">
              {testResult.success 
                ? <CheckIcon className="h-5 w-5 text-green-500" /> 
                : <XMarkIcon className="h-5 w-5 text-red-500" />
              }
              <Text className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                {testResult.message}
              </Text>
            </Flex>
          </Card>
        )}
        
        <Card>
          {webhooks.length === 0 ? (
            <div className="text-center py-12">
              <CodeBracketIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <Title className="text-gray-500 mb-2">Aucun webhook configuré</Title>
              <Text className="text-gray-400">
                Les webhooks vous permettent d&apos;être notifié des événements de votre assistant
              </Text>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>URL</TableHeaderCell>
                  <TableHeaderCell>Événement</TableHeaderCell>
                  <TableHeaderCell>Créé le</TableHeaderCell>
                  <TableHeaderCell>Statut</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="truncate max-w-md">
                      <Text className="truncate">{webhook.url}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge color="blue" size="sm">
                        {eventLabels[webhook.event] || webhook.event}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(webhook.created)}</TableCell>
                    <TableCell>
                      <Flex alignItems="center" className="gap-2">
                        <Switch 
                          checked={webhook.active}
                          onChange={() => toggleWebhookActive(webhook.id)}
                        />
                        <Text>{webhook.active ? 'Actif' : 'Inactif'}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell>
                      <Flex className="gap-2">
                        <Button 
                          size="xs" 
                          variant="light"
                          onClick={() => testWebhook(webhook.url)}
                          disabled={isTestingWebhook}
                          tooltip="Tester le webhook"
                        >
                          {isTestingWebhook ? 'Test en cours...' : 'Tester'}
                        </Button>
                        <Button 
                          size="xs" 
                          variant="light" 
                          color="red"
                          icon={TrashIcon}
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          tooltip="Supprimer"
                        />
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Card>
      
      <Card>
        <Flex alignItems="center" className="mb-4">
          <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-2" />
          <Title className="text-base">Informations sur les webhooks</Title>
        </Flex>
        
        <Text>
          Les webhooks permettent à votre application de recevoir des notifications en temps réel
          lorsque des événements se produisent avec votre assistant vocal.
        </Text>
        
        <Divider className="my-4" />
        
        <Grid numItems={1} numItemsMd={2} className="gap-4">
          <Col>
            <Title className="text-sm mb-2">Format de la charge utile</Title>
            <Card className="bg-gray-50 p-3">
              <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
{`{
  "event": "call.ended",
  "timestamp": "2024-07-07T15:30:45Z",
  "assistant_id": "asst_abc123",
  "data": {
    "call_id": "call_xyz789",
    "duration": 127,
    "from": "+33612345678",
    "status": "completed"
  }
}`}
              </pre>
            </Card>
          </Col>
          <Col>
            <Title className="text-sm mb-2">Types d&apos;événements disponibles</Title>
            <div className="space-y-2">
              <Card className="p-3">
                <Text className="font-medium">call.started</Text>
                <Text className="text-sm text-gray-500">Déclenché lorsqu&apos;un appel commence</Text>
              </Card>
              <Card className="p-3">
                <Text className="font-medium">call.ended</Text>
                <Text className="text-sm text-gray-500">Déclenché lorsqu&apos;un appel se termine</Text>
              </Card>
              <Card className="p-3">
                <Text className="font-medium">transcription.available</Text>
                <Text className="text-sm text-gray-500">Déclenché lorsqu&apos;une transcription est disponible</Text>
              </Card>
            </div>
          </Col>
        </Grid>
      </Card>
    </div>
  );
};

export default WebhooksTab; 