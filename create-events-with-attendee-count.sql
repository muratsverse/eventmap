-- Create a view for events with real-time attendee counts
-- This view joins events with attendances to get accurate participant counts

CREATE OR REPLACE VIEW events_with_attendee_count AS
SELECT
  events.*,
  COALESCE(
    (SELECT COUNT(*) FROM attendances WHERE attendances.event_id = events.id),
    0
  ) as attendee_count
FROM events;

-- Grant select permission to authenticated users
GRANT SELECT ON events_with_attendee_count TO authenticated;

-- Optional: Create an index on attendances.event_id for better performance
CREATE INDEX IF NOT EXISTS idx_attendances_event_id ON attendances(event_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ events_with_attendee_count view created successfully!';
  RAISE NOTICE '📊 This view provides real-time attendee counts for all events';
  RAISE NOTICE '🔍 Index created on attendances(event_id) for better performance';
END $$;
