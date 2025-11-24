# EventMap Setup Instructions

## Current Status

✅ **Working:**
- React app running on http://localhost:5173
- Supabase connection configured
- Map integration with Leaflet (OpenStreetMap)
- UI components complete

⚠️ **Issues Found:**

### 1. API Keys Invalid
The provided API keys are not working:
- **Ticketmaster**: Returns "Invalid ApiKey" error (401)
- **Eventbrite**: Returns 404 error

### 2. Row Level Security (RLS) Blocking Inserts
Your Supabase `events` table has Row Level Security enabled, which is blocking event inserts.

---

## Quick Fix: Add Sample Events

To see the app working with sample data, run this SQL in your Supabase SQL Editor:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `zktzpwuuqdsfdrdljtoy`
3. Go to **SQL Editor** (left sidebar)

### Step 2: Run This SQL

```sql
-- Temporarily disable RLS to allow inserts
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Delete old sample events
DELETE FROM events WHERE source = 'sample';

-- Insert sample events
INSERT INTO events (id, title, description, category, image_url, date, time, location, city, price_min, price_max, organizer, attendees, latitude, longitude, is_premium, source)
VALUES
  ('sample-1', 'Istanbul Jazz Festival 2025', 'Dünyanın en ünlü caz sanatçılarını ağırlayan prestijli festival. 3 gün boyunca müzik dolu bir deneyim.', 'Festival', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop', '15 Mart 2025', '19:00', 'Zorlu PSM', 'Istanbul', 350, 800, 'Istanbul Kültür Sanat Vakfı', 1250, 41.0661, 29.0128, false, 'sample'),

  ('sample-2', 'Galatasaray vs Fenerbahçe Derby', 'Türkiye''nin en büyük derbisi! Sarı-kırmızı ve sarı-lacivertli taraftarlar arasında büyük heyecan.', 'Spor', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop', '22 Mart 2025', '19:00', 'Türk Telekom Stadyumu', 'Istanbul', 500, 1500, 'Galatasaray SK', 45000, 41.1039, 28.9901, true, 'sample'),

  ('sample-3', 'React & TypeScript Workshop', 'Modern web geliştirme teknikleri üzerine kapsamlı workshop. Hands-on projeler ve networking fırsatı.', 'Meetup', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', '18 Mart 2025', '14:00', 'Impact Hub Istanbul', 'Istanbul', 0, 0, 'Istanbul Tech Community', 85, 41.0082, 28.9784, false, 'sample'),

  ('sample-4', 'Hamlet - Shakespeare Oyunu', 'Shakespeare''in ölümsüz eseri modern yorumuyla sahnede. Usta oyuncularla unutulmaz bir gece.', 'Tiyatro', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop', '25 Mart 2025', '20:30', 'Atatürk Kültür Merkezi', 'Istanbul', 150, 400, 'Devlet Tiyatroları', 320, 41.037, 28.987, false, 'sample'),

  ('sample-5', 'Sertab Erener Konseri', 'Pop müziğin kraliçesi Sertab Erener, sevilen şarkılarıyla İstanbul''da!', 'Konser', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop', '28 Mart 2025', '21:00', 'Cemil Topuzlu Açıkhava Tiyatrosu', 'Istanbul', 400, 1200, 'Live Nation Turkey', 2800, 41.0091, 29.0259, true, 'sample'),

  ('sample-6', 'Gastronomi Festivali', 'İstanbul''un en iyi şeflerinden lezzet dolu bir hafta sonu. Tadım, workshop ve şov.', 'Gastronomi', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', '30 Mart 2025', '12:00', 'İstanbul Kongre Merkezi', 'Istanbul', 200, 500, 'Gastronomi Derneği', 1500, 41.0425, 28.9865, false, 'sample'),

  ('sample-7', 'Avatar: The Way of Water', 'James Cameron''un muhteşem devam filmi IMAX deneyimiyle.', 'Sinema', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop', '20 Mart 2025', '18:30', 'Zorlu Cinemaximum', 'Istanbul', 120, 250, 'Cinemaximum', 380, 41.0661, 29.0128, false, 'sample'),

  ('sample-8', 'Van Gogh: Immersive Experience', 'Van Gogh''un eserlerini 360 derece projeksiyon ile deneyimleyin.', 'Sergi', 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=600&fit=crop', '16 Mart 2025', '10:00', 'Uniq İstanbul', 'Istanbul', 180, 350, 'Immersive Arts', 950, 41.0039, 28.7719, true, 'sample'),

  ('sample-9', 'Ankara Müzik Festivali', 'Başkentte 5 gün sürecek müzik şöleni. Rock, pop, elektronik müzik bir arada.', 'Festival', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop', '5 Nisan 2025', '17:00', 'Ankara Arena', 'Ankara', 300, 900, 'Ankara Büyükşehir Belediyesi', 3500, 39.9334, 32.8597, false, 'sample'),

  ('sample-10', 'İzmir Opera - La Traviata', 'Verdi''nin muhteşem operası İzmir Devlet Opera ve Balesi''nde.', 'Tiyatro', 'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=800&h=600&fit=crop', '8 Nisan 2025', '19:30', 'İzmir Devlet Opera ve Balesi', 'Izmir', 100, 300, 'İzmir DOB', 420, 38.4192, 27.1287, false, 'sample');

-- Verify insertion
SELECT COUNT(*) as total_events FROM events;
SELECT id, title, city, source FROM events WHERE source = 'sample' LIMIT 10;
```

### Step 3: Check Your App
1. Refresh http://localhost:5173
2. You should see 10 sample events
3. Check the map view - events should appear at their real locations in Istanbul, Ankara, and Izmir

---

## Getting Real Events from APIs

To fetch real events, you need valid API keys.

### Option A: Ticketmaster API

1. **Get an API Key:**
   - Go to https://developer.ticketmaster.com/
   - Click "Get Your API Key"
   - Sign up for a free account
   - Copy your Consumer Key

2. **Update .env:**
   ```env
   VITE_TICKETMASTER_API_KEY=your_actual_key_here
   ```

3. **Test:**
   - Go to Admin Panel in the app
   - Click "Sync All" or select "Ticketmaster" and click "Sync Selected"

### Option B: Eventbrite API

1. **Get an API Key:**
   - Go to https://www.eventbrite.com/platform/api
   - Sign in to your Eventbrite account
   - Go to Account Settings > App Management
   - Create a new app
   - Get your Private Token (OAuth token)

2. **Update .env:**
   ```env
   VITE_EVENTBRITE_API_KEY=your_private_token_here
   ```

3. **Test:**
   - Go to Admin Panel
   - Select "Eventbrite" and click "Sync Selected"

### Option C: Other Free Event Sources

If you want Turkish events specifically, consider:

1. **Eventim API** (Turkish events)
2. **Biletix API** (requires partnership)
3. **Public event calendars** (web scraping)

---

## Troubleshooting

### Events not showing up?
1. Check browser console for errors (F12)
2. Verify Supabase connection in Network tab
3. Run the check SQL:
   ```sql
   SELECT COUNT(*) FROM events;
   ```

### Map not working?
1. Clear browser cache
2. Check browser console for Leaflet errors
3. Verify events have valid latitude/longitude

### API sync failing?
1. Check API key format in .env
2. Verify internet connection
3. Check API rate limits
4. Look at browser Network tab for API responses

---

## Next Steps

1. ✅ Run the SQL above to add sample events
2. ✅ Test the app with sample data
3. ⏳ Get valid Ticketmaster/Eventbrite API keys
4. ⏳ Enable real event syncing
5. ⏳ Set up RLS policies for production security

Need help? Check the console logs or contact support.
