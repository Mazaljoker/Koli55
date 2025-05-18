-- Fonction pour mettre à jour automatiquement la colonne updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création de la table functions
CREATE TABLE public.functions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Clé étrangère vers la table auth.users
    vapi_function_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL, -- Structure des paramètres de la fonction
    webhook_url TEXT, -- URL pour l'exécution côté serveur
    code TEXT, -- Code de la fonction (optionnel, pour l'exécution côté client)
    async BOOLEAN DEFAULT FALSE,
    timeout_ms INTEGER,
    metadata JSONB,
    vapi_created_at TIMESTAMPTZ,
    vapi_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_functions_user_id ON public.functions(user_id);
CREATE INDEX IF NOT EXISTS idx_functions_vapi_function_id ON public.functions(vapi_function_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER functions_updated_at_trigger
BEFORE UPDATE ON public.functions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer Row Level Security (RLS)
ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;

-- Commentaire pour la table
COMMENT ON TABLE public.functions IS 'Table pour stocker les fonctions personnalisées (outils) qui peuvent être utilisées par les assistants.';

-- Politiques RLS
-- Permettre aux utilisateurs authentifiés de lire leurs propres fonctions
CREATE POLICY "Users can view their own functions" 
ON public.functions FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Permettre aux utilisateurs authentifiés de créer des fonctions pour eux-mêmes
CREATE POLICY "Users can create their own functions" 
ON public.functions FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de mettre à jour leurs propres fonctions
CREATE POLICY "Users can update their own functions" 
ON public.functions FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permettre aux utilisateurs de supprimer leurs propres fonctions
CREATE POLICY "Users can delete their own functions" 
ON public.functions FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 