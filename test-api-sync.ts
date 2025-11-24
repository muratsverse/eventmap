/**
 * Test script to fetch real events from Ticketmaster and Eventbrite APIs
 * Run with: npx tsx test-api-sync.ts
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
const TICKETMASTER_API_KEY = process.env.VITE_TICKETMASTER_API_KEY!;
const EVENTBRITE_API_KEY = process.env.VITE_EVENTBRITE_API_KEY!;

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  image_url?: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price?: { min: number; max: number };
  priceMin?: number;
  priceMax?: number;
  price_min?: number;
  price_max?: number;
  organizer?: string;
  attendees?: number;
  latitude?: number;
  longitude?: number;
  source?: string;
}

async function fetchTicketmasterEvents(): Promise<Event[]> {
  if (!TICKETMASTER_API_KEY) {
    console.log('⚠️  Ticketmaster API key not found');
    return [];
  }

  console.log('🎫 Fetching from Ticketmaster...');

  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: TICKETMASTER_API_KEY,
        countryCode: 'TR',
        city: 'Istanbul',
        size: 20,
      },
    });

    const events = response.data._embedded?.events || [];
    console.log(`   Found ${events.length} Ticketmaster events`);

    return events.map((event: any) => {
      const venue = event._embedded?.venues?.[0];
      const priceRange = event.priceRanges?.[0];

      return {
        id: `tm-${event.id}`,
        title: event.name,
        description: event.info || event.pleaseNote || '',
        category: mapTicketmasterCategory(event.classifications?.[0]?.segment?.name),
        imageUrl: event.images?.[0]?.url || '',
        date: new Date(event.dates.start.dateTime || event.dates.start.localDate).toLocaleDateString('tr-TR'),
        time: event.dates.start.localTime || '20:00',
        location: venue?.name || '',
        city: 'Istanbul',
        price: {
          min: priceRange?.min || 0,
          max: priceRange?.max || 0,
        },
        organizer: event.promoter?.name || 'Ticketmaster',
        attendees: 0,
        latitude: parseFloat(venue?.location?.latitude) || 41.0082,
        longitude: parseFloat(venue?.location?.longitude) || 28.9784,
        source: 'ticketmaster',
      };
    });
  } catch (error: any) {
    console.error('   ❌ Ticketmaster error:', error.response?.data || error.message);
    return [];
  }
}

async function fetchEventbriteEvents(): Promise<Event[]> {
  if (!EVENTBRITE_API_KEY) {
    console.log('⚠️  Eventbrite API key not found');
    return [];
  }

  console.log('🎟️  Fetching from Eventbrite...');

  try {
    const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_API_KEY}`,
      },
      params: {
        'location.address': 'Istanbul, Turkey',
        expand: 'venue,category',
      },
    });

    const events = response.data.events || [];
    console.log(`   Found ${events.length} Eventbrite events`);

    return events.map((event: any) => ({
      id: `eb-${event.id}`,
      title: event.name.text,
      description: event.description?.text || '',
      category: mapEventbriteCategory(event.category?.name),
      imageUrl: event.logo?.url || '',
      date: new Date(event.start.local).toLocaleDateString('tr-TR'),
      time: new Date(event.start.local).toLocaleTimeString('tr-TR'),
      location: event.venue?.name || '',
      city: 'Istanbul',
      price: {
        min: 0,
        max: 0,
      },
      organizer: event.organizer?.name || 'Eventbrite',
      attendees: 0,
      latitude: parseFloat(event.venue?.latitude) || 41.0082,
      longitude: parseFloat(event.venue?.longitude) || 28.9784,
      source: 'eventbrite',
    }));
  } catch (error: any) {
    console.error('   ❌ Eventbrite error:', error.response?.data || error.message);
    return [];
  }
}

function mapTicketmasterCategory(tmCategory?: string): string {
  const mapping: Record<string, string> = {
    Music: 'Konser',
    Sports: 'Spor',
    'Arts & Theatre': 'Tiyatro',
    Film: 'Sinema',
    Miscellaneous: 'Diğer',
  };
  return mapping[tmCategory || ''] || 'Diğer';
}

function mapEventbriteCategory(ebCategory?: string): string {
  const mapping: Record<string, string> = {
    Music: 'Konser',
    'Sports & Fitness': 'Spor',
    'Performing & Visual Arts': 'Tiyatro',
    Film: 'Sinema',
    'Food & Drink': 'Gastronomi',
    'Business & Professional': 'Meetup',
    'Community & Culture': 'Festival',
  };
  return mapping[ebCategory || ''] || 'Diğer';
}

async function syncEventsToDatabase(events: Event[]) {
  let successCount = 0;
  let failCount = 0;

  for (const event of events) {
    try {
      // Handle different price formats
      let priceMin = 0;
      let priceMax = 0;

      if (event.price && typeof event.price === 'object') {
        priceMin = event.price.min || 0;
        priceMax = event.price.max || 0;
      } else if (event.priceMin !== undefined) {
        priceMin = event.priceMin;
        priceMax = event.priceMax || event.priceMin;
      } else if (event.price_min !== undefined) {
        priceMin = event.price_min;
        priceMax = event.price_max || event.price_min;
      }

      const { error } = await supabase.from('events').insert({
        id: event.id,
        title: event.title,
        description: event.description || '',
        category: event.category,
        image_url: event.imageUrl || event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
        date: event.date,
        time: event.time,
        location: event.location || 'Belirtilmemiş',
        city: event.city,
        price_min: priceMin,
        price_max: priceMax,
        organizer: event.organizer,
        attendees: event.attendees || 0,
        latitude: event.latitude || 41.0082,
        longitude: event.longitude || 28.9784,
        is_premium: false,
        source: event.source || 'unknown',
      });

      if (error) {
        // Ignore duplicate key errors
        if (!error.message.includes('duplicate')) {
          console.error(`   ❌ Insert error for ${event.title}:`, error.message);
          failCount++;
        }
      } else {
        successCount++;
      }
    } catch (insertError: any) {
      console.error(`   ❌ Insert error:`, insertError.message);
      failCount++;
    }
  }

  return { successCount, failCount };
}

async function testAPISync() {
  console.log('🚀 Starting real event sync test...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const startTime = Date.now();

  try {
    // Fetch from all sources
    const [ticketmasterEvents, eventbriteEvents] = await Promise.all([
      fetchTicketmasterEvents(),
      fetchEventbriteEvents(),
    ]);

    const allEvents = [...ticketmasterEvents, ...eventbriteEvents];

    console.log(`\n📊 Total events fetched: ${allEvents.length}`);
    console.log(`   Ticketmaster: ${ticketmasterEvents.length}`);
    console.log(`   Eventbrite: ${eventbriteEvents.length}\n`);

    if (allEvents.length === 0) {
      console.log('⚠️  No events found. Check your API keys and internet connection.');
      return;
    }

    // Sync to database
    console.log('💾 Syncing to Supabase database...');
    const { successCount, failCount } = await syncEventsToDatabase(allEvents);

    const duration = Date.now() - startTime;

    console.log('\n✅ Sync completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total events inserted: ${successCount}`);
    console.log(`❌ Failed inserts: ${failCount}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 Next steps:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Navigate to the events list to see the synced events');
    console.log('3. Check the map view to see events on the map');

  } catch (error: any) {
    console.error('\n❌ Error during sync:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check that your .env file has the correct API keys');
    console.error('2. Verify Supabase URL and anon key are correct');
    console.error('3. Ensure your internet connection is stable');
    process.exit(1);
  }
}

// Run the test
testAPISync();
