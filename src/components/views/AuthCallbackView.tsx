import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackView() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const finalizeAuth = async () => {
      let didError = false;
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
          didError = true;
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
          // PKCE flow - session zaten mevcut olabilir
          console.log('🔄 Session kontrol ediliyor...');
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            console.log('✅ Aktif session bulundu, code exchange atlanıyor');
            if (isMounted) {
              window.history.replaceState({}, '', '/');
              await new Promise(resolve => setTimeout(resolve, 100));
              navigate('/', { replace: true });
              return;
            }
          }

          // Session yoksa code exchange dene
          console.log('🔄 Code session\'a çevriliyor...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.warn('⚠️ Code exchange hatası (yok sayılıyor):', exchangeError.message);
            // Hata olsa bile session kontrolü yap
            const { data: retrySession } = await supabase.auth.getSession();
            if (retrySession.session) {
              console.log('✅ Session mevcut, hata yok sayıldı');
              if (isMounted) {
                window.history.replaceState({}, '', '/');
                await new Promise(resolve => setTimeout(resolve, 100));
                navigate('/', { replace: true });
                return;
              }
            } else {
              // Gerçek hata - session yok
              console.error('❌ Session oluşturulamadı');
              didError = true;
              if (isMounted) {
                navigate('/', { replace: true });
                return;
              }
            }
          } else if (data.session) {
            console.log('✅ Session oluşturuldu:', data.session.user.email);
            if (isMounted) {
              window.history.replaceState({}, '', '/');
              await new Promise(resolve => setTimeout(resolve, 100));
              navigate('/', { replace: true });
              return;
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
            didError = true;
          } else {
            console.log('✅ Session set edildi');
            if (isMounted) {
              window.history.replaceState({}, '', '/');
              await new Promise(resolve => setTimeout(resolve, 100));
              navigate('/', { replace: true });
              return;
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
            window.history.replaceState({}, '', window.location.pathname);
          } else {
            console.log('⚠️ Session bulunamadı');
            if (isMounted) {
              setStatus('error');
              setErrorMessage('Giriş bilgileri alınamadı');
            }
            didError = true;
          }
        }
      } catch (err) {
        console.error('❌ Auth callback hatası:', err);
        didError = true;
      } finally {
        // Hata varsa veya henüz redirect olmadıysa
        if (isMounted && didError) {
          console.log('🔄 Hata var, ana sayfaya yönlendiriliyor...');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        } else if (isMounted) {
          // Başarılı ama henüz redirect olmadıysa
          console.log('✅ Auth işlemi tamamlandı');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 100);
        }
      }
    };

    finalizeAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--muted)] text-sm mt-4">Yükleniyor...</p>
      </div>
    </div>
  );
}
