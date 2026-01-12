import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { RestoreAccountModal } from '@/components/auth/RestoreAccountModal';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  profile_photo: string | null;
  cover_photo: string | null;
  is_premium: boolean;
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

    const handleAuthCallbackUrl = async (url: string) => {
      try {
        if (!url) return;

        // eventmap://auth/callback?code=xxx formatını parse et
        const parsedUrl = new URL(url);

        // Hem pathname hem de hash kontrolü (Supabase farklı format kullanabilir)
        const isAuthCallback =
          parsedUrl.pathname.includes('/auth/callback') ||
          parsedUrl.pathname.includes('auth/callback') ||
          url.includes('auth/callback');

        if (!isAuthCallback) {
          console.log('❌ Not an auth callback URL');
          return;
        }

        // Code veya access_token al (PKCE flow)
        const code = parsedUrl.searchParams.get('code');
        const access_token = parsedUrl.searchParams.get('access_token');
        const refresh_token = parsedUrl.searchParams.get('refresh_token');

        console.log('📝 OAuth params:', { code: !!code, access_token: !!access_token });

        if (code) {
          console.log('✅ Exchanging code for session...');
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('❌ Exchange code error:', error);
          } else {
            console.log('✅ Session exchange successful');
            await Browser.close();
          }
        } else if (access_token && refresh_token) {
          console.log('✅ Setting session with tokens...');
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            console.error('❌ Set session error:', error);
          } else {
            console.log('✅ Session set successful');
            await Browser.close();
          }
        } else {
          console.log('❌ No code or tokens found in URL');
        }
      } catch (error) {
        console.error('❌ Native OAuth callback error:', error);
      }
    };

    const setupListener = async () => {
      listenerHandle = await App.addListener('appUrlOpen', async ({ url }) => {
        console.log('🔗 Deep link received:', url);
        await handleAuthCallbackUrl(url || '');
      });
    };

    setupListener();

    // Handle cold start deep link (app launched from OAuth callback)
    App.getLaunchUrl().then((data) => {
      if (data?.url) {
        console.log('🔗 Launch URL detected:', data.url);
        handleAuthCallbackUrl(data.url);
      }
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
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
        console.log('🔵 Profil bulunamadı, otomatik oluşturuluyor...');

        // Yeni profil oluştur
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Kullanıcı',
          profile_photo: currentUser.user_metadata?.avatar_url || null,
          cover_photo: null,
          is_premium: false,
          is_admin: false,
          email_visible: false,
        });

        if (insertError) {
          console.error('❌ Profil oluşturma hatası:', insertError);
          setProfile(null);
          setLoading(false);
          return;
        }

        console.log('✅ Profil otomatik oluşturuldu');

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
          console.log('⚠️ Silinmiş hesap bulundu, restore modal gösteriliyor');
          setPendingProfile(data as Profile);
          setShowRestoreModal(true);
          setProfile(null);
          setLoading(false);
          return;
        } else {
          // 30 gün geçmiş, yeni profil oluştur
          console.log('🔵 30 gün geçmiş silinmiş hesap, yeni profil oluşturuluyor');
          const { error: insertError } = await supabase.from('profiles').insert({
            id: userId,
            email: currentUser.email || '',
            name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Kullanıcı',
            profile_photo: currentUser.user_metadata?.avatar_url || null,
            cover_photo: null,
            is_premium: false,
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
        console.log('✅ Profil yüklendi');
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Profil yükleme hatası:', error);
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
          queryParams: {
            prompt: 'select_account', // Force account chooser every time
          },
          skipBrowserRedirect: false, // FALSE - redirect'e izin ver
        },
      });

      if (error) return { error };

      if (!data?.url) {
        return { error: new Error('OAuth URL alınamadı') };
      }

      // Mobile'da Capacitor Browser ile aç
      if (Capacitor.isNativePlatform()) {
        await Browser.open({
          url: data.url,
          windowName: '_blank',
        });

        // Browser açıldı, callback listener zaten çalışıyor
        // Browser kapandığında otomatik olarak deep link yakalanacak
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
