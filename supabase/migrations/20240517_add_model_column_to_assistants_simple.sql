-- Ajout de la colonne model à la table assistants (migration du 17/05/2024)
ALTER TABLE IF EXISTS public.assistants 
ADD COLUMN IF NOT EXISTS model JSONB; 