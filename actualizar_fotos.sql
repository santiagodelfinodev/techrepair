BEGIN;
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS imagenes_urls text[] NOT NULL DEFAULT '{}';
UPDATE public.productos SET imagenes_urls = ARRAY[imagen_url] WHERE imagen_url IS NOT NULL AND cardinality(imagenes_urls) = 0;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = EXCLUDED.allowed_mime_types;
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='product_images_upload') THEN
CREATE POLICY product_images_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='product-images');
END IF;
END $$;
COMMIT;
