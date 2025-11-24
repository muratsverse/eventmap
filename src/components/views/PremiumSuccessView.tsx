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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="glassmorphism rounded-3xl max-w-md w-full p-8 text-center card-shadow animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Hoş Geldiniz, Premium Üye! 🎉
        </h1>

        <p className="text-white/80 mb-6">
          Ödemeniz başarıyla tamamlandı. Premium özellikleriniz aktif edildi.
        </p>

        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <h2 className="text-white font-semibold mb-3">Premium Özellikleriniz:</h2>
          <ul className="text-left text-white/70 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Sınırsız etkinlik oluşturma
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Reklamsız deneyim
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Öncelikli gösterim
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Premium rozet
            </li>
          </ul>
        </div>

        <p className="text-white/60 text-sm">
          Profil sayfanıza yönlendiriliyorsunuz...
        </p>
      </div>
    </div>
  );
}
