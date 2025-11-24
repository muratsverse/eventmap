/**
 * Manuel Etkinlik İmport Scripti
 *
 * Kullanım:
 * 1. events-data.json dosyasına etkinlikleri ekleyin
 * 2. npx tsx import-events.ts komutunu çalıştırın
 * 3. Etkinlikler otomatik olarak database'e eklenecek
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import axios from 'axios';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface EventData {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  date: string;
  time: string;
  location: string;
  city: string;
  address?: string;
  priceMin?: number;
  priceMax?: number;
  organizer?: string;
  url?: string;
}

// Default coordinates for Turkish cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  Izmir: { lat: 38.4192, lng: 27.1287 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Bursa: { lat: 40.1826, lng: 29.0665 },
};

/**
 * Get coordinates from address using Google Maps Geocoding API
 * Falls back to city center if API key not available
 */
async function getCoordinatesFromAddress(
  address: string,
  city: string
): Promise<{ latitude: number; longitude: number }> {
  // If no API key, use city center coordinates
  if (!GOOGLE_MAPS_API_KEY) {
    const cityCoords = cityCoordinates[city] || cityCoordinates['Istanbul'];
    return {
      latitude: cityCoords.lat,
      longitude: cityCoords.lng,
    };
  }

  try {
    const fullAddress = `${address}, ${city}, Turkey`;
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: fullAddress,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    }
  } catch (error) {
    console.warn(`Geocoding failed for ${address}, using city center`);
  }

  // Fallback to city center
  const cityCoords = cityCoordinates[city] || cityCoordinates['Istanbul'];
  return {
    latitude: cityCoords.lat,
    longitude: cityCoords.lng,
  };
}

/**
 * Generate unique ID from event data
 */
function generateEventId(event: EventData): string {
  const normalized = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  const timestamp = Date.now().toString(36);
  return `manual-${normalized}-${timestamp}`;
}

/**
 * Import events from JSON file
 */
async function importEvents() {
  console.log('📥 Etkinlik import işlemi başlıyor...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Read events data
    const filePath = path.join(process.cwd(), 'events-data.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const eventsData: EventData[] = JSON.parse(fileContent);

    console.log(`📋 ${eventsData.length} etkinlik bulundu\n`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const event of eventsData) {
      // Skip example events
      if (event.title.includes('Örnek Etkinlik')) {
        console.log(`⏭️  Atlıyor: ${event.title} (örnek etkinlik)`);
        skipCount++;
        continue;
      }

      try {
        console.log(`\n📍 İşleniyor: ${event.title}`);
        console.log(`   Kategori: ${event.category}`);
        console.log(`   Tarih: ${event.date} ${event.time}`);
        console.log(`   Yer: ${event.location}, ${event.city}`);

        // Get coordinates
        let coordinates;
        if (event.address) {
          console.log(`   🗺️  Adres koordinatları alınıyor...`);
          coordinates = await getCoordinatesFromAddress(event.address, event.city);
          console.log(`   📍 Koordinatlar: ${coordinates.latitude}, ${coordinates.longitude}`);
        } else {
          coordinates = await getCoordinatesFromAddress(event.location, event.city);
        }

        // Generate unique ID
        const id = generateEventId(event);

        // Insert to database
        const { error } = await supabase.from('events').insert({
          id,
          title: event.title,
          description: event.description,
          category: event.category,
          image_url: event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          date: event.date,
          time: event.time,
          location: event.location,
          address: event.address || (event.location + ', ' + event.city), // TAM ADRES
          city: event.city,
          price_min: event.priceMin || 0,
          price_max: event.priceMax || 0,
          organizer: event.organizer || 'Manuel Eklendi',
          attendees: 0,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          is_premium: false,
          source: 'manual',
        });

        if (error) {
          if (error.message.includes('duplicate')) {
            console.log(`   ⚠️  Bu etkinlik zaten mevcut`);
            skipCount++;
          } else if (error.message.includes('row-level security')) {
            console.log(`   ❌ RLS hatası - Supabase SQL Editor'da çalıştırmanız gerekiyor`);
            failCount++;
          } else {
            console.error(`   ❌ Hata: ${error.message}`);
            failCount++;
          }
        } else {
          console.log(`   ✅ Başarıyla eklendi!`);
          successCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error: any) {
        console.error(`   ❌ Hata: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 İmport Özeti:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Başarısız: ${failCount}`);
    console.log(`⏭️  Atlanan: ${skipCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (failCount > 0 && failCount === eventsData.length - skipCount) {
      console.log('⚠️  TÜM ETKİNLİKLER BAŞARISIZ!');
      console.log('\n💡 Muhtemel Çözüm:');
      console.log('Row Level Security (RLS) etkin olabilir.');
      console.log('\nÇözüm için:');
      console.log('1. Supabase Dashboard > SQL Editor\'a git');
      console.log('2. Şu komutu çalıştır: ALTER TABLE events DISABLE ROW LEVEL SECURITY;');
      console.log('3. Script\'i tekrar çalıştır\n');
    } else if (successCount > 0) {
      console.log('💡 Sonraki Adımlar:');
      console.log('1. http://localhost:5173 adresini aç');
      console.log('2. Etkinlik listesinde yeni etkinlikleri gör');
      console.log('3. Haritada konumları kontrol et\n');
    }
  } catch (error: any) {
    console.error('\n❌ Kritik Hata:', error.message);

    if (error.code === 'ENOENT') {
      console.log('\n💡 events-data.json dosyası bulunamadı!');
      console.log('Dosyanın doğru yerde olduğundan emin olun.\n');
    }

    process.exit(1);
  }
}

// Run the import
importEvents();
