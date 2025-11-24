import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { formatPrice, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export default function EventCard({ event, onClick, variant = 'default' }: EventCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300',
        'hover:scale-105 active:scale-95 card-shadow',
        isCompact ? 'h-32' : 'h-64'
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t',
          getCategoryColor(event.category),
          'opacity-60 mix-blend-multiply'
        )} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Category Badge */}
          <div className={cn(
            'glassmorphism rounded-full px-3 py-1.5 flex items-center gap-1.5',
            'text-xs font-semibold text-white'
          )}>
            <span>{getCategoryIcon(event.category)}</span>
            <span>{event.category}</span>
          </div>

          {/* Attendees Badge */}
          {!isCompact && (
            <div className="glassmorphism rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">
                {event.attendees.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          <h3 className={cn(
            'font-bold text-white line-clamp-2',
            isCompact ? 'text-base' : 'text-xl'
          )}>
            {event.title}
          </h3>

          {!isCompact && (
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-white/90">
              <Calendar className="w-4 h-4" />
              <span>{event.date} • {event.time}</span>
            </div>

            <div className={cn(
              'font-bold',
              isCompact ? 'text-sm' : 'text-lg'
            )}>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {formatPrice(event.price.min, event.price.max)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
