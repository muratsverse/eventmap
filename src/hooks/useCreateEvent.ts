import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImageToSupabase, optimizeImage } from '@/lib/storage';
import type { EventCategory, City } from '@/types';

interface CreateEventData {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  endTime?: string; // Optional end time
  location: string;
  address: string; // TAM ADRES
  city: City;
  priceMin: number;
  priceMax: number;
  maxAttendees?: number; // Katılımcı kapasitesi (opsiyonel)
  imageFile?: File;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  status?: 'draft' | 'inReview' | 'approved'; // Default: inReview
}

export function useCreateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (data: CreateEventData) => {
      if (!supabaseHelpers.isConfigured()) {
        throw new Error('Supabase yapılandırılmamış');
      }

      if (!user) {
        throw new Error('Giriş yapmalısınız');
      }

      let imageUrl = data.imageUrl || '';

      // Upload image if file is provided
      if (data.imageFile) {
        // Optimize image before upload (resize to max 1920px width, compress to 85% quality)
        const optimizedFile = await optimizeImage(data.imageFile, 1920);

        // Upload to cloud storage with automatic validation
        const uploadResult = await uploadImageToSupabase(optimizedFile, user.id);

        if (!uploadResult.success) {
          throw new Error(`Görsel yüklenemedi: ${uploadResult.error}`);
        }

        imageUrl = uploadResult.url!;
      }

      // Format date to Turkish format (e.g., "15 Kasım")
      const dateObj = new Date(data.date);
      const formattedDate = dateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
      });

      // Generate unique ID
      const eventId = `user-${user.id}-${Date.now()}`;

      // Get coordinates (mock for now, can be improved with geocoding)
      const cityCoordinates: Record<City, { lat: number; lng: number }> = {
        'Istanbul': { lat: 41.0082, lng: 28.9784 },
        'Ankara': { lat: 39.9334, lng: 32.8597 },
        'Izmir': { lat: 38.4237, lng: 27.1428 },
        'Antalya': { lat: 36.8969, lng: 30.7133 },
        'Bursa': { lat: 40.1826, lng: 29.0665 },
      };

      const coords = cityCoordinates[data.city];

      // Insert event into database
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert({
          id: eventId,
          title: data.title,
          description: data.description,
          category: data.category,
          image_url: imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          date: formattedDate,
          time: data.time,
          end_time: data.endTime, // End time
          location: data.location,
          address: data.address, // TAM ADRES EKLENDI
          city: data.city,
          price_min: data.priceMin,
          price_max: data.priceMax,
          max_attendees: data.maxAttendees || null, // Katılımcı kapasitesi
          organizer: user.email || 'Kullanıcı',
          attendees: 0,
          latitude: data.latitude || coords.lat, // Kullanıcının seçtiği koordinatlar
          longitude: data.longitude || coords.lng,
          is_premium: false,
          source: 'user-created',
          creator_id: user.id,
          status: data.status || 'inReview', // Default to inReview for moderation
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Etkinlik oluşturulamadı: ${error.message}`);
      }

      return newEvent;
    },
    onSuccess: () => {
      // Invalidate events query to refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    createEvent: createEvent.mutateAsync,
    isCreating: createEvent.isPending,
    error: createEvent.error,
  };
}
