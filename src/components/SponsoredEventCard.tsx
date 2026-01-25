import { Sparkles, Star, Crown, MapPin, Calendar } from 'lucide-react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/lib/utils';

interface SponsoredEventCardProps {
  event: Event & { sponsor_tier?: 'basic' | 'premium' | 'featured' };
  onClick: () => void;
}

export default function SponsoredEventCard({ event, onClick }: SponsoredEventCardProps) {
  const tier = event.sponsor_tier || 'basic';

  // Tier bazlı stiller
  const tierStyles = {
    basic: {
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      icon: Star,
      label: 'Sponsorlu',
      glow: '',
    },
    premium: {
      badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      icon: Sparkles,
      label: 'Premium',
      glow: 'shadow-lg shadow-purple-500/20',
    },
    featured: {
      badge: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/40',
      icon: Crown,
      label: 'Öne Çıkan',
      glow: 'shadow-xl shadow-yellow-500/30 ring-2 ring-yellow-500/20',
    },
  };

  const style = tierStyles[tier];
  const TierIcon = style.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.98]",
        "bg-[var(--surface)] border border-[var(--border)]",
        style.glow,
        tier === 'featured' && "animate-pulse-subtle"
      )}
    >
      {/* Sponsorlu Badge - Sol üst köşe */}
      <div className={cn(
        "absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
        style.badge
      )}>
        <TierIcon className="w-3.5 h-3.5" />
        <span>{style.label}</span>
      </div>

      {/* Görsel */}
      <div className="relative h-44">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Kategori ikonu - Sağ üst */}
        <div className="absolute top-3 right-3 bg-[var(--surface)]/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-base">{getCategoryIcon(event.category)}</span>
          <span className="text-xs text-[var(--text)] font-medium">{event.category}</span>
        </div>

        {/* Başlık - Alt kısım */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
            {event.title}
          </h3>
          <p className="text-white/70 text-sm line-clamp-1">
            {event.description}
          </p>
        </div>
      </div>

      {/* Alt bilgiler */}
      <div className="p-4 space-y-2">
        {/* Tarih ve konum */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-[var(--muted)]">
            <Calendar className="w-4 h-4" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--muted)]">
            <MapPin className="w-4 h-4" />
            <span>{event.city}</span>
          </div>
        </div>

        {/* Organizatör */}
        <p className="text-xs text-[var(--muted)]">
          {event.organizer}
        </p>
      </div>

      {/* Featured tier için özel efekt */}
      {tier === 'featured' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5" />
        </div>
      )}
    </div>
  );
}

// AdMob Native reklam placeholder (sponsorlu etkinlik yoksa gösterilir)
export function AdMobNativeAdCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
      {/* Reklam etiketi */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--surface-2)]/80 backdrop-blur-sm text-[var(--muted)] border border-[var(--border)]">
        <span>Reklam</span>
      </div>

      {/* Placeholder içerik - AdMob native reklam buraya render edilecek */}
      <div id="admob-native-ad" className="min-h-[200px] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <p className="text-sm text-[var(--muted)]">Reklam yükleniyor...</p>
        </div>
      </div>
    </div>
  );
}
