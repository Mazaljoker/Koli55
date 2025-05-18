-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table workflows
CREATE TABLE public.workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_workflow_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Stocke les étapes du workflow
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_vapi_workflow_id ON public.workflows(vapi_workflow_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER workflows_updated_at_trigger
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.workflows IS 'Table pour stocker les workflows qui définissent des séquences d''actions ou d''étapes à exécuter.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres workflows
CREATE POLICY "Users can view their own workflows" 
ON public.workflows FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des workflows pour eux-mêmes
CREATE POLICY "Users can create their own workflows" 
ON public.workflows FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres workflows
CREATE POLICY "Users can update their own workflows" 
ON public.workflows FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres workflows
CREATE POLICY "Users can delete their own workflows" 
ON public.workflows FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 