/*
  # Add fields to agents table

  1. Changes
    - Add `first_message` column for storing the agent's initial greeting
    - Add `provider` column for the AI provider (e.g., OpenAI, Anthropic)
    - Add `model` column for the specific model being used
    - Add `temperature` column for model temperature setting
    - Add `max_tokens` column for response length limit

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add first_message column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'first_message'
  ) THEN
    ALTER TABLE agents ADD COLUMN first_message text;
  END IF;

  -- Add provider column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'provider'
  ) THEN
    ALTER TABLE agents ADD COLUMN provider text;
  END IF;

  -- Add model column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'model'
  ) THEN
    ALTER TABLE agents ADD COLUMN model text;
  END IF;

  -- Add temperature column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'temperature'
  ) THEN
    ALTER TABLE agents ADD COLUMN temperature float DEFAULT 0.7;
  END IF;

  -- Add max_tokens column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' AND column_name = 'max_tokens'
  ) THEN
    ALTER TABLE agents ADD COLUMN max_tokens integer DEFAULT 300;
  END IF;
END $$;