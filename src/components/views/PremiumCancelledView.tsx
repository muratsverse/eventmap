import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';

export default function PremiumCancelledView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="glassmorphism rounded-3xl max-w-md w-full p-8 text-center card-shadow animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Ödeme İptal Edildi
        </h1>

        <p className="text-white/80 mb-6">
          Premium üyelik işleminiz iptal edildi. Endişelenmeyin, istediğiniz zaman tekrar deneyebilirsiniz.
        </p>

        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <p className="text-white/70 text-sm">
            Premium üyelik ile sınırsız etkinlik oluşturabilir, reklamsız deneyimin keyfini çıkarabilir ve etkinlikleriniz öncelikli olarak gösterilebilir.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full font-semibold rounded-xl py-3 transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Tekrar Dene
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full font-semibold rounded-xl py-3 transition-all glassmorphism text-white hover:bg-white/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}
