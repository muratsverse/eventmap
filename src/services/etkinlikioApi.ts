/**
 * Etkinlik.io API Integration
 *
 * Turkish event aggregator API
 * Docs: https://etkinlik.io/api/bilgi
 * RapidAPI: https://rapidapi.com/etkinlik/api/etkinlik
 *
 * Note: Requires X-Etkinlik-Token header
 */

import axios from 'axios';
import type { EventCategory, City } from '@/types';

const API_BASE_URL = 'https://etkinlik.io/api';
const API_TOKEN = import.meta.env.VITE_ETKINLIKIO_API_TOKEN || '';

interface EtkinlikioEvent {
  id: string;
  name: string;
  description: string;
  image: string;
  venue: {
    name: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  dates: {
    start: string;
    end: string;
  };
  price: {
    min: number;
    max: number;
  };
  category: string;
  organizer: string;
}

interface EtkinlikioSearchParams {
  city?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export class EtkinlikioAPI {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || API_TOKEN;
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiToken);
  }

  /**
   * Search events
   */
  async searchEvents(params: EtkinlikioSearchParams = {}) {
    if (!this.isConfigured()) {
      console.warn('Etkinlik.io API token not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/events`, {
        headers: {
          'X-Etkinlik-Token': this.apiToken,
        },
        params: {
          city: params.city || 'Istanbul',
          category: params.category,
          start_date: params.startDate,
          end_date: params.endDate,
          limit: params.limit || 50,
        },
        timeout: 10000,
      });

      return response.data.events || [];
    } catch (error) {
      console.error('Etkinlik.io API error:', error);
      return [];
    }
  }

  /**
   * Get event categories
   */
  async getCategories() {
    if (!this.isConfigured()) {
      throw new Error('Etkinlik.io API token not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/categories`, {
        headers: {
          'X-Etkinlik-Token': this.apiToken,
        },
        timeout: 10000,
      });

      return response.data.categories || [];
    } catch (error) {
      console.error('Etkinlik.io categories error:', error);
      return [];
    }
  }

  /**
   * Map Etkinlik.io category to our EventCategory
   */
  private mapCategory(category: string): EventCategory {
    const normalized = category.toLowerCase().trim();

    if (normalized.includes('konser') || normalized.includes('music')) {
      return 'Konser';
    }
    if (normalized.includes('spor') || normalized.includes('sport')) {
      return 'Spor';
    }
    if (normalized.includes('tiyatro') || normalized.includes('theater')) {
      return 'Tiyatro';
    }
    if (normalized.includes('festival')) {
      return 'Festival';
    }
    if (normalized.includes('sergi') || normalized.includes('exhibition')) {
      return 'Sergi';
    }

    return 'Meetup';
  }

  /**
   * Map city name to our City type
   */
  private mapCity(cityName: string): City {
    const cityMap: Record<string, City> = {
      istanbul: 'Istanbul',
      ankara: 'Ankara',
      izmir: 'Izmir',
      antalya: 'Antalya',
      bursa: 'Bursa',
    };

    const normalized = cityName.toLowerCase().trim();
    return cityMap[normalized] || 'Istanbul';
  }

  /**
   * Parse date to Turkish format
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
    });
  }

  /**
   * Parse time from date
   */
  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Normalize Etkinlik.io event to our Event format
   */
  normalizeEvent(event: EtkinlikioEvent) {
    return {
      id: `etkinlikio-${event.id}`,
      title: event.name,
      description: event.description,
      category: this.mapCategory(event.category),
      imageUrl: event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      date: this.formatDate(event.dates.start),
      time: this.formatTime(event.dates.start),
      location: event.venue?.name || 'Belirtilmemiş',
      city: this.mapCity(event.venue?.city || 'Istanbul'),
      priceMin: event.price?.min || 0,
      priceMax: event.price?.max || 0,
      organizer: event.organizer || 'Etkinlik.io',
      attendees: 0,
      latitude: event.venue?.latitude || 41.0082,
      longitude: event.venue?.longitude || 28.9784,
      source: 'etkinlikio',
    };
  }

  /**
   * Fetch events for all Turkish cities
   */
  async fetchAllTurkishEvents() {
    const cities: City[] = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'];
    const allEvents: any[] = [];

    for (const city of cities) {
      try {
        const events = await this.searchEvents({
          city,
          limit: 20,
        });

        const normalized = events.map((e: EtkinlikioEvent) =>
          this.normalizeEvent(e)
        );

        allEvents.push(...normalized);
      } catch (error) {
        console.error(`Error fetching events for ${city}:`, error);
      }
    }

    return allEvents;
  }
}

export const etkinlikioAPI = new EtkinlikioAPI();
