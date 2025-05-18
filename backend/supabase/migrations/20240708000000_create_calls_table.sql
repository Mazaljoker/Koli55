-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table calls
CREATE TABLE public.calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_call_id TEXT UNIQUE,
    assistant_id UUID REFERENCES public.assistants(id) ON DELETE SET NULL,
    phone_number_id UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
    status TEXT NOT NULL, -- 'queued', 'in-progress', 'completed', 'failed', etc.
    duration_seconds INTEGER,
    recording_url TEXT,
    transcript TEXT,
    caller_number TEXT,
    direction TEXT, -- 'inbound', 'outbound'
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB,
    timeline JSONB, -- Chronologie détaillée de l'appel
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON public.calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_vapi_call_id ON public.calls(vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_calls_assistant_id ON public.calls(assistant_id);
CREATE INDEX IF NOT EXISTS idx_calls_phone_number_id ON public.calls(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON public.calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_start_time ON public.calls(start_time);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER calls_updated_at_trigger
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.calls IS 'Table pour stocker les appels téléphoniques traités par les assistants.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres appels
CREATE POLICY "Users can view their own calls" 
ON public.calls FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des appels pour eux-mêmes
CREATE POLICY "Users can create their own calls" 
ON public.calls FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres appels
CREATE POLICY "Users can update their own calls" 
ON public.calls FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres appels
CREATE POLICY "Users can delete their own calls" 
ON public.calls FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 