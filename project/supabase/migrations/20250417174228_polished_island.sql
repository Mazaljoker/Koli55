/*
  # Fix get_policies function and RPC policies

  1. Changes
    - Drop and recreate get_policies function with correct schema
    - Add missing RLS policies for agents table if they don't exist
    
  2. Security
    - Ensure RLS is enabled on agents table
    - Add policies for authenticated users with proper checks
*/

-- Drop and recreate get_policies function
DROP FUNCTION IF EXISTS get_policies(table_name text);

CREATE OR REPLACE FUNCTION get_policies(table_name text)
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT policy_name::text
    FROM pg_policies
    WHERE tablename = table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS is enabled on agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Add policies if they don't exist
DO $$ 
BEGIN
  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Authenticated users can read agents'
  ) THEN
    CREATE POLICY "Authenticated users can read agents"
    ON agents
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  -- Check and create update policy
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

  -- Check and create delete policy
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

  -- Check and create insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'agents' 
    AND policyname = 'Users can insert own agents'
  ) THEN
    CREATE POLICY "Users can insert own agents"
    ON agents
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;