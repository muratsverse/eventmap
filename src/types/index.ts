export type EventCategory = 'Konser' | 'Spor' | 'Tiyatro' | 'Festival' | 'Meetup' | 'Sergi';

export type City = 'Istanbul' | 'Ankara' | 'Izmir' | 'Antalya' | 'Bursa';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl: string;
  date: string;
  time: string;
  endTime?: string; // Optional end time
  location: string;
  address?: string; // Full address for precise location
  city: City;
  price: {
    min: number;
    max: number;
  };
  organizer: string;
  attendees: number;
  maxAttendees?: number; // Maximum attendee capacity (optional)
  latitude: number;
  longitude: number;
  isPremium?: boolean;
  source?: string; // biletix, bubilet, eventbrite, etc.
  status?: 'draft' | 'inReview' | 'approved' | 'rejected'; // Moderation status
  creatorId?: string; // Event creator user ID
  createdAt?: string; // Event creation timestamp
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  coverPhoto?: string;
  isPremium: boolean;
  favorites: string[]; // event IDs
  attending: string[]; // event IDs
  created: string[]; // event IDs
}

export type TabType = 'liste' | 'harita' | 'ara' | 'profil';

export interface FilterOptions {
  categories: EventCategory[];
  cities: City[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}
