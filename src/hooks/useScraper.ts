import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrapeEvents } from '@/services/scraperService';

export function useScraper() {
  const queryClient = useQueryClient();

  const scrape = useMutation({
    mutationFn: scrapeEvents,
    onSuccess: () => {
      // Invalidate events query to show new scraped events
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    scrapeEvents: scrape.mutateAsync,
    isScraping: scrape.isPending,
    error: scrape.error,
    result: scrape.data,
  };
}
