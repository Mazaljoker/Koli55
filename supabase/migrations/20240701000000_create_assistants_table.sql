-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table assistants
CREATE TABLE public.assistants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_assistant_id TEXT UNIQUE,
    name TEXT NOT NULL,
    model_provider TEXT,
    model_name TEXT,
    model_temperature NUMERIC,
    model_max_tokens INTEGER,
    voice TEXT,
    language TEXT,
    first_message TEXT,
    system_prompt TEXT,
    tools_config JSONB,
    knowledge_base_ids TEXT[],
    forwarding_phone_number TEXT,
    end_call_message TEXT,
    end_call_phrases TEXT[],
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes sur user_id et vapi_assistant_id
CREATE INDEX IF NOT EXISTS idx_assistants_user_id ON public.assistants(user_id);
CREATE INDEX IF NOT EXISTS idx_assistants_vapi_assistant_id ON public.assistants(vapi_assistant_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER assistants_updated_at_trigger
BEFORE UPDATE ON public.assistants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.assistants IS '''Table pour stocker les configurations des assistants, liés aux utilisateurs et aux IDs Vapi.''';

-- Exemples de politiques RLS (À adapter absolument à vos besoins !)
-- ATTENTION : Ces politiques sont des exemples basiques. Revoyez-les attentivement.

-- Permettre aux utilisateurs authentifiés de lire les assistants qu'''ils possèdent
-- CREATE POLICY "Allow authenticated users to read their own assistants"
-- ON public.assistants
-- FOR SELECT
-- USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des assistants pour eux-mêmes
-- CREATE POLICY "Allow authenticated users to create assistants for themselves"
-- ON public.assistants
-- FOR INSERT
-- WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres assistants
-- CREATE POLICY "Allow users to update their own assistants"
-- ON public.assistants
-- FOR UPDATE
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres assistants
-- CREATE POLICY "Allow users to delete their own assistants"
-- ON public.assistants
-- FOR DELETE
-- USING (auth.uid() = user_id);

-- Si vous avez un rôle '''service_role''' qui doit tout faire (utilisé par les Edge Functions par exemple)
-- NE PAS créer de politique pour service_role, car il bypass RLS par défaut.
-- Sinon, si une fonction Edge opère en tant qu'''utilisateur authentifié, les politiques ci-dessus s'''appliqueraient. 