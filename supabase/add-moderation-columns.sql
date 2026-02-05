-- Add moderation and additional fields to events table
-- Run this in Supabase SQL Editor

-- Add status column for moderation
ALTER TABLE events
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('draft', 'inReview', 'approved', 'rejected'));

-- Add end_time column
ALTER TABLE events
ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Add rejection reason (for moderation)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add moderation timestamps
ALTER TABLE events
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE events
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Create index for creator queries
CREATE INDEX IF NOT EXISTS idx_events_creator ON events(creator_id);

-- Add report count for spam detection
ALTER TABLE events
ADD COLUMN IF NOT EXISTS report_count INTEGER DEFAULT 0;şöyle yapalım closed testte 22 versiyon var 23 

-- Create reports table for tracking spam/inappropriate content
CREATE TABLE IF NOT EXISTS event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'fake', 'duplicate', 'other')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate reports from same user
  UNIQUE(event_id, reporter_id)
);

-- Create index for report queries
CREATE INDEX IF NOT EXISTS idx_event_reports_event ON event_reports(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reports_reporter ON event_reports(reporter_id);

-- Update existing events to approved status
UPDATE events SET status = 'approved' WHERE status IS NULL;

-- Comments
COMMENT ON COLUMN events.status IS 'Moderation status: draft (user editing), inReview (submitted), approved (live), rejected (declined)';
COMMENT ON COLUMN events.report_count IS 'Number of spam/inappropriate reports. Auto-hide if > 5';
COMMENT ON TABLE event_reports IS 'User reports for spam/inappropriate events';

-- Verify
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'events'
  AND column_name IN ('status', 'end_time', 'rejection_reason', 'report_count', 'submitted_at', 'reviewed_at', 'reviewed_by')
ORDER BY ordinal_position;
