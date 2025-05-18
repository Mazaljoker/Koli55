-- Ajout de la colonne model à la table assistants (migration du 17/05/2024)
ALTER TABLE IF EXISTS public.assistants 
ADD COLUMN IF NOT EXISTS model JSONB;

-- Création ou mise à jour des politiques RLS
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs assistants" ON public.assistants;
CREATE POLICY "Les utilisateurs peuvent lire leurs assistants" 
ON public.assistants FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs assistants" ON public.assistants;
CREATE POLICY "Les utilisateurs peuvent modifier leurs assistants" 
ON public.assistants FOR UPDATE USING (auth.uid() = user_id);

COMMENT ON COLUMN public.assistants.model IS 'Configuration du modèle LLM au format JSON'; 