-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table test_suite_runs
CREATE TABLE public.test_suite_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_run_id TEXT UNIQUE,
    test_suite_id UUID REFERENCES public.test_suites(id) ON DELETE SET NULL NOT NULL,
    status TEXT NOT NULL, -- 'pending', 'running', 'completed', 'failed', etc.
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    total_tests INTEGER NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    failed_tests INTEGER NOT NULL DEFAULT 0,
    skipped_tests INTEGER NOT NULL DEFAULT 0,
    average_score NUMERIC,
    results JSONB, -- Résultats détaillés pour chaque test
    error_message TEXT,
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_test_suite_runs_user_id ON public.test_suite_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_runs_vapi_run_id ON public.test_suite_runs(vapi_run_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_runs_test_suite_id ON public.test_suite_runs(test_suite_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_runs_status ON public.test_suite_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_suite_runs_start_time ON public.test_suite_runs(start_time);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER test_suite_runs_updated_at_trigger
BEFORE UPDATE ON public.test_suite_runs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.test_suite_runs ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.test_suite_runs IS 'Table pour stocker les exécutions des suites de tests et leurs résultats.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres exécutions de tests
CREATE POLICY "Users can view their own test suite runs" 
ON public.test_suite_runs FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des exécutions de tests pour eux-mêmes
CREATE POLICY "Users can create their own test suite runs" 
ON public.test_suite_runs FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres exécutions de tests
CREATE POLICY "Users can update their own test suite runs" 
ON public.test_suite_runs FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres exécutions de tests
CREATE POLICY "Users can delete their own test suite runs" 
ON public.test_suite_runs FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 