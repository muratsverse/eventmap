import { supabase } from '@/lib/supabase';

export interface ScrapeResult {
  success: boolean;
  message: string;
  stats?: {
    total: number;
    successful: number;
    failed: number;
  };
  error?: string;
}

/**
 * Trigger Supabase Edge Function to scrape events from Turkish platforms
 * (Biletix, Bubilet, Biletinial)
 */
export async function scrapeEvents(): Promise<ScrapeResult> {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-events', {
      body: {},
    });

    if (error) {
      throw error;
    }

    return data as ScrapeResult;
  } catch (error) {
    console.error('Scraper service error:', error);
    return {
      success: false,
      message: 'Scraping başarısız oldu',
      error: (error as Error).message,
    };
  }
}

/**
 * Check if edge function is deployed and accessible
 */
export async function checkScraperHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('scrape-events', {
      body: { healthCheck: true },
    });

    return !error;
  } catch {
    return false;
  }
}
