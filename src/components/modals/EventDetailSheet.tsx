import { X, Calendar, MapPin, User, Users, DollarSign, Heart, Check, Navigation, AlertTriangle } from 'lucide-react';
import { Event } from '@/types';
import { formatPrice, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useFavorites, useAttendances, useEventAttendees } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { translateError } from '@/lib/errorMessages';

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetailSheet({ event, onClose }: EventDetailSheetProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAttending, toggleAttendance } = useAttendances();
  const { attendees, count: attendeesCount } = useEventAttendees(event?.id || null);

  if (!event) return null;

  // Kapasite kontrolü
  const hasCapacityLimit = event.maxAttendees !== undefined && event.maxAttendees !== null;
  const isAtCapacity = hasCapacityLimit && attendeesCount >= event.maxAttendees!;
  const remainingSpots = hasCapacityLimit ? Math.max(0, event.maxAttendees! - attendeesCount) : null;

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
                    {attendeesCount > 0
                      ? hasCapacityLimit
                        ? `${attendeesCount} / ${event.maxAttendees} kişi`
                        : `${attendeesCount} kişi katılıyor`
                      : hasCapacityLimit
                        ? `0 / ${event.maxAttendees} kişi`
                        : `${event.attendees.toLocaleString()} kişi`
                    }
                  </p>
                  {hasCapacityLimit && !isAtCapacity && remainingSpots !== null && remainingSpots <= 10 && remainingSpots > 0 && (
                    <p className="text-xs text-orange-400 mt-1">
                      Son {remainingSpots} kişilik yer kaldı!
                    </p>
                  )}
                </div>
              </div>

              {/* Katılımcı listesi - herkes görebilir */}
              {attendees.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide mb-3">
                    Katılan Kullanıcılar
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent pr-1">
                    {attendees.map((attendee: any) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3 hover:bg-[var(--surface)] transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {attendee.profile_photo ? (
                            <img
                              src={attendee.profile_photo}
                              alt={attendee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-[var(--muted)]" />
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
                </div>
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

          {/* Capacity Warning - Maksimum katılımcı uyarısı */}
          {isAtCapacity && !isAttending(event.id) && (
            <div className="mb-6 bg-orange-500/15 border border-orange-500/40 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-[var(--text)] font-semibold">Maksimum katılımcı sayısına ulaşıldı</p>
                <p className="text-sm text-[var(--muted)]">Bu etkinlik için tüm kontenjan dolmuştur</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                if (!user) {
                  alert('Giriş yapmalısınız');
                  return;
                }
                if (isAtCapacity && !isAttending(event.id)) {
                  alert('Bu etkinliğin kapasitesi dolmuştur');
                  return;
                }
                toggleAttendance(event.id);
              }}
              disabled={isAtCapacity && !isAttending(event.id)}
              className={cn(
                "flex-1 font-semibold rounded-2xl py-4 transition-all",
                isAttending(event.id)
                  ? "bg-[#4fb07a]/15 text-[#4fb07a] border border-[#4fb07a]/40 hover:opacity-90 active:scale-95"
                  : isAtCapacity
                    ? "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] cursor-not-allowed"
                    : "bg-[var(--accent)] text-white hover:opacity-90 active:scale-95"
              )}
            >
              {isAttending(event.id) ? 'Katılıyorsunuz' : isAtCapacity ? 'Kontenjan Dolu' : 'Katıl'}
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
          </div>
        </div>
      </div>

    </div>
  );
}
