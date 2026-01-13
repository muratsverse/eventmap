import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackView() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const finalizeAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash?.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
        );

        const error = params.get('error') || hashParams.get('error');
        const errorDescription =
          params.get('error_description') || hashParams.get('error_description');
        if (error) {
          console.error('Auth callback returned error:', { error, errorDescription });
        }

        const code = params.get('code') || hashParams.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
      } finally {
        if (isMounted) {
          navigate('/');
        }
      }
    };

    finalizeAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center">
        <p className="text-[var(--text)] font-medium">Giriş tamamlanıyor...</p>
        <p className="text-[var(--muted)] text-sm mt-2">Lütfen bekleyin</p>
      </div>
    </div>
  );
}
