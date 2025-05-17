-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table phone_numbers
CREATE TABLE public.phone_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_phone_number_id TEXT UNIQUE,
    phone_number TEXT NOT NULL,
    friendly_name TEXT,
    provider TEXT NOT NULL,
    country TEXT NOT NULL,
    capabilities TEXT[] NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    assistant_id UUID REFERENCES public.assistants(id) ON DELETE SET NULL,
    workflow_id TEXT, -- Si des workflows sont implémentés ultérieurement
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id ON public.phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_vapi_phone_number_id ON public.phone_numbers(vapi_phone_number_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_assistant_id ON public.phone_numbers(assistant_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_active ON public.phone_numbers(active);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER phone_numbers_updated_at_trigger
BEFORE UPDATE ON public.phone_numbers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.phone_numbers IS 'Table pour stocker les numéros de téléphone provisionnés, liés aux utilisateurs et potentiellement aux assistants.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres numéros de téléphone
CREATE POLICY "Users can view their own phone numbers" 
ON public.phone_numbers FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des numéros de téléphone pour eux-mêmes
CREATE POLICY "Users can create their own phone numbers" 
ON public.phone_numbers FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres numéros de téléphone
CREATE POLICY "Users can update their own phone numbers" 
ON public.phone_numbers FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres numéros de téléphone
CREATE POLICY "Users can delete their own phone numbers" 
ON public.phone_numbers FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 