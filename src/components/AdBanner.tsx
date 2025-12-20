import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  variant?: 'horizontal' | 'square' | 'vertical';
  className?: string;
}

export default function AdBanner({ variant = 'horizontal', className = '' }: AdBannerProps) {
  // Mock ad data - In production, this would come from Google AdSense or your ad server
  const mockAds = [
    {
      title: 'Reklam Alanı',
      description: 'Burada sizin reklamınız olabilir',
      cta: 'Daha Fazla Bilgi',
      bg: 'from-[#4c5ad1] to-[#6d7cff]',
    },
    {
      title: 'Sponsor Etkinlik',
      description: 'Premium üyeler reklamsız deneyim yaşar',
      cta: "Premium'a Geç",
      bg: 'from-[#7b6ad1] to-[#8f7fe0]',
    },
    {
      title: 'İşletmenizi Tanıtın',
      description: 'Milyonlarca kullanıcıya ulaşın',
      cta: 'İletişime Geç',
      bg: 'from-[#4f9a78] to-[#6ab892]',
    },
  ];

  const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];

  const sizeClasses = {
    horizontal: 'h-24 flex-row items-center',
    square: 'aspect-square flex-col justify-center',
    vertical: 'h-64 flex-col justify-center',
  };

  return (
    <div
      className={`relative rounded-2xl p-4 overflow-hidden cursor-pointer group bg-[var(--surface)] border border-[var(--border)] ${sizeClasses[variant]} ${className}`}
      onClick={() => {
        // In production, track ad click and redirect
        console.log('Ad clicked:', randomAd.title);
      }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${randomAd.bg} opacity-15 group-hover:opacity-25 transition-opacity`} />

      {/* Ad Badge */}
      <div className="absolute top-2 right-2">
        <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">
          Reklam
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <h3 className="text-[var(--text)] font-semibold text-lg mb-1">{randomAd.title}</h3>
        <p className="text-[var(--muted)] text-sm mb-2">{randomAd.description}</p>
      </div>

      {/* CTA */}
      <div className="relative z-10">
        <button className="flex items-center gap-2 bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-[var(--border)]">
          {randomAd.cta}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
    </div>
  );
}

// Google AdSense Component
// Bu component AdSense entegrasyonu için hazır
export function GoogleAdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}: {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}) {
  // AdSense kullanmak için:
  // 1. Google AdSense hesabı açın (https://www.google.com/adsense)
  // 2. Ad Unit oluşturun ve slot ID'sini alın
  // 3. .env dosyasına VITE_ADSENSE_CLIENT_ID ekleyin
  // 4. index.html'e AdSense script'ini ekleyin

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  if (!clientId) {
    // Development modunda placeholder göster
    return (
      <div className={`rounded-2xl p-4 flex items-center justify-center min-h-[100px] bg-[var(--surface)] border border-[var(--border)] ${className}`}>
        <div className="text-center">
          <p className="text-[var(--muted)] text-sm mb-2">📢 Google AdSense Placeholder</p>
          <p className="text-[var(--muted)]/70 text-xs">Slot: {slot}</p>
          <p className="text-[var(--muted)]/70 text-xs mt-1">Production'da gerçek reklam gösterilecek</p>
        </div>
      </div>
    );
  }

  // Production: Gerçek AdSense
  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}
