/*
  # Update agents table RLS policies

  1. Changes
    - Simplify and consolidate RLS policies for the agents table
    - Add policy for authenticated users to read all agents
    - Maintain existing policies for user-specific operations

  2. Security
    - Enable RLS on agents table (already enabled)
    - Add new policy for read access
    - Keep existing policies for other operations
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can read own agents" ON agents;
DROP POLICY IF EXISTS "agent_select_policy_v5" ON agents;

-- Add new simplified read policy for authenticated users
CREATE POLICY "Users can read all agents"
ON agents
FOR SELECT
TO authenticated
USING (true);

-- Note: Keeping other existing policies for insert/update/delete operations
-- as they correctly handle user-specific permissions