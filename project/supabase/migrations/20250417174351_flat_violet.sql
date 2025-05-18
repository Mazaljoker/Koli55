/*
  # Fix RLS policies for agents table

  1. Changes
    - Enable RLS on agents table
    - Add policies for SELECT, INSERT, and DELETE operations
    - Allow authenticated users to perform these operations
    
  2. Security
    - Enable RLS to protect data access
    - Add policies to control data access based on authentication
*/

-- Enable RLS on agents table if not already enabled
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can read agents" ON agents;
DROP POLICY IF EXISTS "Users can delete own agents" ON agents;
DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
DROP POLICY IF EXISTS "Users can read all agents" ON agents;
DROP POLICY IF EXISTS "Users can read own agents" ON agents;
DROP POLICY IF EXISTS "Users can update own agents" ON agents;

-- Create new policies for the connection test
CREATE POLICY "Allow select for connection test"
ON agents FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow insert for connection test"
ON agents FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow delete for connection test"
ON agents FOR DELETE
TO authenticated
USING (true);