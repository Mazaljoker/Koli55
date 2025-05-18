-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table test_suite_tests
CREATE TABLE public.test_suite_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_test_id TEXT UNIQUE,
    test_suite_id UUID REFERENCES public.test_suites(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    input TEXT NOT NULL, -- Ce qui sera envoyé à l'assistant
    expected_output TEXT NOT NULL, -- Ce que l'assistant devrait répondre
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_test_suite_tests_user_id ON public.test_suite_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_tests_vapi_test_id ON public.test_suite_tests(vapi_test_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_tests_test_suite_id ON public.test_suite_tests(test_suite_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER test_suite_tests_updated_at_trigger
BEFORE UPDATE ON public.test_suite_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.test_suite_tests ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.test_suite_tests IS 'Table pour stocker les tests individuels appartenant à des suites de tests.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres tests
CREATE POLICY "Users can view their own test suite tests" 
ON public.test_suite_tests FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des tests pour eux-mêmes
CREATE POLICY "Users can create their own test suite tests" 
ON public.test_suite_tests FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres tests
CREATE POLICY "Users can update their own test suite tests" 
ON public.test_suite_tests FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres tests
CREATE POLICY "Users can delete their own test suite tests" 
ON public.test_suite_tests FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 