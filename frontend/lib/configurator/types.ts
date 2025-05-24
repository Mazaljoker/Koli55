// Types pour le configurateur AlloKoli
export interface RestaurantConfig {
  name: string;
  cuisine_type: string;
  services: string[];
  hours: Record<string, string>;
  specialties: string[];
}

export interface AssistantConfig {
  name: string;
  greeting: string;
  capabilities: string[];
  voice_settings: {
    tone: string;
    language: string;
  };
}

export interface ConfiguratorResult {
  restaurant: RestaurantConfig;
  assistant_config: AssistantConfig;
}

export interface VapiGlobConfig {
  perlinTime: number;
  perlinDNoise: number;
  chromaRGBr: number;
  chromaRGBg: number;
  chromaRGBb: number;
  chromaRGBn: number;
  chromaRGBm: number;
  sphereWireframe: boolean;
  spherePoints: boolean;
  spherePsize: number;
  cameraSpeedY: number;
  cameraSpeedX: number;
  cameraZoom: number;
  cameraGuide: boolean;
  perlinMorph: number;
}
