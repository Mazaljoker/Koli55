/*
  # Fix agents table RLS policies

  1. Changes
    - Update RLS policies for the agents table to properly handle user access
    - Add policies for authenticated users to read agents they own or belong to their brand
    
  2. Security
    - Enable RLS on agents table (already enabled)
    - Add policy for authenticated users to read agents they own
    - Add policy for admin users to read agents in their brand
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON agents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON agents;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON agents;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON agents;

-- Create new policies
CREATE POLICY "Users can read own agents"
  ON agents
  FOR SELECT
  TO authenticated
  USING (
    -- User owns the agent
    (auth.uid() = user_id)
    OR 
    -- User is an admin and agent belongs to their brand
    (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE 
          id = auth.uid() 
          AND (raw_app_meta_data->>'role')::text = 'admin'
          AND (raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
      )
    )
  );

CREATE POLICY "Users can insert own agents"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE 
        id = auth.uid() 
        AND (raw_app_meta_data->>'role')::text = 'admin'
        AND (raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
    )
  );

CREATE POLICY "Users can update own agents"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE 
        id = auth.uid() 
        AND (raw_app_meta_data->>'role')::text = 'admin'
        AND (raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE 
        id = auth.uid() 
        AND (raw_app_meta_data->>'role')::text = 'admin'
        AND (raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
    )
  );

CREATE POLICY "Users can delete own agents"
  ON agents
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE 
        id = auth.uid() 
        AND (raw_app_meta_data->>'role')::text = 'admin'
        AND (raw_app_meta_data->>'brand_id')::uuid = agents.brand_id
    )
  );