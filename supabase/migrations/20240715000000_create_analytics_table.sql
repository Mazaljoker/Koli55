-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table analytics
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Utilisateur propriétaire
    date DATE NOT NULL,
    assistant_id UUID REFERENCES public.assistants(id) ON DELETE SET NULL,
    phone_number_id UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
    total_calls INTEGER DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    average_duration_seconds NUMERIC DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_characters INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    billable_amount NUMERIC DEFAULT 0,
    usage_details JSONB, -- Détails supplémentaires d'utilisation
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_assistant_id ON public.analytics(assistant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_phone_number_id ON public.analytics(phone_number_id);

-- Index composite pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON public.analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_user_assistant ON public.analytics(user_id, assistant_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER analytics_updated_at_trigger
BEFORE UPDATE ON public.analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.analytics IS 'Table pour stocker les données d''analytique et d''utilisation agrégées par jour.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres données d'analytique
CREATE POLICY "Users can view their own analytics" 
ON public.analytics FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des entrées d'analytique pour eux-mêmes
CREATE POLICY "Users can create their own analytics" 
ON public.analytics FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres données d'analytique
CREATE POLICY "Users can update their own analytics" 
ON public.analytics FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres données d'analytique
CREATE POLICY "Users can delete their own analytics" 
ON public.analytics FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 