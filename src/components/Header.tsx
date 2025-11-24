import { MapPin, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  eventCount?: number;
  onFilterClick?: () => void;
  className?: string;
}

export default function Header({ title, eventCount, onFilterClick, className }: HeaderProps) {
  return (
    <header className={cn('safe-area-top', className)}>
      <div className="glassmorphism rounded-3xl p-4 mb-4 card-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-2">
              <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {eventCount !== undefined && (
                <p className="text-sm text-white/60">
                  {eventCount} etkinlik
                </p>
              )}
            </div>
          </div>

          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="glassmorphism rounded-xl p-2.5 hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Filtrele"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
