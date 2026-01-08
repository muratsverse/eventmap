import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useEventCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['event-count', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      if (error) {
        console.error('Event count error:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!userId,
  });
}
