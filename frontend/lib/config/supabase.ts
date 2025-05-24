// Configuration Supabase pour le frontend AlloKoli
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
};

// URLs des Edge Functions
export const edgeFunctionUrls = {
  vapiConfigurator: `${supabaseConfig.url}/functions/v1/vapi-configurator`,
  vapiConfiguratorWebhook: `${supabaseConfig.url}/functions/v1/vapi-configurator-webhook`,
  mcpServer: `${supabaseConfig.url}/functions/v1/mcp-server`
}; 