/*
  # Fix policies and RPC function

  1. Changes
    - Add RLS policy for agents table to allow authenticated users to read
    - Create correct get_policies function using proper column name
  
  2. Security
    - Enable RLS on agents table if not already enabled
    - Add policy for authenticated users to read agents
*/

-- Enable RLS on agents table if not already enabled
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read agents" ON agents;

-- Create new policy for reading agents
CREATE POLICY "Authenticated users can read agents"
ON agents
FOR SELECT
TO authenticated
USING (true);

-- Drop and recreate the get_policies function with correct column name
CREATE OR REPLACE FUNCTION get_policies(table_name text)
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT policyname::text
    FROM pg_policies
    WHERE tablename = table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;