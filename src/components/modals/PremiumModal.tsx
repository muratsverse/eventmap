import { useState, useEffect } from 'react';
import { X, Crown, Check, Zap, Calendar, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Paddle SDK type declaration
declare global {
  interface Window {
    Paddle: any;
  }
}

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paddleInitialized, setPaddleInitialized] = useState(false);

  // Paddle.js initialize
  useEffect(() => {
    const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const environment = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';

    if (!clientToken || clientToken === 'your_paddle_client_token_here') {
      console.warn('⚠️ Paddle client token bulunamadı. Lütfen .env dosyasını kontrol edin.');
      return;
    }

    if (window.Paddle) {
      try {
        window.Paddle.Environment.set(environment);
        window.Paddle.Initialize({
          token: clientToken,
          eventCallback: (data: any) => {
            console.log('🔔 Paddle Event:', data);

            // Checkout tamamlandığında
            if (data.name === 'checkout.completed') {
              console.log('✅ Ödeme tamamlandı!', data);
              onClose();
              // Sayfa yenileme (premium durumu güncellensin)
              setTimeout(() => window.location.reload(), 1000);
            }

            // Checkout kapatıldığında
            if (data.name === 'checkout.closed') {
              console.log('❌ Checkout kapatıldı');
              setLoading(false);
            }
          },
        });
        setPaddleInitialized(true);
        console.log('✅ Paddle initialized:', environment);
      } catch (error) {
        console.error('❌ Paddle initialization error:', error);
        setError('Ödeme sistemi yüklenemedi. Lütfen sayfayı yenileyin.');
      }
    }
  }, [onClose]);

  if (!isOpen) return null;

  const features = [
    { icon: Calendar, text: 'Sınırsız Etkinlik Oluşturma', description: 'Ücretsiz hesaplarda ayda 5 etkinlik hakkınız var, Premium ile sınırsız paylaşın' },
    { icon: Zap, text: 'Reklamsız Deneyim', description: 'Hiç reklam görmeden uygulamayı kullanın' },
    { icon: TrendingUp, text: 'Öncelikli Gösterim', description: 'Etkinlikleriniz listelerde üstte görünsün' },
    { icon: Shield, text: 'Hızlı Onay', description: 'Etkinlikleriniz öncelikle onaylanır' },
  ];

  const plans = [
    {
      name: 'Aylık',
      price: '₺250',
      period: '/ay',
      priceId: import.meta.env.VITE_PADDLE_PRICE_ID || 'pri_your_price_id',
      savings: null,
      recommended: true,
    },
  ];

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      setError('Lütfen önce giriş yapın!');
      return;
    }

    if (!paddleInitialized || !window.Paddle) {
      setError('Ödeme sistemi yüklenemedi. Lütfen sayfayı yenileyin.');
      return;
    }

    if (priceId === 'pri_your_price_id' || !priceId.startsWith('pri_')) {
      setError('Fiyat bilgisi eksik. Lütfen .env dosyasında VITE_PADDLE_PRICE_ID ayarlayın.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔄 Paddle Checkout açılıyor:', {
        priceId,
        userId: user.id,
        email: user.email,
      });

      // Paddle Checkout Overlay aç
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customer: {
          email: user.email || undefined,
        },
        customData: {
          userId: user.id,
        },
      });

    } catch (error) {
      console.error('❌ Paddle Checkout hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-3xl max-w-2xl w-full bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Close Button - Sticky at top */}
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-gradient-to-b from-[var(--surface)]/95 to-transparent">
          <button
            onClick={onClose}
            className="bg-[var(--surface-2)] hover:bg-[var(--surface)] rounded-full p-3 transition-all border border-[var(--border)]"
            aria-label="Kapat"
          >
            <X className="w-6 h-6 text-[var(--text)]" />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--surface-2)] border border-[var(--border)] rounded-3xl mb-4">
            <Crown className="w-10 h-10 text-[var(--text)]" />
          </div>
          <h2 className="text-3xl font-semibold text-[var(--text)] mb-2">Premium'a Geçin</h2>
          <p className="text-[var(--muted)]">
            Daha fazla özellik, daha fazla görünürlük
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:bg-[var(--surface-2)] transition-colors"
              >
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3 flex-shrink-0">
                  <Icon className="w-6 h-6 text-[var(--text)]" />
                </div>
                <div>
                  <h3 className="text-[var(--text)] font-semibold mb-1">{feature.text}</h3>
                  <p className="text-[var(--muted)] text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="flex justify-center mb-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-6 border-2 transition-all bg-[var(--surface)] border-[var(--accent)] max-w-sm w-full"
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--accent)] text-white text-xs font-bold px-4 py-1 rounded-full">
                    ÖNERİLEN
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-[var(--text)] font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-[var(--text)]">{plan.price}</span>
                  <span className="text-[var(--muted)] ml-1">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-[#4fb07a] text-sm mt-2 font-medium">{plan.savings}</p>
                )}
              </div>

              <button
                onClick={() => handlePurchase(plan.priceId)}
                disabled={loading || !paddleInitialized}
                className="w-full font-semibold rounded-xl py-3 transition-all bg-[var(--accent)] text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    İşleniyor...
                  </>
                ) : !paddleInitialized ? (
                  'Yükleniyor...'
                ) : (
                  "Premium'a Geç"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Benefits List */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-[var(--text)] font-semibold mb-4 text-center">Premium ile neler yapabilirsiniz?</h3>
          <ul className="space-y-3">
            {[
              'Ayda 5 etkinlik hakkından sınırsız etkinliğe yükseltin',
              'Etkinlikleriniz listelerde öne çıksın',
              'Reklamsız deneyimin keyfini çıkarın',
              'Öncelikli müşteri desteği',
              'Gelişmiş istatistikler ve analizler',
              'Özel rozet ve premium badge',
            ].map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-[var(--muted)]">
                <Check className="w-5 h-5 text-[#4fb07a] flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[var(--muted)] text-xs mt-6">
          Güvenli ödeme Paddle tarafından sağlanmaktadır. İstediğiniz zaman iptal edebilirsiniz.
        </p>
        </div>
      </div>
    </div>
  );
}
