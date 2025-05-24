import React, { useState } from 'react';
import { Button } from 'antd';
import { Download, Copy, Deploy, Eye, EyeOff } from 'lucide-react';

interface ConfiguratorResultProps {
  generatedConfig?: any;
  isComplete?: boolean;
  onDeploy?: (config: any) => void;
  onExport?: (config: any) => void;
}

const ConfiguratorResult: React.FC<ConfiguratorResultProps> = ({
  generatedConfig,
  isComplete = false,
  onDeploy,
  onExport,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Configuration exemple pour la démonstration
  const exampleConfig = {
    restaurant: {
      name: "La Bella Vista",
      cuisine_type: "italienne",
      services: ["livraison", "plats_a_emporter", "reservations"],
      hours: {
        lundi: "11:30-14:30, 18:00-22:00",
        mardi: "11:30-14:30, 18:00-22:00",
        mercredi: "fermé",
        jeudi: "11:30-14:30, 18:00-22:00",
        vendredi: "11:30-14:30, 18:00-23:00",
        samedi: "11:30-14:30, 18:00-23:00",
        dimanche: "18:00-22:00"
      },
      specialties: [
        "Pizza Margherita au feu de bois",
        "Risotto aux champignons porcini",
        "Tiramisu maison"
      ]
    },
    assistant_config: {
      name: "Assistant La Bella Vista",
      greeting: "Bonjour et bienvenue chez La Bella Vista !",
      capabilities: ["reservations", "menu_info", "hours_info", "delivery_info"],
      voice_settings: {
        tone: "friendly",
        language: "fr-FR"
      }
    }
  };

  const config = generatedConfig || exampleConfig;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assistant-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (onExport) {
      onExport(config);
    }
  };

  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(config);
    }
  };

  if (!isComplete && !generatedConfig) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-xl">Configuration Générée</h3>
          <p className="text-gray-300 text-sm mt-1">
            Votre assistant vocal est prêt à être déployé
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outlined"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2">
              {isExpanded ? 'Masquer' : 'Voir'}
            </span>
          </Button>
        </div>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
          <h4 className="text-blue-200 font-medium mb-2">Restaurant</h4>
          <p className="text-white">{config.restaurant?.name || 'Non défini'}</p>
          <p className="text-blue-200 text-sm">
            {config.restaurant?.cuisine_type || 'Type non défini'}
          </p>
        </div>
        
        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
          <h4 className="text-green-200 font-medium mb-2">Services</h4>
          <p className="text-white">
            {config.restaurant?.services?.length || 0} services
          </p>
          <p className="text-green-200 text-sm">
            {config.restaurant?.services?.join(', ') || 'Aucun service'}
          </p>
        </div>
        
        <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
          <h4 className="text-purple-200 font-medium mb-2">Assistant</h4>
          <p className="text-white">
            {config.assistant_config?.name || 'Assistant'}
          </p>
          <p className="text-purple-200 text-sm">
            {config.assistant_config?.capabilities?.length || 0} fonctionnalités
          </p>
        </div>
      </div>

      {/* Configuration JSON */}
      {isExpanded && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Configuration JSON</h4>
            <Button
              onClick={handleCopy}
              variant="outlined"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy size={16} />
              <span className="ml-2">
                {copied ? 'Copié !' : 'Copier'}
              </span>
            </Button>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto">
            <pre className="text-gray-300 text-sm">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleExport}
          variant="outlined"
          className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
        >
          <Download size={16} />
          <span className="ml-2">Exporter JSON</span>
        </Button>
        
        <Button
          onClick={handleDeploy}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Deploy size={16} />
          <span className="ml-2">Déployer Assistant</span>
        </Button>
      </div>
    </div>
  );
};

export default ConfiguratorResult; 