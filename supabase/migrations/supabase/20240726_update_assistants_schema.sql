-- Migration pour mettre à jour la table assistants afin de résoudre les problèmes avec l'API Vapi
-- Date: 2024-07-26

-- Vérifier si le schéma supporte les conversions de camelCase/snake_case
DO $$
BEGIN
    -- Vérification des colonnes et ajout des colonnes manquantes si nécessaires
    
    -- 1. Vérifier end_call_after_silence
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'end_call_after_silence'
    ) THEN
        ALTER TABLE assistants ADD COLUMN end_call_after_silence BOOLEAN DEFAULT NULL;
        RAISE NOTICE 'Colonne end_call_after_silence ajoutée';
    END IF;
    
    -- 2. Vérifier voice_reflection
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'voice_reflection'
    ) THEN
        ALTER TABLE assistants ADD COLUMN voice_reflection BOOLEAN DEFAULT NULL;
        RAISE NOTICE 'Colonne voice_reflection ajoutée';
    END IF;
    
    -- 3. Vérifier recording_settings
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'recording_settings'
    ) THEN
        ALTER TABLE assistants ADD COLUMN recording_settings JSONB DEFAULT NULL;
        RAISE NOTICE 'Colonne recording_settings ajoutée';
    END IF;
    
    -- 4. Vérifier vapi_model_details
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'vapi_model_details'
    ) THEN
        ALTER TABLE assistants ADD COLUMN vapi_model_details JSONB DEFAULT NULL;
        RAISE NOTICE 'Colonne vapi_model_details ajoutée';
    END IF;
    
    -- 5. Vérifier vapi_voice_details
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'vapi_voice_details'
    ) THEN
        ALTER TABLE assistants ADD COLUMN vapi_voice_details JSONB DEFAULT NULL;
        RAISE NOTICE 'Colonne vapi_voice_details ajoutée';
    END IF;
    
    -- 6. Vérifier voicemail_message
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'assistants' AND column_name = 'voicemail_message'
    ) THEN
        ALTER TABLE assistants ADD COLUMN voicemail_message TEXT DEFAULT NULL;
        RAISE NOTICE 'Colonne voicemail_message ajoutée';
    END IF;
    
    RAISE NOTICE 'Migration de la table assistants terminée.';
END$$;

-- Mettre à jour ou créer la vue assistants_api_view
CREATE OR REPLACE VIEW assistants_api_view AS
SELECT
    id,
    user_id,
    vapi_assistant_id,
    name,
    model,
    language,
    voice,
    first_message AS "firstMessage",
    system_prompt AS "instructions",
    recording_settings AS "recordingSettings",
    forwarding_phone_number AS "forwardingPhoneNumber",
    end_call_message AS "endCallMessage",
    voicemail_message AS "voicemailMessage",
    silence_timeout_seconds AS "silenceTimeoutSeconds",
    max_duration_seconds AS "maxDurationSeconds",
    end_call_after_silence AS "endCallAfterSilence",
    voice_reflection AS "voiceReflection",
    tools_config AS "toolsConfig",
    metadata,
    created_at,
    updated_at
FROM
    assistants;

-- Ajouter un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_assistants_user_id ON assistants(user_id);
CREATE INDEX IF NOT EXISTS idx_assistants_vapi_id ON assistants(vapi_assistant_id);

-- Commenter pour référence
COMMENT ON TABLE assistants IS 'Table stockant les assistants vocaux créés par les utilisateurs';
COMMENT ON COLUMN assistants.end_call_after_silence IS 'Indique si l''appel doit être terminé après un silence (true/false)';
COMMENT ON COLUMN assistants.voice_reflection IS 'Indique si la réflexion vocale est activée (true/false)';
COMMENT ON COLUMN assistants.recording_settings IS 'Paramètres d''enregistrement de l''appel en format JSON';
COMMENT ON VIEW assistants_api_view IS 'Vue formatant les données de la table assistants pour l''API (conversion snake_case/camelCase)'; 