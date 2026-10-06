ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS detalles jsonb NOT NULL DEFAULT '{}';
