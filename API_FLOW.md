# Flux API

## Création d’un assistant
1. Le frontend appelle `supabase.functions.invoke('assistants', {...})`
2. La fonction `assistants.ts` appelle l’API Vapi.ai
3. Réponse stockée dans la DB Supabase
4. Retour vers le frontend

## Appel vocal
1. Un appel arrive sur un numéro Twilio
2. Le webhook est géré dans `webhooks.ts`
3. La conversation est relayée via MCP à Vapi.ai
