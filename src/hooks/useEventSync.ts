import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedEventSync } from '@/services/unifiedEventSync';
import type { SyncStats } from '@/services/unifiedEventSync';

export function useEventSync() {
  const queryClient = useQueryClient();

  const syncAll = useMutation({
    mutationFn: () => unifiedEventSync.syncAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const syncSources = useMutation({
    mutationFn: (sources: string[]) => unifiedEventSync.syncSources(sources),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    syncAll: syncAll.mutateAsync,
    syncSources: syncSources.mutateAsync,
    isSyncing: syncAll.isPending || syncSources.isPending,
    error: syncAll.error || syncSources.error,
    stats: syncAll.data || syncSources.data,
  };
}
