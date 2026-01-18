import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Artık premium olmadığı için herkes sınırsız etkinlik oluşturabilir
// Bu hook sadece istatistik için kullanılıyor
export function useEventCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['event-count', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', userId);

      if (error) {
        console.error('Event count error:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!userId,
  });
}
