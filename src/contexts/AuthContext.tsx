import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  is_premium: boolean;
  is_admin: boolean;
  email_visible?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  // OAuth methods
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  // Password reset
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseConfigured = supabaseHelpers.isConfigured();

  useEffect(() => {
    // Only run if Supabase is configured
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });

        // Profil yoksa bile loading'i false yap
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile (catch):', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign in for demo
      setUser({ id: 'demo-user', email } as User);
      setProfile({
        id: 'demo-user',
        email,
        name: 'Demo User',
        profile_photo: null,
        cover_photo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=300&fit=crop',
        is_premium: false,
      });
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign up for demo
      setUser({ id: 'demo-user', email } as User);
      setProfile({
        id: 'demo-user',
        email,
        name: name || 'Demo User',
        profile_photo: null,
        cover_photo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=300&fit=crop',
        is_premium: false,
        is_admin: false,
      });
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || null, // Store name in user metadata
          },
        },
      });

      if (error) return { error };

      // Profile will be created automatically by database trigger (handle_new_user)
      // If name was provided, update the profile after creation
      if (data.user && name) {
        // Wait a bit for trigger to create profile
        setTimeout(async () => {
          await supabase.from('profiles').update({ name }).eq('id', data.user!.id);
        }, 500);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) return { error };

      // Update local state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // OAuth Sign In Methods
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase yapılandırılmamış') };
    }

    try {
      // Mobile için deep link, web için normal URL
      const redirectTo = Capacitor.isNativePlatform()
        ? 'eventmap://auth/callback'
        : `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) return { error };

      if (!data?.url) {
        return { error: new Error('OAuth URL alınamadı') };
      }

      // Mobile'da Capacitor Browser, web'de tam sayfa yönlendirme
      if (Capacitor.isNativePlatform()) {
        await Browser.open({
          url: data.url,
          windowName: '_self',
        });
      } else {
        window.location.assign(data.url);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };


  // Password Reset Methods
  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase yapılandırılmamış') };
    }

    try {
      // Mobile için deep link, web için normal URL (SPA olduğu için sadece origin)
      const redirectTo = Capacitor.isNativePlatform()
        ? 'eventmap://reset-password'
        : window.location.origin; // /reset-password kaldırıldı çünkü SPA

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase yapılandırılmamış') };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
