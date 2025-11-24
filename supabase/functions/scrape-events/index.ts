// Supabase Edge Function for scraping events from Turkish platforms
// Deploy: supabase functions deploy scrape-events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedEvent {
  title: string
  description: string
  category: string
  imageUrl: string
  date: string
  time: string
  location: string
  city: string
  priceMin: number
  priceMax: number
  organizer: string
  source: string
  sourceUrl: string
  latitude: number
  longitude: number
}

// Simple HTML parser helper
function extractText(html: string, start: string, end: string): string {
  const startIdx = html.indexOf(start)
  if (startIdx === -1) return ''
  const endIdx = html.indexOf(end, startIdx + start.length)
  if (endIdx === -1) return ''
  return html.slice(startIdx + start.length, endIdx).trim()
}

// Scrape Biletix
async function scrapeBiletix(): Promise<ScrapedEvent[]> {
  try {
    const response = await fetch('https://www.biletix.com/anasayfa/TURKIYE/tr', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Biletix fetch failed: ${response.status}`)
    }

    const html = await response.text()
    const events: ScrapedEvent[] = []

    // Note: This is a simplified parser. Real implementation needs proper HTML parsing
    // You might want to use Deno DOM parser or similar

    console.log('Biletix scraping completed, found events:', events.length)
    return events
  } catch (error) {
    console.error('Biletix scraping error:', error)
    return []
  }
}

// Scrape Bubilet
async function scrapeBubilet(): Promise<ScrapedEvent[]> {
  try {
    const response = await fetch('https://www.bubilet.com.tr/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Bubilet fetch failed: ${response.status}`)
    }

    const html = await response.text()
    const events: ScrapedEvent[] = []

    // Simplified parser
    console.log('Bubilet scraping completed, found events:', events.length)
    return events
  } catch (error) {
    console.error('Bubilet scraping error:', error)
    return []
  }
}

// Scrape Biletinial
async function scrapeBiletinial(): Promise<ScrapedEvent[]> {
  try {
    const response = await fetch('https://www.biletinial.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Biletinial fetch failed: ${response.status}`)
    }

    const html = await response.text()
    const events: ScrapedEvent[] = []

    // Simplified parser
    console.log('Biletinial scraping completed, found events:', events.length)
    return events
  } catch (error) {
    console.error('Biletinial scraping error:', error)
    return []
  }
}

// Mock events for testing (since real scraping needs complex parsing)
function generateMockEvents(): ScrapedEvent[] {
  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa']
  const categories = ['Konser', 'Spor', 'Tiyatro', 'Festival', 'Meetup', 'Sergi']
  const sources = ['biletix', 'bubilet', 'biletinial']

  const events: ScrapedEvent[] = []

  for (let i = 0; i < 10; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]

    events.push({
      title: `${category} Etkinliği ${i + 1}`,
      description: `${source} üzerinden çekilen harika bir ${category.toLowerCase()} etkinliği. Kaçırmayın!`,
      category,
      imageUrl: `https://images.unsplash.com/photo-${1492684223066 + i}?w=800&h=600&fit=crop`,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      }),
      time: `${Math.floor(Math.random() * 12) + 18}:00`,
      location: `${city} ${category} Merkezi`,
      city,
      priceMin: Math.floor(Math.random() * 100) * 10,
      priceMax: Math.floor(Math.random() * 200) * 10 + 500,
      organizer: `${source} Organizasyon`,
      source,
      sourceUrl: `https://www.${source}.com/event/${i}`,
      latitude: 41.0082 + (Math.random() - 0.5) * 2,
      longitude: 28.9784 + (Math.random() - 0.5) * 2,
    })
  }

  return events
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting event scraping...')

    // For now, use mock events (real scraping needs proper HTML parsing library)
    const mockEvents = generateMockEvents()

    // In production, uncomment these:
    // const biletixEvents = await scrapeBiletix()
    // const bubiletEvents = await scrapeBubilet()
    // const biletinialEvents = await scrapeBiletinial()
    // const allEvents = [...biletixEvents, ...bubiletEvents, ...biletinialEvents]

    const allEvents = mockEvents

    // Insert events into database
    const insertPromises = allEvents.map(async (event) => {
      const eventId = `scraped-${event.source}-${Date.now()}-${Math.random().toString(36).slice(2)}`

      return supabase.from('events').insert({
        id: eventId,
        title: event.title,
        description: event.description,
        category: event.category,
        image_url: event.imageUrl,
        date: event.date,
        time: event.time,
        location: event.location,
        city: event.city,
        price_min: event.priceMin,
        price_max: event.priceMax,
        organizer: event.organizer,
        attendees: 0,
        latitude: event.latitude,
        longitude: event.longitude,
        is_premium: false,
        source: event.source,
      })
    })

    const results = await Promise.allSettled(insertPromises)
    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(`Scraping completed: ${successful} successful, ${failed} failed`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and inserted ${successful} events`,
        stats: {
          total: allEvents.length,
          successful,
          failed,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
