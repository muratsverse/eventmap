-- Add address column to events table
-- Run this in Supabase SQL Editor

-- Add address column if it doesn't exist
ALTER TABLE events
ADD COLUMN IF NOT EXISTS address TEXT;

-- Update existing events with a default address (location + city)
UPDATE events
SET address = COALESCE(location || ', ' || city, city)
WHERE address IS NULL;

-- Verify
SELECT id, title, location, address, city FROM events LIMIT 5;
