import { VapiClient } from '@vapi-ai/server-sdk';

// Types
export interface VapiServerConfig {
  token: string;
}

// Classe wrapper pour le SDK serveur Vapi
class VapiServerClientWrapper {
  private client: any;
  private isInitialized: boolean = false;

  constructor() {
    this.client = null;
  }

  // Initialiser le client avec le token d'API
  initialize(config: VapiServerConfig): void {
    if (this.isInitialized) {
      console.warn('VapiServerClient est déjà initialisé');
      return;
    }

    this.client = new VapiClient({ token: config.token });
    this.isInitialized = true;
  }

  // Getter pour accéder directement aux APIs de Vapi
  get assistants() {
    this.ensureInitialized();
    return this.client.assistants;
  }

  get calls() {
    this.ensureInitialized();
    return this.client.calls;
  }

  get phoneNumbers() {
    this.ensureInitialized();
    return this.client.phoneNumbers;
  }

  get knowledgeBases() {
    this.ensureInitialized();
    return this.client.knowledgeBases;
  }

  get workflows() {
    this.ensureInitialized();
    return this.client.workflows;
  }

  // Vérifier que le client est initialisé
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('VapiServerClient n\'est pas initialisé. Appelez initialize() d\'abord.');
    }
  }
}

// Exporter une instance singleton
export const vapiServerClient = new VapiServerClientWrapper(); 