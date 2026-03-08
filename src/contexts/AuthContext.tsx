import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { RestoreAccountModal } from '@/components/auth/RestoreAccountModal';
import { initPushNotifications, removePushToken } from '@/services/pushNotifications';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  is_admin: boolean;
  email_visible?: boolean;
  deleted_at?: string | null;
  deletion_reason?: string | null;
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
  signInWithApple: () => Promise<{ error: Error | null }>;
  // Password reset
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  // Delete account
  deleteAccount: (reason?: string) => Promise<{ error: Error | null }>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<Profile | null>(null);
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
        loadProfile(session.user.id, session.user);
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
        loadProfile(session.user.id, session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  useEffect(() => {
    if (!isSupabaseConfigured || !Capacitor.isNativePlatform()) {
      return;
    }

    let listenerHandle: any;
    let isProcessing = false; // Duplicate callback önleme

    const handleAuthCallbackUrl = async (url: string) => {
      if (isProcessing) return;

      try {
        if (!url) return;

        // URL parsing
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(url);
        } catch {
          try {
            parsedUrl = new URL(url.replace('eventmap:', 'eventmap://'));
          } catch {
            await Browser.close().catch(() => {});
            return;
          }
        }

        // Parametre okuma helper'ı
        const getParam = (name: string): string | null => {
          const fromQuery = parsedUrl.searchParams.get(name);
          if (fromQuery) return fromQuery;
          const hash = parsedUrl.hash?.startsWith('#') ? parsedUrl.hash.slice(1) : parsedUrl.hash;
          if (hash) {
            const hashParams = new URLSearchParams(hash);
            return hashParams.get(name);
          }
          return null;
        };

        // Auth callback kontrolü
        const isAuthCallback =
          url.includes('auth/callback') ||
          url.includes('auth%2Fcallback') ||
          url.includes('/auth/v1/callback') ||
          url.includes('auth/v1/callback') ||
          (parsedUrl.host === 'auth' && parsedUrl.pathname.includes('callback')) ||
          parsedUrl.pathname.includes('/auth/callback') ||
          parsedUrl.pathname.includes('/auth/v1/callback');

        if (!isAuthCallback) return;

        isProcessing = true;

        // Error kontrolü
        const errorParam = getParam('error');
        if (errorParam) {
          console.error('OAuth hatası:', errorParam, getParam('error_description'));
          isProcessing = false;
          await Browser.close().catch(() => {});
          return;
        }

        const code = getParam('code');
        const access_token = getParam('access_token');
        const refresh_token = getParam('refresh_token');

        let success = false;

        if (code) {
          // PKCE flow
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange hatası:', error.message);
          } else if (data.session) {
            success = true;
          }
        } else if (access_token) {
          // Implicit flow
          if (refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) {
              console.error('Session set hatası:', error.message);
            } else {
              success = true;
            }
          } else {
            const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
            if (userError) {
              console.error('User bilgisi alınamadı:', userError.message);
            } else if (userData.user) {
              success = true;
            }
          }
        }

        try { await Browser.close(); } catch {}

        if (success) {
          setTimeout(async () => {
            await supabase.auth.getSession();
          }, 500);
        }
      } catch (error) {
        console.error('OAuth callback hatası:', error);
        try { await Browser.close(); } catch {}
      } finally {
        setTimeout(() => { isProcessing = false; }, 1000);
      }
    };

    const setupListener = async () => {
      listenerHandle = await App.addListener('appUrlOpen', async ({ url }) => {
        await handleAuthCallbackUrl(url || '');
      });

      // Browser kapandığında session kontrol et
      await Browser.addListener('browserFinished', async () => {
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setSession(session);
            setUser(session.user);
            loadProfile(session.user.id, session.user);
          }
        }, 500);
      });
    };

    setupListener();

    // Cold start: Uygulama deep link ile açıldıysa
    App.getLaunchUrl().then((data) => {
      if (data?.url) {
        handleAuthCallbackUrl(data.url);
      }
    });

    // Uygulama resume olduğunda session kontrol et
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !user) {
          setSession(session);
          setUser(session.user);
          loadProfile(session.user.id, session.user);
        }
      }
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
      Browser.removeAllListeners();
      App.removeAllListeners();
    };
  }, [isSupabaseConfigured]);

  const loadProfile = async (userId: string, currentUser: User, checkDeleted = true) => {
    try {
      // Silinen hesaplar dahil tüm profilleri getir
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Profil bulunamadı - otomatik oluştur
      if (!data || error) {

        // Yeni profil oluştur
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Kullanıcı',
          profile_photo: currentUser.user_metadata?.avatar_url || null,
          cover_photo: null,
          is_admin: false,
          email_visible: false,
        });

        if (insertError) {
          console.error('Profil oluşturma hatası:', insertError);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Yeni oluşturulan profili yükle
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (newProfile) {
          setProfile(newProfile as Profile);
        }
        setLoading(false);
        return;
      }

      // Hesap silinmiş mi kontrol et (30 gün içinde)
      if (data.deleted_at && checkDeleted) {
        const deletedDate = new Date(data.deleted_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - deletedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 30 gün geçmemişse restore modal göster
        if (diffDays <= 30) {
            setPendingProfile(data as Profile);
          setShowRestoreModal(true);
          setProfile(null);
          setLoading(false);
          return;
        } else {
          // 30 gün geçmiş, yeni profil oluştur
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            email: currentUser.email || '',
            name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Kullanıcı',
            profile_photo: currentUser.user_metadata?.avatar_url || null,
            cover_photo: null,
            is_admin: false,
            email_visible: false,
          });

          if (!insertError) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            if (newProfile) setProfile(newProfile as Profile);
          }
          setLoading(false);
          return;
        }
      }

      // Normal aktif hesap
      if (!data.deleted_at) {
        setProfile(data as Profile);
        // Initialize push notifications
        initPushNotifications(userId);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
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
        is_admin: false,
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

    if (user) {
      await removePushToken(user.id);
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
      const isNative = Capacitor.isNativePlatform();

      // Redirect URL belirleme
      let redirectTo: string;

      if (isNative) {
        redirectTo = 'eventmap://auth/callback';
      } else {
        redirectTo = `${window.location.origin}/auth/callback`;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account', // Her seferinde hesap seçtir
            access_type: 'offline', // Refresh token al
          },
          // Native'de SDK'nın otomatik redirect yapmasını engelle
          skipBrowserRedirect: isNative,
        },
      });

      if (error) return { error };

      if (!data?.url) {
        return { error: new Error('OAuth URL alınamadı') };
      }

      if (isNative) {
        await Browser.open({
          url: data.url,
          presentationStyle: 'popover', // iOS'ta daha iyi çalışır
          toolbarColor: '#000000',
        });
      } else {
        // Web'de tam sayfa yönlendirme
        window.location.assign(data.url);
      }

      return { error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { error: error as Error };
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase yapılandırılmamış') };
    }

    try {
      const isNative = Capacitor.isNativePlatform();

      let redirectTo: string;
      if (isNative) {
        redirectTo = 'eventmap://auth/callback';
      } else {
        redirectTo = `${window.location.origin}/auth/callback`;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
          skipBrowserRedirect: isNative,
        },
      });

      if (error) return { error };

      if (!data?.url) {
        return { error: new Error('Apple OAuth URL alınamadı') };
      }

      if (isNative) {
        await Browser.open({
          url: data.url,
          presentationStyle: 'popover',
          toolbarColor: '#000000',
        });
      } else {
        window.location.assign(data.url);
      }

      return { error: null };
    } catch (error) {
      console.error('Apple sign-in error:', error);
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
      const baseUrl = import.meta.env.BASE_URL || '/';
      const redirectTo = Capacitor.isNativePlatform()
        ? 'eventmap://reset-password'
        : `${window.location.origin}${baseUrl}`; // SPA - base path dahil

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

  const deleteAccount = async (reason?: string) => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('Kullanıcı oturumu bulunamadı') };
    }

    try {
      // Soft delete: Hesabı sil olarak işaretle (30 gün içinde geri yüklenebilir)
      const { error: rpcError } = await supabase.rpc('soft_delete_user_account', {
        p_user_id: user.id,
        p_reason: reason || null,
      });

      if (rpcError) {
        console.error('Soft delete account RPC error:', rpcError);
        return { error: rpcError };
      }

      // Sign out - kullanıcıyı çıkış yaptır
      await signOut();

      return { error: null };
    } catch (error) {
      console.error('Delete account error:', error);
      return { error: error as Error };
    }
  };

  // Restore account handler
  const handleRestoreAccount = async () => {
    if (!pendingProfile) return;

    try {
      const { error } = await supabase.rpc('restore_account', {
        p_user_id: pendingProfile.id,
      });

      if (error) {
        console.error('Restore account error:', error);
        await signOut();
        return;
      }

      // Get fresh session after restore
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user.id, session.user, false);
      }

      setShowRestoreModal(false);
      setPendingProfile(null);
    } catch (error) {
      console.error('Restore account error:', error);
      await signOut();
    }
  };

  // Decline restore account handler
  const handleDeclineRestore = async () => {
    setShowRestoreModal(false);
    setPendingProfile(null);
    await signOut();
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
    signInWithApple,
    resetPassword,
    updatePassword,
    deleteAccount,
    isSupabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {pendingProfile && showRestoreModal && (
        <RestoreAccountModal
          isOpen={showRestoreModal}
          daysAgo={
            pendingProfile.deleted_at
              ? Math.ceil(
                  (new Date().getTime() - new Date(pendingProfile.deleted_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0
          }
          onRestore={handleRestoreAccount}
          onDecline={handleDeclineRestore}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
