/*
  # Update agents and brands tables with policies

  1. Tables
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
    - Update triggers for timestamp management
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

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create agents" ON agents;
DROP POLICY IF EXISTS "Users can read own agents" ON agents;
DROP POLICY IF EXISTS "Users can update own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete own agents" ON agents;
DROP POLICY IF EXISTS "Admins can manage brand agents" ON agents;
DROP POLICY IF EXISTS "agent_delete_policy_v5" ON agents;
DROP POLICY IF EXISTS "agent_insert_policy_v5" ON agents;
DROP POLICY IF EXISTS "agent_select_policy_v5" ON agents;
DROP POLICY IF EXISTS "agent_update_policy_v5" ON agents;

-- Create new unified policies for agents table
CREATE POLICY "Enable read access for authenticated users"
  ON agents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on user_id"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE users.id = auth.uid()
        AND (users.raw_app_meta_data->>'role')::text = 'admin'
        AND (users.raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
      )
    )
  );

CREATE POLICY "Enable delete for users based on user_id"
  ON agents
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE users.id = auth.uid()
        AND (users.raw_app_meta_data->>'role')::text = 'admin'
        AND (users.raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
      )
    )
  );

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

-- Create or replace function to set user_id on agent creation
CREATE OR REPLACE FUNCTION set_agent_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically set user_id if it doesn't exist
DO $$
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_agent_user_id_trigger'
  ) INTO trigger_exists;

  IF NOT trigger_exists THEN
    CREATE TRIGGER set_agent_user_id_trigger
      BEFORE INSERT ON agents
      FOR EACH ROW
      EXECUTE FUNCTION set_agent_user_id();
  END IF;
END $$;