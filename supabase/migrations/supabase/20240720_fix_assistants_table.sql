-- Migration pour mettre à jour la table assistants en ajoutant des champs manquants
-- et en créant des alias pour les champs existants

-- Ajouter les champs manquants un par un avec des vérifications
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS silence_timeout_seconds INTEGER;
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS max_duration_seconds INTEGER;
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS end_call_after_silence BOOLEAN;
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS voice_reflection BOOLEAN;
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS recording_settings JSONB;
ALTER TABLE IF EXISTS assistants ADD COLUMN IF NOT EXISTS forwarding_phone_number TEXT;

-- Désactiver temporairement le trigger s'il existe
DROP TRIGGER IF EXISTS assistant_field_mapping ON assistants;

-- Créer une vue pour les tests qui s'attendent à des noms de champs en camelCase
DROP VIEW IF EXISTS assistants_api_view;
CREATE VIEW assistants_api_view AS
SELECT
  id,
  user_id,
  vapi_assistant_id,
  name,
  model_provider,
  model_name,
  model_temperature,
  model_max_tokens,
  voice,
  language,
  system_prompt AS "instructions",
  first_message AS "firstMessage",
  tools_config,
  knowledge_base_ids,
  forwarding_phone_number,
  end_call_message,
  end_call_phrases,
  metadata,
  silence_timeout_seconds AS "silenceTimeoutSeconds",
  max_duration_seconds AS "maxDurationSeconds",
  end_call_after_silence AS "endCallAfterSilence",
  voice_reflection AS "voiceReflection",
  recording_settings AS "recordingSettings",
  created_at,
  updated_at,
  model
FROM assistants;

-- Cette fonction est OPTIONNELLE et peut être activée manuellement si nécessaire
-- Plus tard, après avoir confirmé que tout fonctionne
-- Créer une fonction pour faciliter la conversion entre camelCase et snake_case
CREATE OR REPLACE FUNCTION map_assistant_fields() RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier les champs avec des noms camelCase en utilisant des guillemets doubles
  -- pour préserver la sensibilité à la casse
  
  -- firstMessage => first_message
  IF NEW."firstMessage" IS NOT NULL THEN
    NEW.first_message := NEW."firstMessage";
  END IF;
  
  -- instructions => system_prompt
  IF NEW."instructions" IS NOT NULL THEN
    NEW.system_prompt := NEW."instructions";
  END IF;
  
  -- silenceTimeoutSeconds => silence_timeout_seconds
  IF NEW."silenceTimeoutSeconds" IS NOT NULL THEN
    NEW.silence_timeout_seconds := NEW."silenceTimeoutSeconds";
  END IF;
  
  -- maxDurationSeconds => max_duration_seconds
  IF NEW."maxDurationSeconds" IS NOT NULL THEN
    NEW.max_duration_seconds := NEW."maxDurationSeconds";
  END IF;
  
  -- endCallAfterSilence => end_call_after_silence
  IF NEW."endCallAfterSilence" IS NOT NULL THEN
    NEW.end_call_after_silence := NEW."endCallAfterSilence";
  END IF;
  
  -- voiceReflection => voice_reflection
  IF NEW."voiceReflection" IS NOT NULL THEN
    NEW.voice_reflection := NEW."voiceReflection";
  END IF;
  
  -- recordingSettings => recording_settings
  IF NEW."recordingSettings" IS NOT NULL THEN
    NEW.recording_settings := NEW."recordingSettings";
  END IF;
  
  -- En complément, vérifiez si d'autres variantes en camelCase existent
  IF NEW."vapi_api_key" IS NOT NULL THEN
    -- Cette colonne n'existe pas dans la table mais peut être dans le corps de la requête
    -- Nous l'ignorons car elle est traitée par le code serveur
  END IF;
  
  -- Mappage supplémentaire pour les champs du modèle
  IF NEW.model IS NULL AND (NEW.model_provider IS NOT NULL OR NEW.model_name IS NOT NULL) THEN
    NEW.model := jsonb_build_object(
      'provider', COALESCE(NEW.model_provider, 'openai'),
      'model', COALESCE(NEW.model_name, 'gpt-4o')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- NOTE: Nous ne créons pas de trigger pour le moment, il sera créé manuellement si nécessaire
-- CREATE TRIGGER assistant_field_mapping
-- BEFORE INSERT OR UPDATE ON assistants
-- FOR EACH ROW
-- EXECUTE FUNCTION map_assistant_fields(); 