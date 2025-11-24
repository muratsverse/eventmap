-- Setup Cloud Storage for Event Images
-- This script creates the storage bucket and sets up policies

-- Create storage bucket for event images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload images to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Allow public read access to all images
CREATE POLICY "Public read access to event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Policy 3: Allow users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Set file size limit (5MB)
-- This is done in Supabase Dashboard > Storage > event-images > Settings
-- Maximum file size: 5242880 bytes (5MB)

-- Allowed MIME types (configured in Dashboard):
-- - image/jpeg
-- - image/jpg
-- - image/png
-- - image/webp
