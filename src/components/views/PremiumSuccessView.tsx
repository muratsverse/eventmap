import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Crown } from 'lucide-react';

export default function PremiumSuccessView() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3 saniye sonra profile yönlendir
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="rounded-3xl max-w-md w-full p-8 text-center bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-[var(--surface-2)] border border-[var(--border)] rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-[var(--text)]" />
            </div>
            <div className="absolute -top-2 -right-2 bg-[#4fb07a] rounded-full p-2">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-[var(--text)] mb-3">
          Hoş Geldiniz, Premium Üye! 🎉
        </h1>

        <p className="text-[var(--muted)] mb-6">
          Ödemeniz başarıyla tamamlandı. Premium özellikleriniz aktif edildi.
        </p>

        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 mb-6">
          <h2 className="text-[var(--text)] font-semibold mb-3">Premium Özellikleriniz:</h2>
          <ul className="text-left text-[var(--muted)] space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4fb07a]" />
              Sınırsız etkinlik oluşturma
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4fb07a]" />
              Reklamsız deneyim
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4fb07a]" />
              Öncelikli gösterim
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4fb07a]" />
              Premium rozet
            </li>
          </ul>
        </div>

        <p className="text-[var(--muted)] text-sm">
          Profil sayfanıza yönlendiriliyorsunuz...
        </p>
      </div>
    </div>
  );
}
