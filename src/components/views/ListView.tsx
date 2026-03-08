import { useState } from 'react';
import { Event } from '@/types';
import EventCard from '../EventCard';
import Header from '../Header';
import { EventListSkeleton } from '../SkeletonLoader';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SortOption } from '../modals/FilterSheet';

interface ListViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  random: 'Karışık',
  newest: 'En Yeni',
  upcoming: 'Yaklaşan',
  popular: 'Popüler',
  'price-low': 'Ucuzdan Pahalıya',
  'price-high': 'Pahalıdan Ucuza',
};

export default function ListView({ events, onEventClick, onFilterClick, isLoading, sortBy, onSortChange }: ListViewProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto px-4 py-4">
        <Header
          title="Happenin"
          eventCount={events.length}
          onFilterClick={onFilterClick}
        />

        {/* Sort Button */}
        <div className="relative mb-3">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-95 transition-all"
          >
            <ArrowUpDown className="w-4 h-4 text-[var(--muted)]" />
            <span>{sortLabels[sortBy]}</span>
          </button>

          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden min-w-[180px]">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm transition-colors border-b border-[var(--border)] last:border-b-0',
                      sortBy === option
                        ? 'bg-[var(--accent-10)] text-[var(--accent)] font-medium'
                        : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                    )}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <EventListSkeleton count={6} />
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
