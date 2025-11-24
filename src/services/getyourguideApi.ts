/**
 * GetYourGuide API Integration
 *
 * Official Partner API for tours and activities
 * Docs: https://code.getyourguide.com/partner-api-spec/
 *
 * Note: Requires partner account and API key
 * Apply: https://partner.getyourguide.com/
 */

import axios from 'axios';
import type { EventCategory, City } from '@/types';

const API_BASE_URL = 'https://api.getyourguide.com';
const API_KEY = import.meta.env.VITE_GETYOURGUIDE_API_KEY || '';

interface GetYourGuideActivity {
  id: number;
  title: string;
  description: string;
  images: Array<{ url: string }>;
  location: {
    name: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  price: {
    from: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  duration: string;
  categories: string[];
}

interface GetYourGuideSearchParams {
  city?: string;
  category?: string;
  limit?: number;
  currency?: string;
  language?: string;
}

export class GetYourGuideAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY;
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Search activities/tours
   */
  async searchActivities(params: GetYourGuideSearchParams = {}) {
    if (!this.isConfigured()) {
      console.warn('GetYourGuide API key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/1/activities`, {
        params: {
          api_key: this.apiKey,
          q: params.city || 'Istanbul',
          limit: params.limit || 20,
          currency: params.currency || 'TRY',
          lang: params.language || 'tr',
        },
        timeout: 10000,
      });

      return response.data.data || [];
    } catch (error) {
      console.error('GetYourGuide API error:', error);
      return [];
    }
  }

  /**
   * Get activity details by ID
   */
  async getActivityDetails(activityId: number) {
    if (!this.isConfigured()) {
      throw new Error('GetYourGuide API key not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/1/activities/${activityId}`,
        {
          params: {
            api_key: this.apiKey,
            lang: 'tr',
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('GetYourGuide API error:', error);
      throw error;
    }
  }

  /**
   * Map GetYourGuide category to our EventCategory
   */
  private mapCategory(gygCategories: string[]): EventCategory {
    const categoryMap: Record<string, EventCategory> = {
      concerts: 'Konser',
      sports: 'Spor',
      theater: 'Tiyatro',
      festivals: 'Festival',
      exhibitions: 'Sergi',
      tours: 'Meetup',
    };

    for (const cat of gygCategories) {
      const mapped = categoryMap[cat.toLowerCase()];
      if (mapped) return mapped;
    }

    return 'Sergi'; // Default
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
   * Normalize GetYourGuide activity to our Event format
   */
  normalizeActivity(activity: GetYourGuideActivity) {
    return {
      id: `gyg-${activity.id}`,
      title: activity.title,
      description: activity.description,
      category: this.mapCategory(activity.categories || []),
      imageUrl: activity.images[0]?.url || '',
      date: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      }),
      time: '00:00', // GetYourGuide doesn't always have specific times
      location: activity.location.name,
      city: this.mapCity(activity.location.city),
      priceMin: activity.price.from,
      priceMax: activity.price.from * 1.5, // Estimate
      organizer: 'GetYourGuide',
      attendees: activity.reviewCount || 0,
      latitude: activity.location.latitude,
      longitude: activity.location.longitude,
      source: 'getyourguide',
    };
  }

  /**
   * Fetch and normalize activities for Turkish cities
   */
  async fetchTurkishActivities() {
    const cities: City[] = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'];
    const allActivities: any[] = [];

    for (const city of cities) {
      try {
        const activities = await this.searchActivities({
          city,
          limit: 10,
        });

        const normalized = activities.map((a: GetYourGuideActivity) =>
          this.normalizeActivity(a)
        );

        allActivities.push(...normalized);
      } catch (error) {
        console.error(`Error fetching activities for ${city}:`, error);
      }
    }

    return allActivities;
  }
}

export const getyourguideAPI = new GetYourGuideAPI();
