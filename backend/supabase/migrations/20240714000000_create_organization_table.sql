-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table organization
CREATE TABLE public.organization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire/administrateur
    vapi_organization_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    webhook_url TEXT, -- URL de webhook global pour l'organisation
    trusted_origins TEXT[], -- Origines autorisées pour les requêtes CORS
    limits JSONB, -- Limites imposées à l'organisation
    usage_stats JSONB, -- Statistiques d'utilisation
    billing_info JSONB, -- Informations de facturation
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_organization_user_id ON public.organization(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_vapi_organization_id ON public.organization(vapi_organization_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER organization_updated_at_trigger
BEFORE UPDATE ON public.organization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.organization IS 'Table pour stocker les informations relatives à l''organisation de l''utilisateur.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leur propre organisation
CREATE POLICY "Users can view their own organization" 
ON public.organization FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer leur propre organisation
CREATE POLICY "Users can create their own organization" 
ON public.organization FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leur propre organisation
CREATE POLICY "Users can update their own organization" 
ON public.organization FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leur propre organisation
CREATE POLICY "Users can delete their own organization" 
ON public.organization FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 