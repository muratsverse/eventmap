import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { mockEvents } from '@/data/mockData';
import type { Event } from '@/types';

// Convert database event to app event format
const dbToEvent = (dbEvent: any): Event => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: dbEvent.description,
  category: dbEvent.category,
  imageUrl: dbEvent.image_url,
  date: dbEvent.date,
  time: dbEvent.time,
  endTime: dbEvent.end_time,
  location: dbEvent.location,
  address: dbEvent.address, // TAM ADRES
  city: dbEvent.city,
  price: {
    min: dbEvent.price_min,
    max: dbEvent.price_max,
  },
  organizer: dbEvent.organizer,
  // Use real attendee count if available, otherwise fallback to static count
  attendees: dbEvent.attendee_count ?? dbEvent.attendees,
  maxAttendees: dbEvent.max_attendees ?? undefined,
  latitude: dbEvent.latitude,
  longitude: dbEvent.longitude,
  isPremium: dbEvent.is_premium,
  source: dbEvent.source,
  status: dbEvent.status as 'draft' | 'inReview' | 'approved' | 'rejected',
  creatorId: dbEvent.creator_id, // Etkinlik sahibi
  createdAt: dbEvent.created_at, // Oluşturulma tarihi
});

export function useEvents(filters?: {
  categories?: string[];
  cities?: string[];
}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      // If Supabase not configured, return mock data
      if (!supabaseHelpers.isConfigured()) {
        let events = mockEvents;

        // Apply filters to mock data
        if (filters?.categories && filters.categories.length > 0) {
          events = events.filter((e) => filters.categories!.includes(e.category));
        }
        if (filters?.cities && filters.cities.length > 0) {
          events = events.filter((e) => filters.cities!.includes(e.city));
        }

        return events;
      }

      // Query from Supabase - sadece onaylanmış etkinlikleri getir
      // En son oluşturulan etkinlikler önce gösterilsin
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved') // Sadece admin tarafından onaylanmış etkinlikler
        .order('created_at', { ascending: false }); // En yeni önce

      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }
      if (filters?.cities && filters.cities.length > 0) {
        query = query.in('city', filters.cities);
      }

      const { data: eventsData, error } = await query;

      if (error) throw error;

      // Get attendee counts for all events (sadece görünür olanlar)
      const { data: attendancesData } = await supabase
        .from('attendances')
        .select('event_id')
        .is('hidden_at', null);

      // Count attendees per event
      const attendeeCounts: Record<string, number> = {};
      attendancesData?.forEach((attendance) => {
        attendeeCounts[attendance.event_id] = (attendeeCounts[attendance.event_id] || 0) + 1;
      });

      // Merge attendee counts with events
      return eventsData.map((event) =>
        dbToEvent({
          ...event,
          attendee_count: attendeeCounts[event.id] || 0,
        })
      );
    },
  });
}

// Kullanıcının oluşturduğu tüm etkinlikleri getir (onaysız dahil)
export function useUserCreatedEvents(userId?: string) {
  return useQuery({
    queryKey: ['user-created-events', userId],
    queryFn: async () => {
      if (!userId || !supabaseHelpers.isConfigured()) {
        return [];
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((event) => dbToEvent(event));
    },
    enabled: Boolean(userId),
  });
}

export function useNearbyEvents(latitude?: number, longitude?: number, distanceKm: number = 10) {
  return useQuery({
    queryKey: ['nearby-events', latitude, longitude, distanceKm],
    queryFn: async () => {
      if (!latitude || !longitude || !supabaseHelpers.isConfigured()) {
        return [];
      }

      const { data, error } = await supabase.rpc('nearby_events', {
        lat: latitude,
        long: longitude,
        distance_km: distanceKm,
      });

      if (error) throw error;

      return data;
    },
    enabled: Boolean(latitude && longitude),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: Partial<Event> & { creatorId: string }) => {
      if (!supabaseHelpers.isConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title!,
          description: eventData.description!,
          category: eventData.category!,
          image_url: eventData.imageUrl || '',
          date: eventData.date!,
          time: eventData.time!,
          location: eventData.location!,
          city: eventData.city!,
          price_min: eventData.price?.min || 0,
          price_max: eventData.price?.max || 0,
          organizer: eventData.organizer!,
          latitude: eventData.latitude!,
          longitude: eventData.longitude!,
          creator_id: eventData.creatorId,
        })
        .select()
        .single();

      if (error) throw error;

      return dbToEvent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
