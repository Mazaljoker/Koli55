import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bot, Pin, Mic, Volume2, 
  PenTool as Tool, BarChart, Settings, Plus, ChevronDown, ChevronUp, 
  HelpCircle, Info, Save, Trash2, Loader, MessageSquare
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { validateAgentConfig } from './lib/agentValidation';
import { useAgentStorage } from './hooks/useAgentStorage';
import SaveFeedback from './components/SaveFeedback';
import Accordion from './components/Accordion';
import Toggle from './components/Toggle';
import TranscriptionSection from './components/TranscriptionSection';
import TestSuite from './components/TestSuite';
import AgentTalk from './components/AgentTalk';

const agentTemplates = {
  customerService: {
    name: "Assistant Service Client",
    firstMessage: "Bonjour, je suis votre assistant du service client. Comment puis-je vous aider aujourd'hui ?",
    systemPrompt: "Vous êtes un assistant de service client professionnel, empathique et efficace. Votre objectif est d'aider les clients à résoudre leurs problèmes et répondre à leurs questions.",
    temperature: 0.7,
    maxTokens: 300,
    provider: "openai",
    model: "gpt-4",
    language: "fr",
    voiceSettings: {
      engine: "neural",
      language: "fr-FR",
      voice: "claire"
    }
  },
  salesAgent: {
    name: "Assistant Commercial",
    firstMessage: "Bonjour, je suis votre conseiller commercial. Je peux vous aider à trouver les meilleures solutions pour vos besoins.",
    systemPrompt: "Vous êtes un assistant commercial expérimenté. Votre rôle est de comprendre les besoins des clients et de proposer les solutions les plus adaptées.",
    temperature: 0.8,
    maxTokens: 350,
    provider: "openai",
    model: "gpt-4",
    language: "fr",
    voiceSettings: {
      engine: "neural",
      language: "fr-FR",
      voice: "thomas"
    }
  },
  technicalSupport: {
    name: "Support Technique",
    firstMessage: "Bonjour, je suis votre assistant technique. Je suis là pour vous aider à résoudre vos problèmes techniques.",
    systemPrompt: "Vous êtes un expert technique. Votre mission est d'aider les utilisateurs à résoudre leurs problèmes techniques de manière claire et efficace.",
    temperature: 0.5,
    maxTokens: 400,
    provider: "openai",
    model: "gpt-4",
    language: "fr",
    voiceSettings: {
      engine: "neural",
      language: "fr-FR",
      voice: "marc"
    }
  }
};

function AgentWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('model');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{
    status: 'success' | 'error' | 'saving' | null;
    message?: string;
  }>({ status: null });
  
  const { saveAgent, loadAgent: loadAgentFromStorage, isSaving: isStorageSaving } = useAgentStorage();

  // Form state
  const [name, setName] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(300);
  const [language, setLanguage] = useState('fr');
  const [voiceSettings, setVoiceSettings] = useState({
    engine: 'neural',
    language: 'fr-FR',
    voice: 'claire'
  });

  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;
      
      try {
        setLoading(true);
        const result = await loadAgentFromStorage(agentId);
        
        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          setName(result.data.name || '');
          setFirstMessage(result.data.first_message || '');
          setSystemPrompt(result.data.prompt || '');
          setProvider(result.data.provider || 'openai');
          setModel(result.data.model || 'gpt-4');
          setTemperature(result.data.temperature || 0.7);
          setMaxTokens(result.data.max_tokens || 300);
          setLanguage(result.data.language || 'fr');
          setVoiceSettings(result.data.voice_settings || {
            engine: 'neural',
            language: 'fr-FR',
            voice: 'claire'
          });
        }
      } catch (error) {
        console.error('Error loading agent:', error);
        setSaveFeedback({
          status: 'error',
          message: error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [agentId, loadAgentFromStorage]);

  const handleSave = async () => {
    setSaveFeedback({ status: 'saving', message: 'Enregistrement en cours...' });

    const agentData = {
      name,
      first_message: firstMessage,
      prompt: systemPrompt,
      provider,
      model,
      temperature,
      max_tokens: maxTokens,
      language,
      voice_settings: voiceSettings,
      active: true
    };

    // Validate configuration
    const validation = validateAgentConfig(agentData);
    if (!validation.success) {
      setSaveFeedback({
        status: 'error',
        message: `Erreur de validation: ${validation.errors?.join(', ')}`
      });
      return;
    }

    try {
      const result = await saveAgent(agentData, agentId);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setSaveFeedback({
        status: 'success',
        message: agentId ? 'Assistant mis à jour avec succès' : 'Assistant créé avec succès'
      });

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving agent:', error);
      setSaveFeedback({
        status: 'error',
        message: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'
      });
    }
  };

  const handleDelete = async () => {
    if (!agentId || !confirm('Êtes-vous sûr de vouloir supprimer cet assistant ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;
      alert('Assistant supprimé avec succès');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const loadTemplate = (templateKey: keyof typeof agentTemplates) => {
    const template = agentTemplates[templateKey];
    setName(template.name);
    setFirstMessage(template.firstMessage);
    setSystemPrompt(template.systemPrompt);
    setTemperature(template.temperature);
    setMaxTokens(template.maxTokens);
    setProvider(template.provider);
    setModel(template.model);
    setLanguage(template.language);
    setVoiceSettings(template.voiceSettings);
  };

  const tabs = [
    { 
      id: 'model', 
      icon: Pin, 
      label: 'Modèle',
      accordionId: 'modelAccordion',
      template: 'customerService'
    },
    { 
      id: 'voice', 
      icon: Volume2, 
      label: 'Voix',
      accordionId: 'voiceAccordion',
      template: 'salesAgent'
    },
    { 
      id: 'tools', 
      icon: Tool, 
      label: 'Outils',
      accordionId: 'toolsAccordion',
      template: 'technicalSupport'
    },
    {
      id: 'talk',
      icon: MessageSquare,
      label: 'Tester',
      accordionId: 'talkAccordion'
    }
  ];

  const scrollToAccordion = (accordionId: string) => {
    const element = document.getElementById(accordionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#435175]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefffe] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-[#e9ecef] p-4 flex flex-col">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-[#435175] hover:text-[#5b6a91] mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Retour
        </button>

        <div className="flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'assistant
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#e9ecef] p-2 focus:outline-none focus:ring-2 focus:ring-[#435175]"
              placeholder="Entrez un nom..."
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => loadTemplate('customerService')}
              className="w-full p-3 text-left rounded-lg hover:bg-[#f7f9fb] transition-colors"
            >
              <div className="font-medium text-[#141616]">Service Client</div>
              <div className="text-sm text-gray-500">Assistant pour le support client</div>
            </button>

            <button
              onClick={() => loadTemplate('salesAgent')}
              className="w-full p-3 text-left rounded-lg hover:bg-[#f7f9fb] transition-colors"
            >
              <div className="font-medium text-[#141616]">Commercial</div>
              <div className="text-sm text-gray-500">Assistant pour les ventes</div>
            </button>

            <button
              onClick={() => loadTemplate('technicalSupport')}
              className="w-full p-3 text-left rounded-lg hover:bg-[#f7f9fb] transition-colors"
            >
              <div className="font-medium text-[#141616]">Support Technique</div>
              <div className="text-sm text-gray-500">Assistant pour l'aide technique</div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#e9ecef] p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#141616]">
                {agentId ? 'Modifier l\'assistant' : 'Nouvel assistant'}
              </h1>
              {agentId && (
                <div className="text-sm text-gray-500">ID: {agentId}</div>
              )}
            </div>

            {/* Tabs and Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      scrollToAccordion(tab.accordionId);
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#f7f9fb] text-[#435175]'
                        : 'text-[#141616] hover:bg-[#f7f9fb]'
                    }`}
                  >
                    <tab.icon size={20} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg bg-[#435175] text-white hover:bg-[#5b6a91] flex items-center ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save size={20} className="mr-2" />
                  )}
                  <span>{agentId ? 'Enregistrer' : 'Créer'}</span>
                </button>

                {agentId && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center"
                  >
                    <Trash2 size={20} className="mr-2" />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Configuration Sections */}
            <div className="bg-white rounded-lg border border-[#e9ecef] p-6">
              {activeTab === 'talk' ? (
                <AgentTalk
                  agentName={name}
                  systemPrompt={systemPrompt}
                  firstMessage={firstMessage}
                />
              ) : (
                <>
                  <Accordion 
                    title="Modèle" 
                    subtitle="Configuration du comportement de l'assistant"
                    id="modelAccordion"
                    defaultOpen={activeTab === 'model'}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message d'accueil
                        </label>
                        <input
                          type="text"
                          value={firstMessage}
                          onChange={(e) => setFirstMessage(e.target.value)}
                          className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          placeholder="Message initial de l'assistant..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prompt système
                        </label>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          rows={6}
                          className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          placeholder="Instructions pour définir le comportement de l'assistant..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fournisseur
                          </label>
                          <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="cohere">Cohere</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modèle
                          </label>
                          <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          >
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Langue
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Température
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-600 w-12">{temperature}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tokens maximum
                        </label>
                        <input
                          type="number"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                          className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                        />
                      </div>
                    </div>
                  </Accordion>

                  <Accordion 
                    title="Configuration vocale" 
                    id="voiceAccordion"
                    defaultOpen={activeTab === 'voice'}
                  >
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Moteur vocal
                          </label>
                          <select
                            value={voiceSettings.engine}
                            onChange={(e) => setVoiceSettings({ ...voiceSettings, engine: e.target.value })}
                            className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          >
                            <option value="neural">Neural</option>
                            <option value="standard">Standard</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Voix
                          </label>
                          <select
                            value={voiceSettings.voice}
                            onChange={(e) => setVoiceSettings({ ...voiceSettings, voice: e.target.value })}
                            className="w-full rounded-lg border border-[#e9ecef] p-3 focus:outline-none focus:ring-2 focus:ring-[#435175]"
                          >
                            <option value="claire">Claire</option>
                            <option value="thomas">Thomas</option>
                            <option value="marc">Marc</option>
                          </select>
                        </div>
                      </div>

                      <div className="border-t border-[#e9ecef] pt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                          Tests de l'assistant
                        </h3>
                        <div className="bg-[#f7f9fb] rounded-lg p-4">
                          <TestSuite />
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion 
                    title="Outils" 
                    subtitle="Configuration des intégrations"
                    id="toolsAccordion"
                    defaultOpen={activeTab === 'tools'}
                  >
                    <div className="space-y-4">
                      <Toggle
                        label="Recherche web"
                        value={false}
                        onChange={() => {}}
                        description="Permettre à l'assistant d'effectuer des recherches web"
                      />

                      <Toggle
                        label="Intégration CRM"
                        value={false}
                        onChange={() => {}}
                        description="Connecter l'assistant à votre CRM"
                      />

                      <Toggle
                        label="Envoi d'emails"
                        value={false}
                        onChange={() => {}}
                        description="Autoriser l'assistant à envoyer des emails"
                      />
                    </div>
                  </Accordion>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Help Button */}
        <button className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600">
          <HelpCircle size={24} />
        </button>
      </div>

      {/* Add SaveFeedback component */}
      <SaveFeedback
        status={saveFeedback.status}
        message={saveFeedback.message}
        onClose={() => setSaveFeedback({ status: null })}
      />
    </div>
  );
}

export default AgentWizard;