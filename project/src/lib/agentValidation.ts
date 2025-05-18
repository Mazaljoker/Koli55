import { z } from 'zod';

// Define the schema for agent parameters
export const agentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  first_message: z.string().optional(),
  prompt: z.string().min(1, 'Le prompt système est requis'),
  provider: z.enum(['openai', 'anthropic', 'cohere']),
  model: z.string().min(1, 'Le modèle est requis'),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(1).max(2000),
  language: z.string().min(2),
  voice_settings: z.object({
    engine: z.string(),
    language: z.string(),
    voice: z.string()
  }),
  active: z.boolean().default(true)
});

export type AgentConfig = z.infer<typeof agentSchema>;

export function validateAgentConfig(config: any): { success: boolean; errors?: string[] } {
  try {
    agentSchema.parse(config);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Une erreur de validation est survenue']
    };
  }
}