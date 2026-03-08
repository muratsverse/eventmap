/**
 * Geocoding utilities using LocationIQ
 * 5000 requests/day free tier
 */

const LOCATIONIQ_KEY = 'pk.52a68a9fe5e057aee28c8a53bca6618b';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AddressSuggestion {
  displayName: string;
  shortName: string;
  latitude: number;
  longitude: number;
  city: string | null;
}

/**
 * Search addresses with autocomplete-style results using LocationIQ
 */
export async function searchAddress(
  query: string,
  limit: number = 5
): Promise<AddressSuggestion[]> {
  if (query.length < 3) return [];

  try {
    const url = `https://api.locationiq.com/v1/autocomplete?` +
      new URLSearchParams({
        key: LOCATIONIQ_KEY,
        q: query,
        limit: limit.toString(),
        countrycodes: 'tr',
        'accept-language': 'tr',
        tag: 'place:house,place:building,highway:*,amenity:*,shop:*,tourism:*,leisure:*',
      });

    const response = await fetch(url);

    if (!response.ok) return [];

    const data = await response.json();

    return data.map((item: any) => {
      const addr = item.address || {};
      const parts: string[] = [];

      if (addr.name && addr.name !== addr.road) parts.push(addr.name);
      if (addr.road) parts.push(addr.road);
      if (addr.house_number && parts.length > 0) parts[parts.length - 1] += ' No:' + addr.house_number;
      if (addr.neighbourhood) parts.push(addr.neighbourhood);
      if (addr.suburb) parts.push(addr.suburb);
      if (addr.district || addr.county) parts.push(addr.district || addr.county);

      const rawCity = addr.state || addr.city || addr.province || '';
      const city = rawCity || null;

      return {
        displayName: item.display_name,
        shortName: parts.length > 0 ? parts.join(', ') : item.display_name.split(',').slice(0, 3).join(','),
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city,
      };
    });
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

/**
 * Geocode an address to coordinates using LocationIQ
 */
export async function geocodeAddress(
  address: string,
  city: string,
  country: string = 'Turkey'
): Promise<GeocodingResult | null> {
  try {
    const query = `${address}, ${city}, ${country}`;
    const url = `https://api.locationiq.com/v1/search?` +
      new URLSearchParams({
        key: LOCATIONIQ_KEY,
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1',
      });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    const result = data[0];

    const importance = parseFloat(result.importance || '0');
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
 * Reverse geocode coordinates to a structured address using LocationIQ
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const url = `https://us1.locationiq.com/v1/reverse?` +
      new URLSearchParams({
        key: LOCATIONIQ_KEY,
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': 'tr',
      });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.error) {
      return null;
    }

    const addr = data.address || {};

    const parts: string[] = [];
    if (addr.road) parts.push(addr.road);
    if (addr.house_number && parts.length > 0) parts[parts.length - 1] += ' No:' + addr.house_number;
    if (addr.neighbourhood) parts.push(addr.neighbourhood);
    if (addr.suburb) parts.push(addr.suburb);
    if (addr.district || addr.county) parts.push(addr.district || addr.county);

    const address = parts.length > 0 ? parts.join(', ') : (data.display_name || '');

    const rawCity = addr.state || addr.city || addr.province || '';
    const city = rawCity || null;

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

  const distance = calculateDistance(
    latitude,
    longitude,
    result.latitude,
    result.longitude
  );

  return distance < 1000;
}

/**
 * Calculate distance between two coordinates in meters (Haversine)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
