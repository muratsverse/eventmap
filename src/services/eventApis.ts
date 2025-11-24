import axios from 'axios';
import type { Event, EventCategory, City } from '@/types';

// Ticketmaster API Integration
export class TicketmasterAPI {
  private apiKey: string;
  private baseUrl = 'https://app.ticketmaster.com/discovery/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchEvents(params: {
    city?: string;
    category?: string;
    startDate?: string;
    size?: number;
  }): Promise<Event[]> {
    if (!this.apiKey) {
      console.warn('Ticketmaster API key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/events.json`, {
        params: {
          apikey: this.apiKey,
          city: params.city,
          classificationName: this.mapCategory(params.category),
          startDateTime: params.startDate,
          size: params.size || 20,
          countryCode: 'TR',
        },
      });

      const events = response.data._embedded?.events || [];
      return events.map((event: any) => this.convertToEvent(event));
    } catch (error) {
      console.error('Ticketmaster API error:', error);
      return [];
    }
  }

  private mapCategory(category?: string): string | undefined {
    const categoryMap: Record<string, string> = {
      Konser: 'Music',
      Spor: 'Sports',
      Tiyatro: 'Arts & Theatre',
      Festival: 'Festival',
    };
    return category ? categoryMap[category] : undefined;
  }

  private convertToEvent(tmEvent: any): Event {
    const venue = tmEvent._embedded?.venues?.[0];
    const priceRange = tmEvent.priceRanges?.[0];

    return {
      id: `tm-${tmEvent.id}`,
      title: tmEvent.name,
      description: tmEvent.info || tmEvent.pleaseNote || '',
      category: this.reverseMapCategory(tmEvent.classifications?.[0]?.segment?.name) as EventCategory,
      imageUrl: tmEvent.images?.[0]?.url || '',
      date: new Date(tmEvent.dates.start.dateTime).toLocaleDateString('tr-TR'),
      time: new Date(tmEvent.dates.start.dateTime).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: venue?.name || '',
      city: this.mapCity(venue?.city?.name) as City,
      price: {
        min: priceRange?.min || 0,
        max: priceRange?.max || 0,
      },
      organizer: tmEvent.promoter?.name || 'Ticketmaster',
      attendees: 0,
      latitude: parseFloat(venue?.location?.latitude) || 0,
      longitude: parseFloat(venue?.location?.longitude) || 0,
      source: 'ticketmaster',
    };
  }

  private reverseMapCategory(tmCategory: string): string {
    const reverseMap: Record<string, string> = {
      Music: 'Konser',
      Sports: 'Spor',
      'Arts & Theatre': 'Tiyatro',
      Festival: 'Festival',
    };
    return reverseMap[tmCategory] || 'Konser';
  }

  private mapCity(cityName: string): string {
    const cityMap: Record<string, string> = {
      Istanbul: 'Istanbul',
      Ankara: 'Ankara',
      Izmir: 'Izmir',
      Antalya: 'Antalya',
      Bursa: 'Bursa',
    };
    return cityMap[cityName] || 'Istanbul';
  }
}

// Eventbrite API Integration
export class EventbriteAPI {
  private apiKey: string;
  private baseUrl = 'https://www.eventbriteapi.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchEvents(params: {
    location?: string;
    category?: string;
    startDate?: string;
  }): Promise<Event[]> {
    if (!this.apiKey) {
      console.warn('Eventbrite API key not configured');
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/events/search/`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        params: {
          'location.address': params.location || 'Turkey',
          'categories': params.category,
          'start_date.range_start': params.startDate,
          expand: 'venue,ticket_availability',
        },
      });

      const events = response.data.events || [];
      return events.map((event: any) => this.convertToEvent(event));
    } catch (error) {
      console.error('Eventbrite API error:', error);
      return [];
    }
  }

  private convertToEvent(ebEvent: any): Event {
    const venue = ebEvent.venue;

    return {
      id: `eb-${ebEvent.id}`,
      title: ebEvent.name.text,
      description: ebEvent.description.text || '',
      category: 'Meetup' as EventCategory,
      imageUrl: ebEvent.logo?.url || '',
      date: new Date(ebEvent.start.local).toLocaleDateString('tr-TR'),
      time: new Date(ebEvent.start.local).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: venue?.name || '',
      city: 'Istanbul' as City,
      price: {
        min: ebEvent.is_free ? 0 : 50,
        max: ebEvent.is_free ? 0 : 200,
      },
      organizer: ebEvent.organizer?.name || 'Eventbrite',
      attendees: 0,
      latitude: parseFloat(venue?.latitude) || 0,
      longitude: parseFloat(venue?.longitude) || 0,
      source: 'eventbrite',
    };
  }
}

// Service factory
export class EventAPIService {
  private ticketmaster: TicketmasterAPI;
  private eventbrite: EventbriteAPI;

  constructor() {
    this.ticketmaster = new TicketmasterAPI(
      import.meta.env.VITE_TICKETMASTER_API_KEY || ''
    );
    this.eventbrite = new EventbriteAPI(
      import.meta.env.VITE_EVENTBRITE_API_KEY || ''
    );
  }

  async fetchAllEvents(params?: {
    city?: string;
    category?: string;
  }): Promise<Event[]> {
    try {
      const [tmEvents, ebEvents] = await Promise.all([
        this.ticketmaster.searchEvents({
          city: params?.city,
          category: params?.category,
        }),
        this.eventbrite.searchEvents({
          location: params?.city,
          category: params?.category,
        }),
      ]);

      return [...tmEvents, ...ebEvents];
    } catch (error) {
      console.error('Error fetching events from APIs:', error);
      return [];
    }
  }

  // Sync events to Supabase
  async syncEventsToDatabase(events: Event[], supabase: any) {
    try {
      const eventsToInsert = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        image_url: event.imageUrl,
        date: event.date,
        time: event.time,
        location: event.location,
        city: event.city,
        price_min: event.price.min,
        price_max: event.price.max,
        organizer: event.organizer,
        attendees: event.attendees,
        latitude: event.latitude,
        longitude: event.longitude,
        source: event.source,
      }));

      const { error } = await supabase
        .from('events')
        .upsert(eventsToInsert, { onConflict: 'id' });

      if (error) throw error;

      console.log(`Synced ${events.length} events to database`);
    } catch (error) {
      console.error('Error syncing events to database:', error);
    }
  }
}
