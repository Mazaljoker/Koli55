'use client';

import { useState } from 'react';
import { Card, Title, Text, Button, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, Badge, TextInput, Switch, Flex, Divider, Subtitle } from '@tremor/react';
import { PlusIcon, TrashIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
}

interface WebhooksTabProps {
  assistantId: string;
}

export default function WebhooksTab({ assistantId }: WebhooksTabProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'webhook1',
      name: 'Monitoring des appels',
      url: 'https://example.com/webhooks/calls',
      events: ['call.started', 'call.ended', 'call.failed'],
      active: true,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'webhook2',
      name: 'Analytics',
      url: 'https://analytics.example.com/webhook',
      events: ['transcription.completed'],
      active: false,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key1',
      name: 'Clé principale',
      key: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleWebhookActiveToggle = (webhookId: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, active: !webhook.active } 
        : webhook
    ));
  };

  const deleteWebhook = (webhookId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce webhook ?')) {
      setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
    }
  };
  
  const copyApiKey = (keyId: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue).then(() => {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    });
  };
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Webhooks */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title>Webhooks</Title>
          <Button icon={PlusIcon} variant="secondary" size="sm">
            Ajouter un Webhook
          </Button>
        </div>
        
        <Text className="mb-4">
          Les webhooks permettent de recevoir des notifications en temps réel pour différents événements liés à cet assistant.
        </Text>
        
        {webhooks.length === 0 ? (
          <div className="py-8 text-center">
            <Text className="text-gray-500">Aucun webhook configuré pour cet assistant.</Text>
            <Button icon={PlusIcon} variant="light" className="mt-2">
              Configurer votre premier webhook
            </Button>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>URL</TableHeaderCell>
                <TableHeaderCell>Événements</TableHeaderCell>
                <TableHeaderCell>Actif</TableHeaderCell>
                <TableHeaderCell>Créé le</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <Text className="font-medium">{webhook.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Text className="text-sm truncate max-w-xs">{webhook.url}</Text>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event, index) => (
                        <Badge key={index} color="blue" size="xs">{event}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={webhook.active} 
                      onChange={() => handleWebhookActiveToggle(webhook.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Text>{formatDate(webhook.created_at)}</Text>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      icon={TrashIcon} 
                      variant="light" 
                      color="red" 
                      onClick={() => deleteWebhook(webhook.id)}
                      tooltip="Supprimer"
                      size="xs"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      
      {/* Section Clés API */}
      <Card>
        <Title className="mb-4">Clés API</Title>
        
        <Text className="mb-4">
          Les clés API vous permettent d'intégrer cet assistant à d'autres applications. Gardez ces clés confidentielles.
        </Text>
        
        <div className="divide-y divide-gray-100">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="py-4">
              <Flex justifyContent="between" alignItems="center">
                <div>
                  <Text className="font-medium">{apiKey.name}</Text>
                  <div className="flex items-center mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {apiKey.key.substring(0, 8)}************************
                    </code>
                    <Button 
                      icon={copiedKeyId === apiKey.id ? CheckIcon : ClipboardDocumentIcon} 
                      variant="light" 
                      size="xs"
                      color={copiedKeyId === apiKey.id ? "green" : "gray"}
                      onClick={() => copyApiKey(apiKey.id, apiKey.key)}
                      className="ml-2"
                    >
                      {copiedKeyId === apiKey.id ? "Copié" : "Copier"}
                    </Button>
                  </div>
                  <Text className="text-xs text-gray-500 mt-1">
                    Créé le {formatDate(apiKey.created_at)}
                    {apiKey.last_used && ` • Dernière utilisation le ${formatDate(apiKey.last_used)}`}
                  </Text>
                </div>
                <Button 
                  icon={TrashIcon} 
                  variant="light" 
                  color="red" 
                  tooltip="Supprimer cette clé"
                  size="xs"
                >
                  Supprimer
                </Button>
              </Flex>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button icon={PlusIcon} variant="secondary" size="sm">
            Générer une nouvelle clé API
          </Button>
        </div>
      </Card>
      
      {/* Section Code d'intégration */}
      <Card>
        <Title className="mb-4">Code d'Intégration</Title>
        
        <Subtitle>Exemple d'intégration Web</Subtitle>
        <div className="bg-gray-50 p-3 rounded-md mt-2 mb-4">
          <pre className="text-xs font-mono overflow-x-auto">
{`// JavaScript SDK
const client = new VapiClient('pk_live_xxxxxxxx');

// Lancer un appel avec cet assistant spécifique
client.makeCall({
  assistantId: '${assistantId}',
  phoneNumber: '+33612345678',
  variables: {
    customerName: 'Jean Dupont',
    subject: 'Demande d'information'
  }
});`}
          </pre>
        </div>
        
        <Subtitle>Endpoint API</Subtitle>
        <div className="bg-gray-50 p-3 rounded-md mt-2">
          <Text className="font-mono text-sm mb-2">POST https://api.example.com/v1/assistants/{assistantId}/call</Text>
          <pre className="text-xs font-mono overflow-x-auto">
{`{
  "phone_number": "+33612345678",
  "variables": {
    "customerName": "Jean Dupont",
    "subject": "Demande d'information"
  }
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
} 