/**
 * RSS Feed Parser for Turkish Event Venues
 *
 * Fetches events from:
 * - Cultural institutions with RSS feeds
 * - Public event calendars
 * - Event aggregators
 */

import Parser from 'rss-parser';
import type { Event, EventCategory, City } from '@/types';

interface RSSFeed {
  name: string;
  url: string;
  city: City;
  category: EventCategory;
  organizer: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Turkish cultural venues and their RSS feeds
// Note: Most venues don't have RSS feeds, these are examples
// You'll need to find actual RSS URLs or use web scraping
const turkishEventFeeds: RSSFeed[] = [
  {
    name: 'Istanbul Kültür Sanat Vakfı',
    url: 'https://www.iksv.org/rss', // Example - may not exist
    city: 'Istanbul',
    category: 'Festival',
    organizer: 'İKSV',
    location: 'İKSV Venues',
    latitude: 41.0082,
    longitude: 28.9784,
  },
  {
    name: 'Zorlu PSM',
    url: 'https://www.zorlupsm.com/rss', // Example - may not exist
    city: 'Istanbul',
    category: 'Konser',
    organizer: 'Zorlu PSM',
    location: 'Zorlu Center PSM',
    latitude: 41.0661,
    longitude: 29.0128,
  },
  {
    name: 'CRR Konser Salonu',
    url: 'https://www.crrkonsersalonu.org/rss', // Example
    city: 'Istanbul',
    category: 'Konser',
    organizer: 'CRR',
    location: 'Cemal Reşit Rey Konser Salonu',
    latitude: 41.0425,
    longitude: 28.9865,
  },
];

/**
 * Parse RSS feeds to extract events
 */
export class RSSFeedParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['event:startDate', 'eventStartDate'],
          ['event:endDate', 'eventEndDate'],
          ['event:location', 'eventLocation'],
        ],
      },
    });
  }

  /**
   * Fetch and parse a single RSS feed
   */
  async parseFeed(feedUrl: string, feedInfo: Omit<RSSFeed, 'url'>): Promise<Event[]> {
    try {
      const feed = await this.parser.parseURL(feedUrl);

      return feed.items.map((item, index) => {
        // Extract date from item
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        const eventDate = (item as any).eventStartDate
          ? new Date((item as any).eventStartDate)
          : pubDate;

        // Parse price from description or content
        const content = item.contentSnippet || item.content || '';
        const priceMatch = content.match(/(\d+)\s*(?:TL|₺)/i);
        const price = priceMatch ? parseInt(priceMatch[1]) : 0;

        return {
          id: `rss-${feedInfo.organizer}-${index}-${Date.now()}`,
          title: item.title || 'Etkinlik',
          description: item.contentSnippet || item.content || '',
          category: feedInfo.category,
          imageUrl: this.extractImageUrl(item) || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          date: eventDate.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          time: eventDate.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: (item as any).eventLocation || feedInfo.location,
          city: feedInfo.city,
          price: {
            min: price,
            max: price > 0 ? price * 1.5 : 0,
          },
          organizer: feedInfo.organizer,
          attendees: 0,
          latitude: feedInfo.latitude,
          longitude: feedInfo.longitude,
          source: 'rss',
        };
      });
    } catch (error) {
      console.error(`Error parsing RSS feed ${feedUrl}:`, error);
      return [];
    }
  }

  /**
   * Extract image URL from RSS item
   */
  private extractImageUrl(item: any): string | null {
    // Try different image fields
    if (item.enclosure?.url) {
      return item.enclosure.url;
    }

    if (item['media:content']?.$ && item['media:content'].$.url) {
      return item['media:content'].$.url;
    }

    if (item['media:thumbnail']?.$ && item['media:thumbnail'].$.url) {
      return item['media:thumbnail'].$.url;
    }

    // Try to find image in content
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
    if (imgMatch) {
      return imgMatch[1];
    }

    return null;
  }

  /**
   * Fetch events from all configured RSS feeds
   */
  async fetchAllFeeds(): Promise<Event[]> {
    const allEvents: Event[] = [];

    for (const feed of turkishEventFeeds) {
      try {
        const events = await this.parseFeed(feed.url, {
          name: feed.name,
          city: feed.city,
          category: feed.category,
          organizer: feed.organizer,
          location: feed.location,
          latitude: feed.latitude,
          longitude: feed.longitude,
        });

        allEvents.push(...events);
        console.log(`✅ Fetched ${events.length} events from ${feed.name}`);
      } catch (error) {
        console.error(`❌ Failed to fetch from ${feed.name}:`, error);
      }
    }

    return allEvents;
  }

  /**
   * Fetch from a custom RSS URL
   */
  async fetchCustomFeed(
    url: string,
    options: Partial<Omit<RSSFeed, 'url'>>
  ): Promise<Event[]> {
    const defaults = {
      name: 'Custom Feed',
      city: 'Istanbul' as City,
      category: 'Meetup' as EventCategory,
      organizer: 'RSS Feed',
      location: 'Belirtilmemiş',
      latitude: 41.0082,
      longitude: 28.9784,
    };

    const feedInfo = { ...defaults, ...options };

    return this.parseFeed(url, feedInfo);
  }
}

export const rssFeedParser = new RSSFeedParser();

/**
 * PUBLIC EVENT CALENDAR URLs
 *
 * Unfortunately, most Turkish venues don't provide RSS feeds.
 * Here are some alternative approaches:
 *
 * 1. iCal/ICS Calendars:
 *    - Many venues have iCal exports
 *    - Can be parsed with 'ical' npm package
 *
 * 2. JSON APIs:
 *    - Some modern venues have JSON endpoints
 *    - Check browser DevTools Network tab
 *
 * 3. Google Calendar Integration:
 *    - Many venues publish to Google Calendar
 *    - Can use Google Calendar API
 *
 * 4. Eventbrite Widget Data:
 *    - Some venues use Eventbrite embeds
 *    - Can extract from widget JSON
 *
 * Example venues to check:
 * - https://www.zorlupsm.com/etkinlikler
 * - https://www.iksv.org/tr/etkinlikler
 * - https://www.crrkonsersalonu.org/etkinlikler
 * - https://www.akm.gov.tr/etkinlikler
 * - https://www.maksem.gov.tr/
 *
 * BEST APPROACH:
 * Instead of RSS, use the venue's JSON API directly
 * (check Network tab when loading their events page)
 */
