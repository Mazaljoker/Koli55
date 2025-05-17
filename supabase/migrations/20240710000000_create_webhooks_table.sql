-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table webhooks
CREATE TABLE public.webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_webhook_id TEXT UNIQUE,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- Types d'événements auxquels ce webhook est abonné
    description TEXT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    secret_key TEXT, -- Clé secrète pour la signature des webhooks
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON public.webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_vapi_webhook_id ON public.webhooks(vapi_webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_enabled ON public.webhooks(enabled);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER webhooks_updated_at_trigger
BEFORE UPDATE ON public.webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.webhooks IS 'Table pour stocker les configurations des webhooks pour recevoir des notifications d''événements.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres webhooks
CREATE POLICY "Users can view their own webhooks" 
ON public.webhooks FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des webhooks pour eux-mêmes
CREATE POLICY "Users can create their own webhooks" 
ON public.webhooks FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres webhooks
CREATE POLICY "Users can update their own webhooks" 
ON public.webhooks FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres webhooks
CREATE POLICY "Users can delete their own webhooks" 
ON public.webhooks FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 