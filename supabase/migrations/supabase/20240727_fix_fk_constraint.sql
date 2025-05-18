-- Migration pour résoudre le problème de la contrainte de clé étrangère
-- Date: 2024-07-27

-- 1. Identifier les enregistrements problématiques
SELECT id, user_id 
FROM public.assistants 
WHERE user_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = assistants.user_id
  );

-- 2. Mettre à NULL les user_id qui n'existent pas dans auth.users
UPDATE public.assistants
SET user_id = NULL
WHERE user_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = assistants.user_id
  );

-- 3. Ajouter la contrainte de clé étrangère avec NULL autorisé
ALTER TABLE public.assistants 
  DROP CONSTRAINT IF EXISTS assistants_user_id_fkey;

ALTER TABLE public.assistants ADD CONSTRAINT assistants_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Vérifier que la contrainte est bien appliquée
SELECT 
  con.conname AS constraint_name, 
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM 
  pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE 
  rel.relname = 'assistants'
  AND nsp.nspname = 'public'
  AND con.contype = 'f';

-- 5. Ajouter des métadonnées pour les assistants sans propriétaire
UPDATE public.assistants
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{ownership_status}',
  '"orphaned"'
)
WHERE user_id IS NULL; 