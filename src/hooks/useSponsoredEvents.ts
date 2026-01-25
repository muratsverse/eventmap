import { useQuery } from '@tanstack/react-query';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import type { Event } from '@/types';

interface SponsoredEvent extends Event {
  sponsor_tier: 'basic' | 'premium' | 'featured';
  sponsored_until: string;
}

// Aktif sponsorlu etkinlikleri getir
export function useSponsoredEvents() {
  return useQuery({
    queryKey: ['sponsored-events'],
    queryFn: async (): Promise<SponsoredEvent[]> => {
      if (!supabaseHelpers.isConfigured()) {
        return [];
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_sponsored', true)
        .eq('status', 'approved')
        .gt('sponsored_until', new Date().toISOString())
        .order('sponsor_tier', { ascending: true }) // featured > premium > basic
        .order('sponsored_until', { ascending: false })
        .limit(5); // En fazla 5 sponsorlu etkinlik

      if (error) {
        console.error('Sponsorlu etkinlik hatası:', error);
        return [];
      }

      return (data || []).map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        imageUrl: event.image_url,
        date: event.date,
        time: event.time,
        endTime: event.end_time,
        location: event.location,
        address: event.address,
        city: event.city,
        price: {
          min: event.price_min,
          max: event.price_max,
        },
        organizer: event.organizer,
        attendees: event.attendees,
        maxAttendees: event.max_attendees,
        latitude: event.latitude,
        longitude: event.longitude,
        isPremium: event.is_premium,
        source: event.source,
        status: event.status,
        sponsor_tier: event.sponsor_tier as 'basic' | 'premium' | 'featured',
        sponsored_until: event.sponsored_until,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 dakika cache
    refetchInterval: 1000 * 60 * 5, // 5 dakikada bir yenile
  });
}

// Sponsorluk fiyatlarını getir
export function useSponsorshipPrices() {
  return useQuery({
    queryKey: ['sponsorship-prices'],
    queryFn: async () => {
      if (!supabaseHelpers.isConfigured()) {
        // Varsayılan fiyatlar
        return [
          { tier: 'basic', duration_days: 1, price: 29.99 },
          { tier: 'basic', duration_days: 7, price: 149.99 },
          { tier: 'basic', duration_days: 30, price: 449.99 },
          { tier: 'premium', duration_days: 1, price: 59.99 },
          { tier: 'premium', duration_days: 7, price: 299.99 },
          { tier: 'premium', duration_days: 30, price: 899.99 },
          { tier: 'featured', duration_days: 1, price: 99.99 },
          { tier: 'featured', duration_days: 7, price: 499.99 },
          { tier: 'featured', duration_days: 30, price: 1499.99 },
        ];
      }

      const { data, error } = await supabase
        .from('sponsorship_prices')
        .select('*')
        .eq('is_active', true)
        .order('tier')
        .order('duration_days');

      if (error) {
        console.error('Fiyat hatası:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 saat cache
  });
}

// Etkinliği sponsorlu yap
export async function sponsorEvent(
  eventId: string,
  tier: 'basic' | 'premium' | 'featured',
  durationDays: number,
  paymentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseHelpers.isConfigured()) {
    return { success: false, error: 'Supabase yapılandırılmamış' };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  try {
    // Önce satın alma kaydı oluştur
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { success: false, error: 'Giriş yapmalısınız' };
    }

    // Fiyatı al
    const { data: priceData } = await supabase
      .from('sponsorship_prices')
      .select('price')
      .eq('tier', tier)
      .eq('duration_days', durationDays)
      .single();

    // Satın alma kaydı
    const { error: purchaseError } = await supabase
      .from('sponsorship_purchases')
      .insert({
        event_id: eventId,
        user_id: userData.user.id,
        tier,
        duration_days: durationDays,
        amount_paid: priceData?.price || 0,
        payment_id: paymentId,
        status: 'completed',
        expires_at: expiresAt.toISOString(),
      });

    if (purchaseError) {
      console.error('Satın alma hatası:', purchaseError);
      return { success: false, error: 'Satın alma kaydı oluşturulamadı' };
    }

    // Etkinliği sponsorlu yap
    const { error: updateError } = await supabase
      .from('events')
      .update({
        is_sponsored: true,
        sponsor_tier: tier,
        sponsored_until: expiresAt.toISOString(),
      })
      .eq('id', eventId);

    if (updateError) {
      console.error('Güncelleme hatası:', updateError);
      return { success: false, error: 'Etkinlik güncellenemedi' };
    }

    return { success: true };
  } catch (error) {
    console.error('Sponsorluk hatası:', error);
    return { success: false, error: 'Bir hata oluştu' };
  }
}
