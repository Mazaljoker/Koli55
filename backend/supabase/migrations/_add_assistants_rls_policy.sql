-- Activer RLS sur la table assistants (si ce n'est pas déjà fait)
ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs authentifiés d'insérer leurs propres assistants
CREATE POLICY "Users can create their own assistants" 
ON assistants FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de voir leurs propres assistants
CREATE POLICY "Users can view their own assistants" 
ON assistants FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres assistants
CREATE POLICY "Users can update their own assistants" 
ON assistants FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres assistants
CREATE POLICY "Users can delete their own assistants" 
ON assistants FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 