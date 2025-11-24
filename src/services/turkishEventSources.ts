/**
 * Turkish Event Sources Integration
 *
 * Popular Turkish event platforms:
 * - Biletix (biletix.com) - Largest ticketing platform
 * - Bubilet (bubilet.com) - Second largest platform
 * - Mobilet (mobilet.com) - Mobile-first platform
 * - Passo (passo.com.tr) - Sports events
 * - Etkinlik.io - Event aggregator
 * - KolayBilet - Concert tickets
 */

import axios from 'axios';
import type { Event, EventCategory, City } from '@/types';

/**
 * IMPORTANT: These platforms don't have public APIs
 * Options:
 * 1. Web scraping (requires proxy/headless browser)
 * 2. RSS feeds (if available)
 * 3. Partnership/API access request
 * 4. Use public event calendars
 */

// ===========================================
// Option 1: Public Event Calendars
// ===========================================

interface PublicEventCalendar {
  name: string;
  url: string;
  format: 'ical' | 'json' | 'rss';
}

export const publicEventCalendars: PublicEventCalendar[] = [
  {
    name: 'Istanbul Kültür Sanat Vakfı',
    url: 'https://www.iksv.org/tr/etkinlikler',
    format: 'json',
  },
  {
    name: 'Zorlu PSM',
    url: 'https://www.zorlupsm.com/etkinlikler',
    format: 'json',
  },
  {
    name: 'CRR - Cemal Reşit Rey',
    url: 'https://www.crrkonsersalonu.org/etkinlikler',
    format: 'json',
  },
];

// ===========================================
// Option 2: Mock Data for Testing
// ===========================================

export class TurkishEventSourcesAPI {
  /**
   * Fetch from Biletix (requires web scraping or partnership)
   */
  async fetchBiletixEvents(): Promise<Event[]> {
    console.warn('Biletix API not available - requires web scraping or partnership');

    // For now, return empty array
    // TODO: Implement web scraping with Puppeteer/Playwright
    return [];
  }

  /**
   * Fetch from Bubilet
   */
  async fetchBubiletEvents(): Promise<Event[]> {
    console.warn('Bubilet API not available - requires web scraping or partnership');
    return [];
  }

  /**
   * Fetch from Mobilet
   */
  async fetchMobiletEvents(): Promise<Event[]> {
    console.warn('Mobilet API not available - requires web scraping or partnership');
    return [];
  }

  /**
   * Fetch from Passo (Sports events)
   */
  async fetchPassoEvents(): Promise<Event[]> {
    console.warn('Passo API not available - requires web scraping or partnership');
    return [];
  }

  /**
   * Fetch from Etkinlik.io (Event aggregator)
   */
  async fetchEtkinlikioEvents(): Promise<Event[]> {
    console.warn('Etkinlik.io API not available');
    return [];
  }

  /**
   * Generic web scraper for event pages
   */
  async scrapeEventPage(url: string): Promise<Event[]> {
    // This would require a backend service with Puppeteer/Playwright
    console.warn('Web scraping requires backend service');
    return [];
  }
}

export const turkishEventSources = new TurkishEventSourcesAPI();

// ===========================================
// Option 3: Community-Sourced Events
// ===========================================

/**
 * Allow users to submit events from these platforms
 * This creates a community-driven event database
 */
export const supportedPlatforms = [
  'Biletix',
  'Bubilet',
  'Mobilet',
  'Passo',
  'Etkinlik.io',
  'KolayBilet',
  'Facebook',
  'Instagram',
  'Eventbrite',
  'Ticketmaster',
];

/**
 * Parse event URL to extract platform
 */
export function detectPlatform(url: string): string | null {
  const patterns: Record<string, RegExp> = {
    Biletix: /biletix\.com/i,
    Bubilet: /bubilet\.com/i,
    Mobilet: /mobilet\.com/i,
    Passo: /passo\.com\.tr/i,
    'Etkinlik.io': /etkinlik\.io/i,
    KolayBilet: /kolaybilet\.com/i,
    Facebook: /facebook\.com\/events/i,
    Instagram: /instagram\.com\/p\//i,
    Eventbrite: /eventbrite\.com/i,
    Ticketmaster: /ticketmaster\.com/i,
  };

  for (const [platform, pattern] of Object.entries(patterns)) {
    if (pattern.test(url)) {
      return platform;
    }
  }

  return null;
}

/**
 * Extract event ID from URL
 */
export function extractEventId(url: string): string | null {
  // Biletix: https://www.biletix.com/etkinlik/ABC123/TURKIYE/tr
  const biletixMatch = url.match(/biletix\.com\/etkinlik\/([^\/]+)/i);
  if (biletixMatch) return biletixMatch[1];

  // Bubilet: https://www.bubilet.com.tr/etkinlik/abc-123
  const bubiletMatch = url.match(/bubilet\.com\.tr\/etkinlik\/([^\/]+)/i);
  if (bubiletMatch) return bubiletMatch[1];

  // Facebook: https://www.facebook.com/events/123456789
  const facebookMatch = url.match(/facebook\.com\/events\/(\d+)/i);
  if (facebookMatch) return facebookMatch[1];

  // Instagram: https://www.instagram.com/p/ABC123/
  const instagramMatch = url.match(/instagram\.com\/p\/([^\/]+)/i);
  if (instagramMatch) return instagramMatch[1];

  return null;
}
