/*
  # Create agents and brands tables with policies

  1. New Tables
    - `brands`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `settings` (jsonb)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `language` (text, required)
      - `voice_settings` (jsonb)
      - `script_json` (jsonb)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `custom_voice_model_url` (text)
      - `custom_voice_id` (text)
      - `prompt` (text)
      - `brand_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for user and admin access
*/

-- Create the brands table first if it doesn't exist
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create the agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  language text NOT NULL,
  voice_settings jsonb DEFAULT '{}'::jsonb,
  script_json jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  custom_voice_model_url text,
  custom_voice_id text,
  prompt text,
  brand_id uuid REFERENCES brands(id),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Users can create their own agents
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can create agents'
  ) THEN
    CREATE POLICY "Users can create agents"
      ON agents
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can read their own agents
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can read own agents'
  ) THEN
    CREATE POLICY "Users can read own agents"
      ON agents
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Users can update their own agents
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can update own agents'
  ) THEN
    CREATE POLICY "Users can update own agents"
      ON agents
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Users can delete their own agents
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can delete own agents'
  ) THEN
    CREATE POLICY "Users can delete own agents"
      ON agents
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Admins can manage agents for their brand
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Admins can manage brand agents'
  ) THEN
    CREATE POLICY "Admins can manage brand agents"
      ON agents
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE users.id = auth.uid()
          AND (users.raw_app_meta_data->>'role')::text = 'admin'
          AND (users.raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE users.id = auth.uid()
          AND (users.raw_app_meta_data->>'role')::text = 'admin'
          AND (users.raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
        )
      );
  END IF;
END $$;

-- Create or replace the function for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;

-- Create the triggers
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();