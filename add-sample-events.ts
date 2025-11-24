/**
 * Add sample events to demonstrate the app while setting up real API keys
 * Run with: npx tsx add-sample-events.ts
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const sampleEvents = [
  {
    id: 'sample-1',
    title: 'Istanbul Jazz Festival 2025',
    description: 'Dünyanın en ünlü caz sanatçılarını ağırlayan prestijli festival. 3 gün boyunca müzik dolu bir deneyim.',
    category: 'Festival',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    date: '15 Mart 2025',
    time: '19:00',
    location: 'Zorlu PSM',
    city: 'Istanbul',
    price_min: 350,
    price_max: 800,
    organizer: 'Istanbul Kültür Sanat Vakfı',
    attendees: 1250,
    latitude: 41.0661,
    longitude: 29.0128,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-2',
    title: 'Galatasaray vs Fenerbahçe Derby',
    description: 'Türkiyenin en büyük derbisi! Sarı-kırmızı ve sarı-lacivertli taraftarlar arasında büyük heyecan.',
    category: 'Spor',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    date: '22 Mart 2025',
    time: '19:00',
    location: 'Türk Telekom Stadyumu',
    city: 'Istanbul',
    price_min: 500,
    price_max: 1500,
    organizer: 'Galatasaray SK',
    attendees: 45000,
    latitude: 41.1039,
    longitude: 28.9901,
    is_premium: true,
    source: 'sample',
  },
  {
    id: 'sample-3',
    title: 'React & TypeScript Workshop',
    description: 'Modern web geliştirme teknikleri üzerine kapsamlı workshop. Hands-on projeler ve networking fırsatı.',
    category: 'Meetup',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: '18 Mart 2025',
    time: '14:00',
    location: 'Impact Hub Istanbul',
    city: 'Istanbul',
    price_min: 0,
    price_max: 0,
    organizer: 'Istanbul Tech Community',
    attendees: 85,
    latitude: 41.0082,
    longitude: 28.9784,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-4',
    title: 'Hamlet - Shakespeare Oyunu',
    description: 'Shakespearein ölümsüz eseri modern yorumuyla sahnede. Usta oyuncularla unutulmaz bir gece.',
    category: 'Tiyatro',
    image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
    date: '25 Mart 2025',
    time: '20:30',
    location: 'Atatürk Kültür Merkezi',
    city: 'Istanbul',
    price_min: 150,
    price_max: 400,
    organizer: 'Devlet Tiyatroları',
    attendees: 320,
    latitude: 41.037,
    longitude: 28.987,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-5',
    title: 'Sertab Erener Konseri',
    description: 'Pop müziğin kraliçesi Sertab Erener, sevilen şarkılarıyla İstanbulda!',
    category: 'Konser',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    date: '28 Mart 2025',
    time: '21:00',
    location: 'Cemil Topuzlu Açıkhava Tiyatrosu',
    city: 'Istanbul',
    price_min: 400,
    price_max: 1200,
    organizer: 'Live Nation Turkey',
    attendees: 2800,
    latitude: 41.0091,
    longitude: 29.0259,
    is_premium: true,
    source: 'sample',
  },
  {
    id: 'sample-6',
    title: 'Gastronomi Festivali',
    description: 'İstanbulun en iyi şeflerinden lezzet dolu bir hafta sonu. Tadım, workshop ve şov.',
    category: 'Gastronomi',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    date: '30 Mart 2025',
    time: '12:00',
    location: 'İstanbul Kongre Merkezi',
    city: 'Istanbul',
    price_min: 200,
    price_max: 500,
    organizer: 'Gastronomi Derneği',
    attendees: 1500,
    latitude: 41.0425,
    longitude: 28.9865,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-7',
    title: 'Avatar: The Way of Water',
    description: 'James Cameronun muhteşem devam filmi IMAX deneyimiyle.',
    category: 'Sinema',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
    date: '20 Mart 2025',
    time: '18:30',
    location: 'Zorlu Cinemaximum',
    city: 'Istanbul',
    price_min: 120,
    price_max: 250,
    organizer: 'Cinemaximum',
    attendees: 380,
    latitude: 41.0661,
    longitude: 29.0128,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-8',
    title: 'Van Gogh: Immersive Experience',
    description: 'Van Goghun eserlerini 360 derece projeksiyon ile deneyimleyin.',
    category: 'Sergi',
    image_url: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=600&fit=crop',
    date: '16 Mart 2025',
    time: '10:00',
    location: 'Uniq İstanbul',
    city: 'Istanbul',
    price_min: 180,
    price_max: 350,
    organizer: 'Immersive Arts',
    attendees: 950,
    latitude: 41.0039,
    longitude: 28.7719,
    is_premium: true,
    source: 'sample',
  },
  {
    id: 'sample-9',
    title: 'Ankara Müzik Festivali',
    description: 'Başkentte 5 gün sürecek müzik şöleni. Rock, pop, elektronik müzik bir arada.',
    category: 'Festival',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    date: '5 Nisan 2025',
    time: '17:00',
    location: 'Ankara Arena',
    city: 'Ankara',
    price_min: 300,
    price_max: 900,
    organizer: 'Ankara Büyükşehir Belediyesi',
    attendees: 3500,
    latitude: 39.9334,
    longitude: 32.8597,
    is_premium: false,
    source: 'sample',
  },
  {
    id: 'sample-10',
    title: 'İzmir Opera - La Traviata',
    description: 'Verdinin muhteşem operası İzmir Devlet Opera ve Balesinde.',
    category: 'Tiyatro',
    image_url: 'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=800&h=600&fit=crop',
    date: '8 Nisan 2025',
    time: '19:30',
    location: 'İzmir Devlet Opera ve Balesi',
    city: 'Izmir',
    price_min: 100,
    price_max: 300,
    organizer: 'İzmir DOB',
    attendees: 420,
    latitude: 38.4192,
    longitude: 27.1287,
    is_premium: false,
    source: 'sample',
  },
];

async function addSampleEvents() {
  console.log('🎭 Adding sample events to database...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // First, delete old sample events
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('source', 'sample');

    if (deleteError && !deleteError.message.includes('no rows')) {
      console.error('⚠️  Warning: Could not delete old sample events:', deleteError.message);
    }

    // Insert new sample events
    let successCount = 0;
    let failCount = 0;

    for (const event of sampleEvents) {
      const { error } = await supabase.from('events').insert(event);

      if (error) {
        if (!error.message.includes('duplicate')) {
          console.error(`❌ Failed to insert "${event.title}":`, error.message);
          failCount++;
        }
      } else {
        console.log(`✅ Added: ${event.title} (${event.city})`);
        successCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully added ${successCount} sample events`);
    if (failCount > 0) {
      console.log(`❌ Failed to add ${failCount} events`);
    }

    console.log('\n📍 Events by city:');
    const cities = [...new Set(sampleEvents.map((e) => e.city))];
    cities.forEach((city) => {
      const count = sampleEvents.filter((e) => e.city === city).length;
      console.log(`   ${city}: ${count} events`);
    });

    console.log('\n🎯 Events by category:');
    const categories = [...new Set(sampleEvents.map((e) => e.category))];
    categories.forEach((category) => {
      const count = sampleEvents.filter((e) => e.category === category).length;
      console.log(`   ${category}: ${count} events`);
    });

    console.log('\n💡 Next steps:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Check the event list to see sample events');
    console.log('3. Check the map view - events should appear at their locations');
    console.log('\n⚠️  These are SAMPLE events for demonstration.');
    console.log('   To get real events, you need valid API keys.');
    console.log('   See API_KEYS_GUIDE.md for instructions.');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
addSampleEvents();
