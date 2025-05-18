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
  system_prompt AS instructions,
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