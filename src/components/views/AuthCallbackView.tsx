import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackView() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const finalizeAuth = async () => {
      try {
        console.log('🔐 Web OAuth callback işleniyor...');
        console.log('📍 URL:', window.location.href);

        // Query ve hash parametrelerini al
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
        );

        // Helper fonksiyon
        const getParam = (name: string) => params.get(name) || hashParams.get(name);

        // Error kontrolü
        const error = getParam('error');
        const errorDescription = getParam('error_description');

        if (error) {
          console.error('❌ OAuth error:', error, errorDescription);
          if (isMounted) {
            setStatus('error');
            setErrorMessage(errorDescription || error);
          }
          // 3 saniye sonra ana sayfaya yönlendir
          setTimeout(() => {
            if (isMounted) navigate('/');
          }, 3000);
          return;
        }

        // PKCE flow: code parametresi
        const code = getParam('code');
        // Implicit flow: token parametreleri
        const access_token = getParam('access_token');
        const refresh_token = getParam('refresh_token');

        console.log('📝 Params:', {
          hasCode: !!code,
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
        });

        if (code) {
          // PKCE flow
          console.log('🔄 Code session\'a çevriliyor...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('❌ Code exchange hatası:', exchangeError);
            if (isMounted) {
              setStatus('error');
              setErrorMessage(exchangeError.message);
            }
          } else if (data.session) {
            console.log('✅ Session oluşturuldu:', data.session.user.email);
            if (isMounted) {
              setStatus('success');
            }
          }
        } else if (access_token && refresh_token) {
          // Implicit flow
          console.log('🔄 Token\'lar set ediliyor...');
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            console.error('❌ Session set hatası:', sessionError);
            if (isMounted) {
              setStatus('error');
              setErrorMessage(sessionError.message);
            }
          } else {
            console.log('✅ Session set edildi');
            if (isMounted) {
              setStatus('success');
            }
          }
        } else {
          // Parametreler eksik - mevcut session'ı kontrol et
          console.log('ℹ️ URL\'de auth parametresi yok, session kontrol ediliyor...');
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session) {
            console.log('✅ Mevcut session bulundu');
            if (isMounted) {
              setStatus('success');
            }
          } else {
            console.log('⚠️ Session bulunamadı');
            if (isMounted) {
              setStatus('error');
              setErrorMessage('Giriş bilgileri alınamadı');
            }
          }
        }
      } catch (err) {
        console.error('❌ Auth callback hatası:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Bilinmeyen hata');
        }
      } finally {
        // Her durumda ana sayfaya yönlendir
        setTimeout(() => {
          if (isMounted) {
            navigate('/');
          }
        }, status === 'error' ? 3000 : 500);
      }
    };

    finalizeAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, status]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center max-w-sm">
        {status === 'processing' && (
          <>
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text)] font-medium">Giriş tamamlanıyor...</p>
            <p className="text-[var(--muted)] text-sm mt-2">Lütfen bekleyin</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[var(--text)] font-medium">Giriş başarılı!</p>
            <p className="text-[var(--muted)] text-sm mt-2">Yönlendiriliyorsunuz...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[var(--text)] font-medium">Giriş başarısız</p>
            {errorMessage && (
              <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}
            <p className="text-[var(--muted)] text-sm mt-2">Ana sayfaya yönlendiriliyorsunuz...</p>
          </>
        )}
      </div>
    </div>
  );
}
