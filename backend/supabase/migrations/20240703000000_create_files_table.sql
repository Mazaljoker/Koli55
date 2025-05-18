-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table files
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_file_id TEXT UNIQUE,
    filename TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('assistants', 'knowledge-bases')),
    size_bytes INTEGER NOT NULL,
    mime_type TEXT,
    content_path TEXT, -- Chemin vers le contenu du fichier stocké (si applicable)
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_vapi_file_id ON public.files(vapi_file_id);
CREATE INDEX IF NOT EXISTS idx_files_purpose ON public.files(purpose);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER files_updated_at_trigger
BEFORE UPDATE ON public.files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.files IS 'Table pour stocker les métadonnées des fichiers utilisés par les assistants et les bases de connaissances.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres fichiers
CREATE POLICY "Users can view their own files" 
ON public.files FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des fichiers pour eux-mêmes
CREATE POLICY "Users can create their own files" 
ON public.files FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres fichiers
CREATE POLICY "Users can update their own files" 
ON public.files FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own files" 
ON public.files FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 