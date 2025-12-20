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
        'group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300',
        'hover:scale-[1.02] active:scale-[0.99] shadow-md border border-[var(--border)]',
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
          'opacity-25'
        )} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          {/* Category Badge */}
          <div className={cn(
            'rounded-full px-3 py-1.5 flex items-center gap-1.5',
            'bg-[var(--surface)]/85 border border-[var(--border)] text-xs font-semibold text-[var(--text)]'
          )}>
            <span>{getCategoryIcon(event.category)}</span>
            <span>{event.category}</span>
          </div>

          {/* Attendees Badge */}
          {!isCompact && (
            <div className="rounded-full px-3 py-1.5 flex items-center gap-1.5 bg-[var(--surface)]/85 border border-[var(--border)]">
              <Users className="w-3.5 h-3.5 text-[var(--text)]" />
              <span className="text-xs font-semibold text-[var(--text)]">
                {event.attendees.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          <h3 className={cn(
            'font-semibold text-[var(--text)] line-clamp-2',
            isCompact ? 'text-base' : 'text-xl'
          )}>
            {event.title}
          </h3>

          {!isCompact && (
            <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <Calendar className="w-4 h-4" />
              <span>{event.date} • {event.time}</span>
            </div>

            <div className={cn(
              'font-semibold text-[var(--accent)]',
              isCompact ? 'text-sm' : 'text-lg'
            )}>
              {formatPrice(event.price.min, event.price.max)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
