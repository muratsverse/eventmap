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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-mobile bg-gray-900 rounded-t-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
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
            'opacity-40 mix-blend-multiply'
          )} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 glassmorphism rounded-full p-2 hover:bg-white/20 active:scale-95 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className={cn(
              'glassmorphism rounded-full px-4 py-2 flex items-center gap-2',
              'text-sm font-semibold text-white'
            )}>
              <span className="text-lg">{getCategoryIcon(event.category)}</span>
              <span>{event.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">{event.title}</h1>

          {/* Description */}
          <p className="text-white/70 leading-relaxed mb-6">{event.description}</p>

          {/* Info Cards */}
          <div className="space-y-3 mb-6">
            {/* Date & Time */}
            <div className="glassmorphism rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Tarih ve Saat</p>
                <p className="text-white font-semibold">{event.date} • {event.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="glassmorphism rounded-2xl p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60">Konum</p>
                  <p className="text-white font-semibold">{event.location}</p>
                  <p className="text-sm text-white/50">{event.city}</p>
                </div>
              </div>
              {/* Get Directions Button */}
              <button
                onClick={handleGetDirections}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Yol Tarifi Al</span>
              </button>
            </div>

            {/* Organizer */}
            <div className="glassmorphism rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Organizatör</p>
                <p className="text-white font-semibold">{event.organizer}</p>
              </div>
            </div>

            {/* Attendees */}
            <div className="glassmorphism rounded-2xl p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60">Katılımcılar</p>
                  <p className="text-white font-semibold">
                    {attendeesCount > 0 ? `${attendeesCount} kişi katılıyor` : `${event.attendees.toLocaleString()} kişi`}
                  </p>
                </div>
              </div>

              {/* Premium kullanıcılar için katılımcı listesi */}
              {isPremium && attendees.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-white/50 font-medium uppercase tracking-wide mb-3">
                    Katılan Kullanıcılar
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {attendees.slice(0, 20).map((attendee: any) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-3 bg-white/5 rounded-xl p-2 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {attendee.profile_photo ? (
                            <img
                              src={attendee.profile_photo}
                              alt={attendee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {attendee.name}
                          </p>
                          <p className="text-xs text-white/50 truncate">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {attendees.length > 20 && (
                    <p className="text-xs text-white/40 text-center mt-2">
                      +{attendees.length - 20} kişi daha
                    </p>
                  )}
                </div>
              )}

              {/* Premium olmayanlara katılımcı görme butonu */}
              {!isPremium && attendeesCount > 0 && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Crown className="w-5 h-5" />
                  <span>Katılımcıları Görmek İçin Premium Ol</span>
                </button>
              )}
            </div>

            {/* Price */}
            <div className="glassmorphism rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Fiyat</p>
                  <p className="text-white font-semibold text-lg">
                    {formatPrice(event.price.min, event.price.max)}
                  </p>
                </div>
                {event.source && (
                  <span className="text-xs text-white/40 uppercase">{event.source}</span>
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
            <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-2xl p-4 flex items-center gap-3">
              <Check className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-semibold">Katılıyorsunuz</p>
                <p className="text-sm text-white/70">Bu etkinliğe katılım işaretlediniz</p>
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
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90 active:scale-95"
              )}
            >
              {isAttending(event.id) ? 'Katılıyorsunuz' : 'Katıl'}
            </button>
            <button
              onClick={() => user ? toggleFavorite(event.id) : alert('Giriş yapmalısınız')}
              className={cn(
                "glassmorphism rounded-2xl px-6 hover:bg-white/20 active:scale-95 transition-all",
                isFavorite(event.id) && "bg-pink-500/20 border-pink-500/50"
              )}
            >
              <Heart
                className={cn(
                  "w-6 h-6",
                  isFavorite(event.id) ? "text-pink-400 fill-pink-400" : "text-white"
                )}
              />
            </button>
            <button
              onClick={handleShare}
              className="glassmorphism rounded-2xl px-6 hover:bg-white/20 active:scale-95 transition-all"
            >
              <Share2 className="w-6 h-6 text-white" />
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
