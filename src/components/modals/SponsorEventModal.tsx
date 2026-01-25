import { useState } from 'react';
import { X, Star, Sparkles, Crown, Check, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSponsorshipPrices, sponsorEvent } from '@/hooks/useSponsoredEvents';
import { Event } from '@/types';

interface SponsorEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

type SponsorTier = 'basic' | 'premium' | 'featured';
type Duration = 1 | 7 | 30;

const tierInfo = {
  basic: {
    name: 'Sponsorlu',
    icon: Star,
    color: 'blue',
    benefits: [
      'Listede üst sıralarda görünür',
      '"Sponsorlu" etiketi',
    ],
  },
  premium: {
    name: 'Premium',
    icon: Sparkles,
    color: 'purple',
    benefits: [
      'Listenin en üstünde',
      'Öne çıkan görsel tasarım',
      'Premium badge',
    ],
  },
  featured: {
    name: 'Öne Çıkan',
    icon: Crown,
    color: 'yellow',
    benefits: [
      'Her zaman en üstte',
      'Büyük kart tasarımı',
      'Animasyonlu badge',
      'Haritada özel işaretleyici',
    ],
  },
};

const durationLabels: Record<Duration, string> = {
  1: '1 Gün',
  7: '1 Hafta',
  30: '1 Ay',
};

export default function SponsorEventModal({ isOpen, onClose, event }: SponsorEventModalProps) {
  const { data: prices = [] } = useSponsorshipPrices();
  const [selectedTier, setSelectedTier] = useState<SponsorTier>('basic');
  const [selectedDuration, setSelectedDuration] = useState<Duration>(7);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Seçilen fiyatı bul
  const selectedPrice = prices.find(
    (p) => p.tier === selectedTier && p.duration_days === selectedDuration
  );

  const handlePurchase = async () => {
    if (!selectedPrice) return;

    setIsProcessing(true);

    try {
      // Burada Stripe ödeme akışı başlatılacak
      // Şimdilik simüle ediyoruz
      const mockPaymentId = `pi_${Date.now()}`;

      const result = await sponsorEvent(
        event.id,
        selectedTier,
        selectedDuration,
        mockPaymentId
      );

      if (result.success) {
        alert('Etkinliğiniz sponsorlu olarak yayınlandı!');
        onClose();
      } else {
        alert('Hata: ' + result.error);
      }
    } catch (error) {
      alert('Ödeme işlemi başarısız oldu');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--surface)] rounded-t-3xl p-6 flex items-center justify-between border-b border-[var(--border)] z-10">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">Etkinliği Öne Çıkar</h2>
            <p className="text-sm text-[var(--muted)]">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-[var(--surface-2)] border border-[var(--border)] rounded-full p-2 hover:bg-[var(--surface)]"
          >
            <X className="w-5 h-5 text-[var(--text)]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tier Seçimi */}
          <div>
            <h3 className="text-sm font-medium text-[var(--muted)] mb-3">Paket Seçin</h3>
            <div className="space-y-3">
              {(Object.keys(tierInfo) as SponsorTier[]).map((tier) => {
                const info = tierInfo[tier];
                const TierIcon = info.icon;
                const isSelected = selectedTier === tier;

                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? tier === 'basic'
                          ? "border-blue-500 bg-blue-500/10"
                          : tier === 'premium'
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-yellow-500 bg-yellow-500/10"
                        : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--muted)]"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-xl",
                        tier === 'basic' ? "bg-blue-500/20" :
                        tier === 'premium' ? "bg-purple-500/20" : "bg-yellow-500/20"
                      )}>
                        <TierIcon className={cn(
                          "w-6 h-6",
                          tier === 'basic' ? "text-blue-400" :
                          tier === 'premium' ? "text-purple-400" : "text-yellow-400"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-[var(--text)]">{info.name}</span>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[var(--accent)]" />
                          )}
                        </div>
                        <ul className="space-y-1">
                          {info.benefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-[var(--muted)] flex items-center gap-2">
                              <Zap className="w-3 h-3" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Süre Seçimi */}
          <div>
            <h3 className="text-sm font-medium text-[var(--muted)] mb-3">Süre Seçin</h3>
            <div className="grid grid-cols-3 gap-3">
              {([1, 7, 30] as Duration[]).map((duration) => {
                const price = prices.find(
                  (p) => p.tier === selectedTier && p.duration_days === duration
                );
                const isSelected = selectedDuration === duration;

                return (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-center",
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--muted)]"
                    )}
                  >
                    <p className="font-semibold text-[var(--text)]">{durationLabels[duration]}</p>
                    <p className={cn(
                      "text-lg font-bold mt-1",
                      isSelected ? "text-[var(--accent)]" : "text-[var(--text)]"
                    )}>
                      {price?.price.toFixed(2) || '---'}₺
                    </p>
                    {duration === 30 && (
                      <span className="text-xs text-green-400 mt-1 block">En Avantajlı</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Özet */}
          <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--muted)]">Paket</span>
              <span className="font-medium text-[var(--text)]">{tierInfo[selectedTier].name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--muted)]">Süre</span>
              <span className="font-medium text-[var(--text)]">{durationLabels[selectedDuration]}</span>
            </div>
            <div className="border-t border-[var(--border)] pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Toplam</span>
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {selectedPrice?.price.toFixed(2) || '0.00'}₺
                </span>
              </div>
            </div>
          </div>

          {/* Ödeme Butonu */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing || !selectedPrice}
            className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Ödeme Yap ve Öne Çıkar
              </>
            )}
          </button>

          <p className="text-xs text-center text-[var(--muted)]">
            Ödeme Stripe güvencesiyle gerçekleştirilir.
            Satın alma sonrası iade yapılmaz.
          </p>
        </div>
      </div>
    </div>
  );
}
