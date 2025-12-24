import { X, Calendar, MapPin, User, Users, DollarSign, Heart, Share2, Check, Navigation, Crown } from 'lucide-react';
import { useState } from 'react';
import { Event } from '@/types';
import { formatPrice, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useFavorites, useAttendances, useEventAttendees } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import AdBanner from '../AdBanner';
import PremiumModal from './PremiumModal';

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetailSheet({ event, onClose }: EventDetailSheetProps) {
  const { user, profile } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAttending, toggleAttendance } = useAttendances();
  const { attendees, count: attendeesCount } = useEventAttendees(event?.id || null);
  const isPremium = profile?.is_premium || false;
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!event) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  const handleGetDirections = () => {
    const { latitude, longitude } = event;

    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /android/i.test(userAgent);

    // Create appropriate map URL
    let mapsUrl = '';

    if (isIOS) {
      // Apple Maps for iOS
      mapsUrl = `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    } else if (isAndroid) {
      // Google Maps for Android
      mapsUrl = `google.navigation:q=${latitude},${longitude}`;
    } else {
      // Google Maps web for desktop/other
      mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    // Open in new tab/window
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-mobile bg-[var(--surface)] rounded-t-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col border border-[var(--border)]">
        {/* Header Image */}
        <div className="relative h-64 flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t',
            getCategoryColor(event.category),
            'opacity-25'
          )} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 bg-[var(--surface)]/80 border border-[var(--border)] hover:bg-[var(--surface)] active:scale-95 transition-all"
          >
            <X className="w-6 h-6 text-[var(--text)]" />
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={cn(
              'rounded-full px-4 py-2 flex items-center gap-2',
              'bg-[var(--surface)]/80 border border-[var(--border)] text-sm font-semibold text-[var(--text)]'
            )}>
              <span className="text-lg">{getCategoryIcon(event.category)}</span>
              <span>{event.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-[var(--text)] mb-2">{event.title}</h1>

          {/* Description */}
          <p className="text-[var(--muted)] leading-relaxed mb-6">{event.description}</p>

          {/* Info Cards */}
          <div className="space-y-3 mb-6">
            {/* Date & Time */}
            <div className="rounded-2xl p-4 flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                <Calendar className="w-6 h-6 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Tarih ve Saat</p>
                <p className="text-[var(--text)] font-semibold">{event.date} • {event.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                  <MapPin className="w-6 h-6 text-[var(--text)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--muted)]">Konum</p>
                  <p className="text-[var(--text)] font-semibold">{event.location}</p>
                  <p className="text-sm text-[var(--muted)]">{event.city}</p>
                </div>
              </div>
              {/* Get Directions Button */}
              <button
                onClick={handleGetDirections}
                className="w-full bg-[var(--accent)] text-white font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Yol Tarifi Al</span>
              </button>
            </div>

            {/* Organizer */}
            <div className="rounded-2xl p-4 flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                <User className="w-6 h-6 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Organizatör</p>
                <p className="text-[var(--text)] font-semibold">{event.organizer}</p>
              </div>
            </div>

            {/* Attendees */}
            <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                  <Users className="w-6 h-6 text-[var(--text)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--muted)]">Katılımcılar</p>
                  <p className="text-[var(--text)] font-semibold">
                    {attendeesCount > 0 ? `${attendeesCount} kişi katılıyor` : `${event.attendees.toLocaleString()} kişi`}
                  </p>
                </div>
              </div>

              {/* Premium kullanıcılar için katılımcı listesi */}
              {isPremium && attendees.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide mb-3">
                    Katılan Kullanıcılar
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {attendees.slice(0, 20).map((attendee: any) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2 hover:bg-[var(--surface)] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {attendee.profile_photo ? (
                            <img
                              src={attendee.profile_photo}
                              alt={attendee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-[var(--text)]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text)] truncate">
                            {attendee.name}
                          </p>
                          <p className="text-xs text-[var(--muted)] truncate">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {attendees.length > 20 && (
                    <p className="text-xs text-[var(--muted)] text-center mt-2">
                      +{attendees.length - 20} kişi daha
                    </p>
                  )}
                </div>
              )}

              {/* Premium olmayanlara katılımcı görme butonu */}
              {!isPremium && attendeesCount > 0 && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full mt-3 bg-[var(--accent)] text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Crown className="w-5 h-5" />
                  <span>Katılımcıları Görmek İçin Premium Ol</span>
                </button>
              )}
            </div>

            {/* Price */}
            <div className="rounded-2xl p-4 flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                <DollarSign className="w-6 h-6 text-[var(--text)]" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted)]">Fiyat</p>
                  <p className="text-[var(--text)] font-semibold text-lg">
                    {formatPrice(event.price.min, event.price.max)}
                  </p>
                </div>
                {event.source && (
                  <span className="text-xs text-[var(--muted)] uppercase">{event.source}</span>
                )}
              </div>
            </div>
          </div>

          {/* Ad Banner (Premium olmayanlara) */}
          {!isPremium && (
            <div className="mb-6">
              <AdBanner variant="square" />
            </div>
          )}

          {/* Attendance Status */}
          {user && isAttending(event.id) && (
            <div className="mb-6 bg-[#4fb07a]/15 border border-[#4fb07a]/40 rounded-2xl p-4 flex items-center gap-3">
              <Check className="w-6 h-6 text-[#4fb07a]" />
              <div>
                <p className="text-[var(--text)] font-semibold">Katılıyorsunuz</p>
                <p className="text-sm text-[var(--muted)]">Bu etkinliğe katılım işaretlediniz</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => isAttending(event.id) ? null : toggleAttendance(event.id)}
              className={cn(
                "flex-1 font-semibold rounded-2xl py-4 transition-all",
                isAttending(event.id)
                  ? "bg-[#4fb07a]/15 text-[#4fb07a] border border-[#4fb07a]/40"
                  : "bg-[var(--accent)] text-white hover:opacity-90 active:scale-95"
              )}
            >
              {isAttending(event.id) ? 'Katılıyorsunuz' : 'Katıl'}
            </button>
            <button
              onClick={() => user ? toggleFavorite(event.id) : alert('Giriş yapmalısınız')}
              className={cn(
                "rounded-2xl px-6 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] active:scale-95 transition-all",
                isFavorite(event.id) && "bg-[#d07a6a]/15 border-[#d07a6a]/40"
              )}
            >
              <Heart
                className={cn(
                  "w-6 h-6",
                  isFavorite(event.id) ? "text-[#d07a6a] fill-[#d07a6a]" : "text-[var(--text)]"
                )}
              />
            </button>
            <button
              onClick={handleShare}
              className="rounded-2xl px-6 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] active:scale-95 transition-all"
            >
              <Share2 className="w-6 h-6 text-[var(--text)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
