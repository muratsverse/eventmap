/**
 * Facebook Events API Integration
 *
 * Graph API for public events
 * Docs: https://developers.facebook.com/docs/graph-api/reference/event
 *
 * Important Notes:
 * - Requires Facebook App with Events API permission
 * - Only public events are accessible
 * - Requires user access token or app access token
 * - Events API access is restricted - needs approval from Meta
 *
 * Alternative: Use Facebook's official "Events from Pages" feature
 */

import axios from 'axios';
import type { EventCategory, City } from '@/types';

const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';
const ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '';

interface FacebookEvent {
  id: string;
  name: string;
  description: string;
  cover: {
    source: string;
  };
  place: {
    name: string;
    location: {
      city: string;
      latitude: number;
      longitude: number;
    };
  };
  start_time: string;
  end_time?: string;
  ticket_uri?: string;
  category: string;
  is_online: boolean;
}

interface FacebookSearchParams {
  location?: string;
  distance?: number; // in meters
  since?: string; // ISO date
  until?: string; // ISO date
  limit?: number;
}

export class FacebookEventsAPI {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || ACCESS_TOKEN;
    this.baseUrl = GRAPH_API_URL;
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return Boolean(this.accessToken);
  }

  /**
   * Search public events (DEPRECATED by Facebook)
   *
   * Note: Facebook deprecated public event search in 2018
   * This method is kept for reference but won't work without
   * special API access from Meta
   */
  async searchEvents(params: FacebookSearchParams = {}) {
    if (!this.isConfigured()) {
      console.warn('Facebook API access token not configured');
      return [];
    }

    console.warn('Facebook Events API is deprecated for public search');
    console.warn('Alternative: Fetch events from specific Pages you manage');

    return [];
  }

  /**
   * Get events from a specific Facebook Page
   * This works if you have access to the page
   */
  async getPageEvents(pageId: string) {
    if (!this.isConfigured()) {
      throw new Error('Facebook API access token not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${pageId}/events`,
        {
          params: {
            access_token: this.accessToken,
            fields: 'id,name,description,cover,place,start_time,end_time,ticket_uri,category,is_online',
            limit: 100,
          },
          timeout: 10000,
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Facebook Page Events error:', error);
      return [];
    }
  }

  /**
   * Get events from multiple pages
   */
  async getEventsFromPages(pageIds: string[]) {
    const allEvents: FacebookEvent[] = [];

    for (const pageId of pageIds) {
      try {
        const events = await this.getPageEvents(pageId);
        allEvents.push(...events);
      } catch (error) {
        console.error(`Error fetching events from page ${pageId}:`, error);
      }
    }

    return allEvents;
  }

  /**
   * Map Facebook category to our EventCategory
   */
  private mapCategory(category?: string): EventCategory {
    if (!category) return 'Meetup';

    const normalized = category.toLowerCase();

    if (normalized.includes('music') || normalized.includes('concert')) {
      return 'Konser';
    }
    if (normalized.includes('sport')) {
      return 'Spor';
    }
    if (normalized.includes('theater') || normalized.includes('arts')) {
      return 'Tiyatro';
    }
    if (normalized.includes('festival')) {
      return 'Festival';
    }
    if (normalized.includes('exhibition')) {
      return 'Sergi';
    }

    return 'Meetup';
  }

  /**
   * Map city name to our City type
   */
  private mapCity(cityName?: string): City {
    if (!cityName) return 'Istanbul';

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
   * Format date to Turkish format
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
    });
  }

  /**
   * Format time
   */
  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Normalize Facebook event to our Event format
   */
  normalizeEvent(event: FacebookEvent) {
    return {
      id: `fb-${event.id}`,
      title: event.name,
      description: event.description || 'Facebook etkinliği',
      category: this.mapCategory(event.category),
      imageUrl: event.cover?.source || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      date: this.formatDate(event.start_time),
      time: this.formatTime(event.start_time),
      location: event.place?.name || (event.is_online ? 'Online' : 'Belirtilmemiş'),
      city: this.mapCity(event.place?.location?.city),
      priceMin: 0,
      priceMax: 0,
      organizer: 'Facebook Event',
      attendees: 0,
      latitude: event.place?.location?.latitude || 41.0082,
      longitude: event.place?.location?.longitude || 28.9784,
      source: 'facebook',
    };
  }

  /**
   * Fetch events from known Turkish event organizer pages
   */
  async fetchTurkishEvents() {
    // Example page IDs - replace with actual Turkish event organizer pages
    const turkishEventPages = [
      // Add real page IDs here
      // '123456789', // Istanbul Kültür Sanat Vakfı
      // '987654321', // Zorlu PSM
      // etc.
    ];

    if (turkishEventPages.length === 0) {
      console.warn('No Facebook event pages configured');
      return [];
    }

    const events = await this.getEventsFromPages(turkishEventPages);
    return events.map((e) => this.normalizeEvent(e));
  }
}

export const facebookEventsAPI = new FacebookEventsAPI();

/**
 * IMPORTANT NOTE:
 *
 * Facebook severely restricted their Events API in 2018.
 * You can ONLY access events from:
 * 1. Pages you manage
 * 2. Events you're invited to
 * 3. Your own events
 *
 * Public event search is NO LONGER AVAILABLE.
 *
 * Alternatives:
 * 1. Partner with event organizers to get their page access
 * 2. Use Facebook's official "Events Discovery" feature
 * 3. Web scraping (violates ToS)
 * 4. Use other event platforms with better APIs
 *
 * Recommended: Focus on Instagram (better API access) or
 * direct partnerships with event venues.
 */
