import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';

export default function PremiumCancelledView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="rounded-3xl max-w-md w-full p-8 text-center bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-[var(--surface-2)] border border-[var(--border)] rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-[var(--text)]" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-[var(--text)] mb-3">
          Ödeme İptal Edildi
        </h1>

        <p className="text-[var(--muted)] mb-6">
          Premium üyelik işleminiz iptal edildi. Endişelenmeyin, istediğiniz zaman tekrar deneyebilirsiniz.
        </p>

        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4 mb-6">
          <p className="text-[var(--muted)] text-sm">
            Premium üyelik ile sınırsız etkinlik oluşturabilir, reklamsız deneyimin keyfini çıkarabilir ve etkinlikleriniz öncelikli olarak gösterilebilir.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full font-semibold rounded-xl py-3 transition-all bg-[var(--accent)] text-white hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Tekrar Dene
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full font-semibold rounded-xl py-3 transition-all bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}
