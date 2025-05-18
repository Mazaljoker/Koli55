import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { validateAgentConfig, type AgentConfig } from '../lib/agentValidation';

interface UseAgentStorageReturn {
  saveAgent: (config: AgentConfig, currentId?: string) => Promise<{ success: boolean; error?: string }>;
  loadAgent: (id: string) => Promise<{ data?: AgentConfig; error?: string }>;
  isSaving: boolean;
  isLoading: boolean;
}

export function useAgentStorage(): UseAgentStorageReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveAgent = useCallback(async (config: AgentConfig, currentId?: string) => {
    setIsSaving(true);
    try {
      // Validate configuration
      const validation = validateAgentConfig(config);
      if (!validation.success) {
        throw new Error(validation.errors?.join(', '));
      }

      // Check if an agent with this name already exists
      const { data: existingAgents, error: searchError } = await supabase
        .from('agents')
        .select('id, name')
        .eq('name', config.name);

      if (searchError) {
        throw searchError;
      }

      // If we found existing agents with this name
      if (existingAgents && existingAgents.length > 0) {
        // If we're updating an agent and the name hasn't changed
        if (currentId && existingAgents.some(agent => agent.id === currentId)) {
          const { error } = await supabase
            .from('agents')
            .update(config)
            .eq('id', currentId);

          if (error) throw error;
          return { success: true };
        }
        // If the name exists but it's not the current agent
        else {
          return {
            success: false,
            error: 'Un assistant avec ce nom existe déjà'
          };
        }
      }
      
      // If no agent exists with this name, create a new one
      const { error } = await supabase
        .from('agents')
        .insert([config]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error saving agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadAgent = useCallback(async (id: string) => {
    if (!id) {
      return { error: 'ID non fourni' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error loading agent:', error);
      return {
        error: error instanceof Error ? error.message : 'Une erreur est survenue'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveAgent,
    loadAgent,
    isSaving,
    isLoading
  };
}