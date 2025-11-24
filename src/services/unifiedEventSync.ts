/**
 * Unified Event Sync Service
 *
 * Orchestrates fetching events from multiple sources:
 * - Ticketmaster
 * - Eventbrite
 * - GetYourGuide
 * - Etkinlik.io
 * - Facebook Events
 * - Instagram
 * - Web scraping (Biletix, Bubilet, Biletinial)
 *
 * And syncs them to Supabase database
 */

import { supabase, supabaseHelpers } from '@/lib/supabase';
import { EventAPIService } from './eventApis';
import { getyourguideAPI } from './getyourguideApi';
import { etkinlikioAPI } from './etkinlikioApi';
import { facebookEventsAPI } from './facebookEventsApi';
import { instagramAPI } from './instagramApi';

export interface SyncResult {
  source: string;
  success: boolean;
  count: number;
  error?: string;
}

export interface SyncStats {
  total: number;
  successful: number;
  failed: number;
  results: SyncResult[];
  duration: number; // in ms
}

export class UnifiedEventSyncService {
  private eventAPIService: EventAPIService;

  constructor() {
    this.eventAPIService = new EventAPIService();
  }

  /**
   * Sync events from a single source
   */
  private async syncFromSource(
    sourceName: string,
    fetchFn: () => Promise<any[]>
  ): Promise<SyncResult> {
    const startTime = Date.now();

    try {
      console.log(`Syncing from ${sourceName}...`);

      const events = await fetchFn();

      if (!events || events.length === 0) {
        return {
          source: sourceName,
          success: true,
          count: 0,
        };
      }

      // Insert events into database
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
            source: event.source || sourceName.toLowerCase(),
          });

          if (error) {
            // Ignore duplicate key errors
            if (!error.message.includes('duplicate')) {
              console.error(`Error inserting event from ${sourceName}:`, error);
              failCount++;
            }
          } else {
            successCount++;
          }
        } catch (insertError) {
          console.error(`Insert error for ${sourceName}:`, insertError);
          failCount++;
        }
      }

      const duration = Date.now() - startTime;
      console.log(
        `${sourceName}: ${successCount} inserted, ${failCount} failed (${duration}ms)`
      );

      return {
        source: sourceName,
        success: true,
        count: successCount,
      };
    } catch (error) {
      console.error(`Error syncing from ${sourceName}:`, error);
      return {
        source: sourceName,
        success: false,
        count: 0,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Sync from Ticketmaster
   */
  async syncTicketmaster(): Promise<SyncResult> {
    return this.syncFromSource('Ticketmaster', async () => {
      const ticketmaster = this.eventAPIService.getTicketmasterAPI();
      if (!ticketmaster.isConfigured()) {
        console.warn('Ticketmaster API not configured');
        return [];
      }
      return ticketmaster.fetchAllEvents({ city: 'Istanbul' });
    });
  }

  /**
   * Sync from Eventbrite
   */
  async syncEventbrite(): Promise<SyncResult> {
    return this.syncFromSource('Eventbrite', async () => {
      const eventbrite = this.eventAPIService.getEventbriteAPI();
      if (!eventbrite.isConfigured()) {
        console.warn('Eventbrite API not configured');
        return [];
      }
      return eventbrite.fetchAllEvents({ location: 'Istanbul, Turkey' });
    });
  }

  /**
   * Sync from GetYourGuide
   */
  async syncGetYourGuide(): Promise<SyncResult> {
    return this.syncFromSource('GetYourGuide', async () => {
      if (!getyourguideAPI.isConfigured()) {
        console.warn('GetYourGuide API not configured');
        return [];
      }
      return getyourguideAPI.fetchTurkishActivities();
    });
  }

  /**
   * Sync from Etkinlik.io
   */
  async syncEtkinlikio(): Promise<SyncResult> {
    return this.syncFromSource('Etkinlik.io', async () => {
      if (!etkinlikioAPI.isConfigured()) {
        console.warn('Etkinlik.io API not configured');
        return [];
      }
      return etkinlikioAPI.fetchAllTurkishEvents();
    });
  }

  /**
   * Sync from Facebook Events
   */
  async syncFacebook(): Promise<SyncResult> {
    return this.syncFromSource('Facebook', async () => {
      if (!facebookEventsAPI.isConfigured()) {
        console.warn('Facebook API not configured');
        return [];
      }
      return facebookEventsAPI.fetchTurkishEvents();
    });
  }

  /**
   * Sync from Instagram
   */
  async syncInstagram(): Promise<SyncResult> {
    return this.syncFromSource('Instagram', async () => {
      if (!instagramAPI.isConfigured()) {
        console.warn('Instagram API not configured');
        return [];
      }
      return instagramAPI.fetchEventPosts();
    });
  }

  /**
   * Sync from all sources
   */
  async syncAll(): Promise<SyncStats> {
    if (!supabaseHelpers.isConfigured()) {
      throw new Error('Supabase not configured');
    }

    const startTime = Date.now();

    console.log('Starting unified event sync...');

    // Run all syncs in parallel
    const results = await Promise.all([
      this.syncTicketmaster(),
      this.syncEventbrite(),
      this.syncGetYourGuide(),
      this.syncEtkinlikio(),
      this.syncFacebook(),
      this.syncInstagram(),
    ]);

    const duration = Date.now() - startTime;

    const stats: SyncStats = {
      total: results.reduce((sum, r) => sum + r.count, 0),
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
      duration,
    };

    console.log('Unified sync completed:', stats);

    return stats;
  }

  /**
   * Sync from specific sources
   */
  async syncSources(sources: string[]): Promise<SyncStats> {
    const startTime = Date.now();
    const results: SyncResult[] = [];

    for (const source of sources) {
      switch (source.toLowerCase()) {
        case 'ticketmaster':
          results.push(await this.syncTicketmaster());
          break;
        case 'eventbrite':
          results.push(await this.syncEventbrite());
          break;
        case 'getyourguide':
          results.push(await this.syncGetYourGuide());
          break;
        case 'etkinlikio':
          results.push(await this.syncEtkinlikio());
          break;
        case 'facebook':
          results.push(await this.syncFacebook());
          break;
        case 'instagram':
          results.push(await this.syncInstagram());
          break;
        default:
          console.warn(`Unknown source: ${source}`);
      }
    }

    const duration = Date.now() - startTime;

    return {
      total: results.reduce((sum, r) => sum + r.count, 0),
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
      duration,
    };
  }
}

export const unifiedEventSync = new UnifiedEventSyncService();
