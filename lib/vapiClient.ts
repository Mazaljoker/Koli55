import Vapi from '@vapi-ai/web';

// Types
export interface VapiClientConfig {
  publicKey: string;
}

export interface AssistantOverrides {
  recordingEnabled?: boolean;
  variableValues?: Record<string, string>;
  transcriber?: {
    provider?: string;
    model?: string;
    language?: string;
  };
  voice?: {
    provider?: string;
    voiceId?: string;
  };
  model?: {
    provider?: string;
    model?: string;
  };
}

// Classe wrapper pour le SDK client Vapi
class VapiClientWrapper {
  private vapi: any;
  private isInitialized: boolean = false;

  constructor() {
    this.vapi = null;
  }

  // Initialiser le client avec la clé publique
  initialize(config: VapiClientConfig): void {
    if (this.isInitialized) {
      console.warn('VapiClient est déjà initialisé');
      return;
    }

    this.vapi = new Vapi(config.publicKey);
    this.isInitialized = true;
  }

  // Démarrer un appel avec un assistant
  async startCall(assistantId: string, overrides?: AssistantOverrides): Promise<any> {
    this.ensureInitialized();
    try {
      const call = await this.vapi.start(assistantId, overrides);
      return call;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'appel:', error);
      throw error;
    }
  }

  // Envoyer un message pendant l'appel
  sendMessage(role: 'system' | 'user' | 'assistant' | 'tool' | 'function', content: string): void {
    this.ensureInitialized();
    this.vapi.send({
      type: 'add-message',
      message: {
        role,
        content,
      },
    });
  }

  // Arrêter l'appel en cours
  stopCall(): void {
    this.ensureInitialized();
    this.vapi.stop();
  }

  // Vérifier si le micro est coupé
  isMuted(): boolean {
    this.ensureInitialized();
    return this.vapi.isMuted();
  }

  // Couper ou activer le micro
  setMuted(muted: boolean): void {
    this.ensureInitialized();
    this.vapi.setMuted(muted);
  }

  // Faire parler l'assistant et éventuellement terminer l'appel après
  say(message: string, endCallAfterSpoken: boolean = false): void {
    this.ensureInitialized();
    this.vapi.say(message, endCallAfterSpoken);
  }

  // S'abonner aux événements
  on(event: string, callback: (...args: any[]) => void): void {
    this.ensureInitialized();
    this.vapi.on(event, callback);
  }

  // Vérifier que le client est initialisé
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('VapiClient n\'est pas initialisé. Appelez initialize() d\'abord.');
    }
  }
}

// Exporter une instance singleton
export const vapiClient = new VapiClientWrapper(); 