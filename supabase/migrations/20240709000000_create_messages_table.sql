-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    vapi_message_id TEXT UNIQUE,
    call_id UUID REFERENCES public.calls(id) ON DELETE CASCADE, -- l'appel associé au message
    role TEXT NOT NULL, -- 'assistant', 'user', 'system'
    content TEXT NOT NULL,
    sequence_number INTEGER, -- pour ordonner les messages dans un appel
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_vapi_message_id ON public.messages(vapi_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_call_id ON public.messages(call_id);
CREATE INDEX IF NOT EXISTS idx_messages_sequence_number ON public.messages(sequence_number);
CREATE INDEX IF NOT EXISTS idx_messages_role ON public.messages(role);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER messages_updated_at_trigger
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.messages IS 'Table pour stocker les messages échangés pendant un appel téléphonique.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres messages
CREATE POLICY "Users can view their own messages" 
ON public.messages FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des messages pour eux-mêmes
CREATE POLICY "Users can create their own messages" 
ON public.messages FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres messages
CREATE POLICY "Users can update their own messages" 
ON public.messages FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres messages
CREATE POLICY "Users can delete their own messages" 
ON public.messages FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 