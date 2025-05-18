/*
  # Add constraints to agents table

  This migration adds constraints to ensure data integrity for agent configurations.

  1. Changes
    - Add NOT NULL constraints to required fields
    - Add CHECK constraints for numeric fields
    - Add validation for language codes
    - Add validation for provider values
    - Add validation for voice settings JSON structure

  2. Security
    - No changes to RLS policies
*/

-- Add constraints to existing columns
ALTER TABLE agents
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN prompt SET NOT NULL,
  ALTER COLUMN provider SET NOT NULL,
  ALTER COLUMN model SET NOT NULL,
  ALTER COLUMN temperature SET NOT NULL,
  ALTER COLUMN max_tokens SET NOT NULL,
  ALTER COLUMN language SET NOT NULL,
  ALTER COLUMN voice_settings SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE agents
  ADD CONSTRAINT temperature_range 
    CHECK (temperature >= 0 AND temperature <= 1),
  ADD CONSTRAINT max_tokens_range 
    CHECK (max_tokens > 0 AND max_tokens <= 2000),
  ADD CONSTRAINT valid_provider 
    CHECK (provider IN ('openai', 'anthropic', 'cohere')),
  ADD CONSTRAINT valid_language 
    CHECK (language ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  ADD CONSTRAINT valid_voice_settings 
    CHECK (
      voice_settings ? 'engine' AND 
      voice_settings ? 'language' AND 
      voice_settings ? 'voice'
    );