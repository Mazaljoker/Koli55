-- Create the health_check table for connection testing
CREATE TABLE IF NOT EXISTS public.health_check (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'ok',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add initial test data
INSERT INTO public.health_check (status) VALUES ('ok');

-- Set up RLS (Row Level Security)
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access but restrict writes
CREATE POLICY "Allow public read access to health_check" 
ON public.health_check 
FOR SELECT 
USING (true);

-- Comment table and columns
COMMENT ON TABLE public.health_check IS 'Table used for testing database connectivity';
COMMENT ON COLUMN public.health_check.id IS 'Unique identifier for each health check entry';
COMMENT ON COLUMN public.health_check.status IS 'Current status of the health check';
COMMENT ON COLUMN public.health_check.created_at IS 'Timestamp when the health check entry was created';
