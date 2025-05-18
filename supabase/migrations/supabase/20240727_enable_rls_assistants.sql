-- Migration pour activer RLS et configurer les politiques de sécurité sur la table assistants
-- Date: 2024-07-27

-- 1. Activer RLS sur la table assistants
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

-- 2. Désactiver les politiques existantes pour les recréer proprement
DROP POLICY IF EXISTS "Les utilisateurs peuvent lire leurs assistants" ON public.assistants;
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leurs assistants" ON public.assistants;

-- 3. Créer les politiques RLS selon les spécifications du roadmap

-- 3.1 Politique pour les utilisateurs standard
CREATE POLICY users_manage_own_assistants ON public.assistants
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3.2 Politique pour les administrateurs
CREATE POLICY admins_manage_all_assistants ON public.assistants
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- 3.3 Politique pour les utilisateurs de test
CREATE POLICY test_users_access_test_assistants ON public.assistants
  USING (auth.jwt() ->> 'role' = 'test' AND metadata->>'is_test' = 'true')
  WITH CHECK (auth.jwt() ->> 'role' = 'test' AND metadata->>'is_test' = 'true');

-- 4. Ajouter la contrainte de clé étrangère avec gestion des cas nulls
-- Cette contrainte est importante pour assurer l'intégrité référentielle entre les tables
-- ON DELETE CASCADE signifie que les assistants sont automatiquement supprimés quand l'utilisateur est supprimé
ALTER TABLE public.assistants 
  DROP CONSTRAINT IF EXISTS assistants_user_id_fkey;

ALTER TABLE public.assistants ADD CONSTRAINT assistants_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Accorder les permissions nécessaires sur la vue assistants_api_view
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistants_api_view TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistants_api_view TO service_role;
GRANT SELECT ON public.assistants_api_view TO anon; 