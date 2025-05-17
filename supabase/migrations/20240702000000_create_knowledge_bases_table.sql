-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table knowledge_bases
CREATE TABLE public.knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_knowledge_base_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    model_provider TEXT,
    model_name TEXT,
    model_dimensions INTEGER,
    file_count INTEGER DEFAULT 0,
    chunks_count INTEGER DEFAULT 0,
    files TEXT[],
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes sur user_id et vapi_knowledge_base_id
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_user_id ON public.knowledge_bases(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_vapi_knowledge_base_id ON public.knowledge_bases(vapi_knowledge_base_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER knowledge_bases_updated_at_trigger
BEFORE UPDATE ON public.knowledge_bases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.knowledge_bases IS 'Table pour stocker les configurations des bases de connaissances, liées aux utilisateurs et aux IDs Vapi.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres bases de connaissances
CREATE POLICY "Users can view their own knowledge bases" 
ON public.knowledge_bases FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des bases de connaissances pour eux-mêmes
CREATE POLICY "Users can create their own knowledge bases" 
ON public.knowledge_bases FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres bases de connaissances
CREATE POLICY "Users can update their own knowledge bases" 
ON public.knowledge_bases FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres bases de connaissances
CREATE POLICY "Users can delete their own knowledge bases" 
ON public.knowledge_bases FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 