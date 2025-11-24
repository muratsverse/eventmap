import { X, Calendar, MapPin, User, Users, DollarSign, Heart, Share2 } from 'lucide-react';
import { Event } from '@/types';
import { formatPrice, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetailSheet({ event, onClose }: EventDetailSheetProps) {
  if (!event) return null;

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
            <div className="glassmorphism rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60">Konum</p>
                <p className="text-white font-semibold">{event.location}</p>
                <p className="text-sm text-white/50">{event.city}</p>
              </div>
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
            <div className="glassmorphism rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Katılımcılar</p>
                <p className="text-white font-semibold">{event.attendees.toLocaleString()} kişi</p>
              </div>
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

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all">
              Bilet Al
            </button>
            <button className="glassmorphism rounded-2xl px-6 hover:bg-white/20 active:scale-95 transition-all">
              <Heart className="w-6 h-6 text-white" />
            </button>
            <button className="glassmorphism rounded-2xl px-6 hover:bg-white/20 active:scale-95 transition-all">
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
