// Utilitaires pour le configurateur AlloKoli
import { ConfiguratorResult } from './types';

export const exportConfiguration = (config: ConfiguratorResult): void => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ssistant-config-.json;
  a.click();
  URL.revokeObjectURL(url);
};

export const saveSession = (data: any): void => {
  localStorage.setItem('configurator-session', JSON.stringify(data));
};

export const loadSession = (): any => {
  const saved = localStorage.getItem('configurator-session');
  return saved ? JSON.parse(saved) : null;
};

export const clearSession = (): void => {
  localStorage.removeItem('configurator-session');
};
