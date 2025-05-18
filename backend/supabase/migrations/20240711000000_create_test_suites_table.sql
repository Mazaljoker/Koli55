-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table test_suites
CREATE TABLE public.test_suites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_test_suite_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    assistant_id UUID REFERENCES public.assistants(id) ON DELETE SET NULL,
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_test_suites_user_id ON public.test_suites(user_id);
CREATE INDEX IF NOT EXISTS idx_test_suites_vapi_test_suite_id ON public.test_suites(vapi_test_suite_id);
CREATE INDEX IF NOT EXISTS idx_test_suites_assistant_id ON public.test_suites(assistant_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER test_suites_updated_at_trigger
BEFORE UPDATE ON public.test_suites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.test_suites ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.test_suites IS 'Table pour stocker les suites de tests pour valider les performances des assistants.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres suites de tests
CREATE POLICY "Users can view their own test suites" 
ON public.test_suites FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des suites de tests pour eux-mêmes
CREATE POLICY "Users can create their own test suites" 
ON public.test_suites FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres suites de tests
CREATE POLICY "Users can update their own test suites" 
ON public.test_suites FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres suites de tests
CREATE POLICY "Users can delete their own test suites" 
ON public.test_suites FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 