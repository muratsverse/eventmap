/**
 * Geocoding utilities using Nominatim (OpenStreetMap)
 * Free, no API key required, rate limited to 1 req/sec
 */

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  confidence: 'high' | 'medium' | 'low';
}

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
}

/**
 * Geocode an address to coordinates using Nominatim
 */
export async function geocodeAddress(
  address: string,
  city: string,
  country: string = 'Turkey'
): Promise<GeocodingResult | null> {
  try {
    await waitForRateLimit();

    const query = `${address}, ${city}, ${country}`;
    const url = `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1',
      });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Happenin/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    const result = data[0];

    // Determine confidence based on importance score
    const importance = parseFloat(result.importance);
    let confidence: 'high' | 'medium' | 'low';
    if (importance > 0.5) {
      confidence = 'high';
    } else if (importance > 0.3) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      confidence,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

interface ReverseGeocodeResult {
  address: string;
  city: string | null;
  displayName: string;
}

/**
 * Reverse geocode coordinates to a structured address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  try {
    await waitForRateLimit();

    const url = `https://nominatim.openstreetmap.org/reverse?` +
      new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': 'tr',
      });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Happenin/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.error) {
      return null;
    }

    const addr = data.address || {};

    // Build a clean, readable address
    const parts: string[] = [];
    if (addr.road) parts.push(addr.road);
    if (addr.house_number && parts.length > 0) parts[parts.length - 1] += ' No:' + addr.house_number;
    if (addr.neighbourhood) parts.push(addr.neighbourhood);
    if (addr.suburb) parts.push(addr.suburb);
    if (addr.district || addr.county) parts.push(addr.district || addr.county);

    const address = parts.length > 0 ? parts.join(', ') : (data.display_name || '');

    // Detect city from Nominatim response
    const rawCity = addr.province || addr.city || addr.state || '';
    const cityMap: Record<string, string> = {
      'istanbul': 'Istanbul',
      'İstanbul': 'Istanbul',
      'ankara': 'Ankara',
      'izmir': 'Izmir',
      'İzmir': 'Izmir',
      'antalya': 'Antalya',
      'bursa': 'Bursa',
    };
    const city = cityMap[rawCity] || cityMap[rawCity.toLowerCase()] || null;

    return {
      address,
      city,
      displayName: data.display_name || address,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Validate if coordinates match the given address
 * Returns true if within reasonable distance (< 1km)
 */
export async function validateAddressCoordinates(
  address: string,
  city: string,
  latitude: number,
  longitude: number
): Promise<boolean> {
  const result = await geocodeAddress(address, city);

  if (!result) {
    return false;
  }

  // Calculate distance using Haversine formula
  const distance = calculateDistance(
    latitude,
    longitude,
    result.latitude,
    result.longitude
  );

  // Accept if within 1km
  return distance < 1000;
}

/**
 * Calculate distance between two coordinates in meters
 * Using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
