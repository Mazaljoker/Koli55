-- Créer table health_check pour les tests
CREATE TABLE IF NOT EXISTS public.health_check (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'ok',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
-- Ajouter une ligne de test
INSERT INTO public.health_check (status) VALUES ('ok'); 