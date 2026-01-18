import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  supabaseUrl !== 'https://your-project.supabase.co';

// Custom storage adapter for Capacitor
const capacitorStorage = {
  getItem: async (key: string) => {
    const { value } = await Preferences.get({ key });
    return value;
  },
  setItem: async (key: string, value: string) => {
    await Preferences.set({ key, value });
  },
  removeItem: async (key: string) => {
    await Preferences.remove({ key });
  },
};

// Use native storage for mobile, localStorage for web
const storage = Capacitor.isNativePlatform() ? capacitorStorage : undefined;

const createSupabaseStub = () => {
  const error = new Error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
  const stubQuery = {
    data: null,
    error,
    select: () => stubQuery,
    insert: () => stubQuery,
    update: () => stubQuery,
    delete: () => stubQuery,
    eq: () => stubQuery,
    in: () => stubQuery,
    order: () => stubQuery,
    single: () => stubQuery,
    maybeSingle: () => stubQuery,
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error }),
      signUp: async () => ({ data: { user: null }, error }),
      signInWithOAuth: async () => ({ data: null, error }),
      resetPasswordForEmail: async () => ({ error }),
      updateUser: async () => ({ error }),
      signOut: async () => ({ error }),
      setSession: async () => ({ error }),
      exchangeCodeForSession: async () => ({ error }),
      getUser: async () => ({ data: { user: null }, error }),
    },
    from: () => stubQuery,
    rpc: async () => ({ data: null, error }),
  };
};

export const supabase = (isConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage,
        persistSession: true,
        autoRefreshToken: true,
        // OAuth callback'i biz handle ediyoruz; çift işleme olmasın
        detectSessionInUrl: false,
        flowType: 'pkce', // More secure for mobile apps
      },
    })
  : createSupabaseStub()) as ReturnType<typeof createClient<Database>>;

// Helper functions for common queries
export const supabaseHelpers = {
  // Check if Supabase is configured
  isConfigured: () => {
    return isConfigured;
  },
};
