-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table squads
CREATE TABLE public.squads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire/créateur
    vapi_squad_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    members JSONB, -- Structure contenant les membres (assistants et/ou utilisateurs) et leurs rôles
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_squads_user_id ON public.squads(user_id);
CREATE INDEX IF NOT EXISTS idx_squads_vapi_squad_id ON public.squads(vapi_squad_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER squads_updated_at_trigger
BEFORE UPDATE ON public.squads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.squads IS 'Table pour stocker les équipes (squads) qui regroupent des assistants et/ou des utilisateurs pour des collaborations.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres squads
CREATE POLICY "Users can view their own squads" 
ON public.squads FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des squads pour eux-mêmes
CREATE POLICY "Users can create their own squads" 
ON public.squads FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres squads
CREATE POLICY "Users can update their own squads" 
ON public.squads FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres squads
CREATE POLICY "Users can delete their own squads" 
ON public.squads FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 