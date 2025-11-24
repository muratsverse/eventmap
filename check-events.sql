-- Check how many events exist in database
SELECT COUNT(*) as total_events FROM events;

-- Show all events
SELECT id, title, city, source, created_at
FROM events
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are any events
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN source = 'biletix' THEN 1 END) as biletix,
  COUNT(CASE WHEN source = 'bubilet' THEN 1 END) as bubilet,
  COUNT(CASE WHEN source = 'user-created' THEN 1 END) as user_created,
  COUNT(CASE WHEN source = 'ticketmaster' THEN 1 END) as ticketmaster,
  COUNT(CASE WHEN source = 'eventbrite' THEN 1 END) as eventbrite
FROM events;
