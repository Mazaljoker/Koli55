-- Migration pour ajouter la colonne model à la table assistants
-- Cette migration résout l'erreur: "Could not find the 'model' column of 'assistants' in the schema cache"

-- Vérifier si la colonne existe déjà avant de l'ajouter (pour éviter les erreurs)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'assistants'
        AND column_name = 'model'
    ) THEN
        -- Ajouter la colonne model sous forme de JSONB pour pouvoir stocker des modèles structurés
        ALTER TABLE assistants ADD COLUMN model JSONB;
        
        -- Créer également une version texte pour la compatibilité avec les deux formats
        ALTER TABLE assistants ADD COLUMN model_string TEXT;
        
        -- Ajouter un commentaire pour documenter la colonne
        COMMENT ON COLUMN assistants.model IS 'Stocke la configuration du modèle LLM (fournisseur, ID du modèle, paramètres, etc.)';
        COMMENT ON COLUMN assistants.model_string IS 'Version texte du nom du modèle pour la compatibilité';
    END IF;
END
$$;

-- Mettre à jour les politiques RLS si nécessaires
-- FIXME: Ajustez selon vos besoins de sécurité
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;

-- S'assurer que la table a une politique de lecture pour le propriétaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'assistants'
        AND policyname = 'assistants_select_policy'
    ) THEN
        CREATE POLICY assistants_select_policy ON assistants
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- S'assurer que la table a une politique d'insertion
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'assistants'
        AND policyname = 'assistants_insert_policy'
    ) THEN
        CREATE POLICY assistants_insert_policy ON assistants
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- S'assurer que la table a une politique de mise à jour
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'assistants'
        AND policyname = 'assistants_update_policy'
    ) THEN
        CREATE POLICY assistants_update_policy ON assistants
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- S'assurer que la table a une politique de suppression
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'assistants'
        AND policyname = 'assistants_delete_policy'
    ) THEN
        CREATE POLICY assistants_delete_policy ON assistants
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Rafraîchir le cache de schéma
NOTIFY pgrst, 'reload schema'; 