import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user || !supabaseHelpers.isConfigured()) {
        return [];
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map((f) => f.event_id);
    },
    enabled: Boolean(user),
  });

  const addFavorite = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user || !supabaseHelpers.isConfigured()) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user || !supabaseHelpers.isConfigured()) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const isFavorite = (eventId: string) => {
    return favoritesQuery.data?.includes(eventId) || false;
  };

  const toggleFavorite = (eventId: string) => {
    if (isFavorite(eventId)) {
      removeFavorite.mutate(eventId);
    } else {
      addFavorite.mutate(eventId);
    }
  };

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
  };
}

// Hook to get attendees of a specific event
export function useEventAttendees(eventId: string | null) {
  const query = useQuery({
    queryKey: ['event-attendees', eventId],
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
    queryFn: async () => {
      console.log('🔍 [useEventAttendees] Query başladı');
      console.log('🔍 [useEventAttendees] Event ID:', eventId);
      console.log('🔍 [useEventAttendees] Supabase configured:', supabaseHelpers.isConfigured());

      if (!eventId || !supabaseHelpers.isConfigured()) {
        console.log('❌ [useEventAttendees] Event ID yok veya Supabase yapılandırılmamış');
        return [];
      }

      console.log('📡 [useEventAttendees] Supabase query başlatılıyor...');

      // Step 1: Get all attendances for this event
      const { data: attendancesData, error: attendancesError } = await supabase
        .from('attendances')
        .select('user_id')
        .eq('event_id', eventId);

      console.log('📡 [useEventAttendees] Attendances response:', { attendancesData, attendancesError });

      if (attendancesError) {
        console.error('❌ [useEventAttendees] Attendances error:', attendancesError);
        throw attendancesError;
      }

      if (!attendancesData || attendancesData.length === 0) {
        console.log('⚠️ [useEventAttendees] No attendances found for this event');
        return [];
      }

      console.log('✅ [useEventAttendees] Found attendances:', attendancesData.length);

      // Step 2: Get user_ids
      const userIds = attendancesData.map((a: any) => a.user_id);
      console.log('👥 [useEventAttendees] User IDs:', userIds);

      // Step 3: Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, profile_photo')
        .in('id', userIds);

      console.log('📡 [useEventAttendees] Profiles response:', { profilesData, profilesError });

      if (profilesError) {
        console.error('❌ [useEventAttendees] Profiles error:', profilesError);
        // Don't throw - return attendees without profile data
      }

      // Step 4: Map attendances with profile data
      const attendees = attendancesData.map((attendance: any, index: number) => {
        const profile = profilesData?.find((p: any) => p.id === attendance.user_id);
        const attendee = {
          id: profile?.id || attendance.user_id,
          name: profile?.name || `Kullanıcı ${index + 1}`,
          email: profile?.email || '',
          profile_photo: profile?.profile_photo || null,
          hasProfile: profile !== null && profile !== undefined,
        };
        console.log(`👤 [useEventAttendees] Attendee ${index + 1}:`, attendee);
        return attendee;
      });

      console.log('✅ [useEventAttendees] Final attendees array:', attendees);
      console.log('✅ [useEventAttendees] Total count:', attendees.length);

      return attendees;
    },
    enabled: Boolean(eventId),
  });

  console.log('🎯 [useEventAttendees] Hook return:', {
    attendees: query.data || [],
    count: query.data?.length || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  });

  return {
    attendees: query.data || [],
    isLoading: query.isLoading,
    count: query.data?.length || 0,
  };
}

export function useAttendances() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const attendancesQuery = useQuery({
    queryKey: ['attendances', user?.id],
    queryFn: async () => {
      if (!user || !supabaseHelpers.isConfigured()) {
        return [];
      }

      const { data, error } = await supabase
        .from('attendances')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map((a) => a.event_id);
    },
    enabled: Boolean(user),
  });

  const addAttendance = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user || !supabaseHelpers.isConfigured()) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('attendances').insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const removeAttendance = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user || !supabaseHelpers.isConfigured()) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('attendances')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
      return eventId;
    },
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const isAttending = (eventId: string) => {
    return attendancesQuery.data?.includes(eventId) || false;
  };

  const toggleAttendance = (eventId: string) => {
    if (isAttending(eventId)) {
      removeAttendance.mutate(eventId);
    } else {
      addAttendance.mutate(eventId);
    }
  };

  return {
    attendances: attendancesQuery.data || [],
    isLoading: attendancesQuery.isLoading,
    isAttending,
    toggleAttendance,
    addAttendance: addAttendance.mutate,
    removeAttendance: removeAttendance.mutate,
  };
}
