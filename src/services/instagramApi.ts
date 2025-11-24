/**
 * Instagram Basic Display API Integration
 *
 * Note: Instagram doesn't have a dedicated "Events" API
 * This service searches for event-related posts using hashtags
 *
 * Docs: https://developers.facebook.com/docs/instagram-basic-display-api
 *
 * Limitations:
 * - Only works for accounts that authorize your app
 * - No public search API
 * - Need to parse captions for event info
 *
 * Alternative: Instagram Graph API (for business accounts)
 * https://developers.facebook.com/docs/instagram-api
 */

import axios from 'axios';
import type { EventCategory, City } from '@/types';

const GRAPH_API_URL = 'https://graph.instagram.com';
const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || '';

interface InstagramMedia {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  username: string;
}

export class InstagramAPI {
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
   * Get user's media
   * Note: Only works for authorized users
   */
  async getUserMedia(userId: string = 'me') {
    if (!this.isConfigured()) {
      throw new Error('Instagram API access token not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${userId}/media`,
        {
          params: {
            access_token: this.accessToken,
            fields: 'id,caption,media_type,media_url,permalink,timestamp,username',
            limit: 50,
          },
          timeout: 10000,
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Instagram API error:', error);
      return [];
    }
  }

  /**
   * Search for event-related hashtags in captions
   */
  private containsEventHashtags(caption: string): boolean {
    const eventHashtags = [
      '#etkinlik',
      '#event',
      '#konser',
      '#concert',
      '#festival',
      '#tiyatro',
      '#theater',
      '#spor',
      '#sport',
      '#istanbul',
      '#ankara',
      '#izmir',
    ];

    const lowerCaption = caption.toLowerCase();
    return eventHashtags.some((tag) => lowerCaption.includes(tag));
  }

  /**
   * Extract event info from caption (basic NLP)
   */
  private parseEventInfo(caption: string) {
    const dateRegex = /(\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık))/i;
    const timeRegex = /(\d{1,2}:\d{2})/;
    const priceRegex = /(\d+)\s*(?:TL|₺)/i;

    const dateMatch = caption.match(dateRegex);
    const timeMatch = caption.match(timeRegex);
    const priceMatch = caption.match(priceRegex);

    return {
      date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      }),
      time: timeMatch ? timeMatch[1] : '20:00',
      price: priceMatch ? parseInt(priceMatch[1]) : 0,
    };
  }

  /**
   * Detect city from caption
   */
  private detectCity(caption: string): City {
    const lowerCaption = caption.toLowerCase();

    if (lowerCaption.includes('istanbul')) return 'Istanbul';
    if (lowerCaption.includes('ankara')) return 'Ankara';
    if (lowerCaption.includes('izmir')) return 'Izmir';
    if (lowerCaption.includes('antalya')) return 'Antalya';
    if (lowerCaption.includes('bursa')) return 'Bursa';

    return 'Istanbul';
  }

  /**
   * Detect category from caption
   */
  private detectCategory(caption: string): EventCategory {
    const lowerCaption = caption.toLowerCase();

    if (lowerCaption.includes('konser') || lowerCaption.includes('concert')) {
      return 'Konser';
    }
    if (lowerCaption.includes('spor') || lowerCaption.includes('sport') || lowerCaption.includes('maç')) {
      return 'Spor';
    }
    if (lowerCaption.includes('tiyatro') || lowerCaption.includes('theater')) {
      return 'Tiyatro';
    }
    if (lowerCaption.includes('festival')) {
      return 'Festival';
    }
    if (lowerCaption.includes('sergi') || lowerCaption.includes('exhibition')) {
      return 'Sergi';
    }

    return 'Meetup';
  }

  /**
   * Normalize Instagram post to Event format
   */
  normalizePost(media: InstagramMedia) {
    const { date, time, price } = this.parseEventInfo(media.caption || '');

    return {
      id: `ig-${media.id}`,
      title: media.caption?.split('\n')[0]?.slice(0, 100) || 'Instagram Etkinliği',
      description: media.caption || 'Instagram\'dan paylaşılan etkinlik',
      category: this.detectCategory(media.caption || ''),
      imageUrl: media.media_url,
      date,
      time,
      location: 'Instagram\'dan',
      city: this.detectCity(media.caption || ''),
      priceMin: price,
      priceMax: price * 1.5,
      organizer: `@${media.username}`,
      attendees: 0,
      latitude: 41.0082,
      longitude: 28.9784,
      source: 'instagram',
    };
  }

  /**
   * Filter and convert event-related posts
   */
  async fetchEventPosts() {
    if (!this.isConfigured()) {
      console.warn('Instagram API not configured');
      return [];
    }

    try {
      const media = await this.getUserMedia();

      // Filter posts that look like events
      const eventPosts = media.filter((post: InstagramMedia) =>
        post.caption && this.containsEventHashtags(post.caption)
      );

      return eventPosts.map((post: InstagramMedia) => this.normalizePost(post));
    } catch (error) {
      console.error('Instagram event parsing error:', error);
      return [];
    }
  }
}

export const instagramAPI = new InstagramAPI();

/**
 * IMPORTANT NOTES:
 *
 * Instagram API Limitations:
 * 1. No public search API - can only access authorized accounts
 * 2. Rate limits: 200 requests per hour
 * 3. Need Instagram Business Account for advanced features
 * 4. Event detection is based on caption parsing (not 100% accurate)
 *
 * Better Alternatives:
 * 1. Partner with event organizers directly
 * 2. Use Instagram's Official Partners (like Hootsuite, Buffer)
 * 3. Focus on venues/organizers who share events publicly
 * 4. Use dedicated event platforms (GetYourGuide, Eventbrite, etc.)
 *
 * Recommendation:
 * Instead of scraping Instagram, focus on:
 * - Direct API integrations (Ticketmaster, Eventbrite)
 * - User-generated content (your platform)
 * - Partnerships with event organizers
 */
