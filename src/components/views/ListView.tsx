import { Event } from '@/types';
import EventCard from '../EventCard';
import Header from '../Header';
import { EventListSkeleton } from '../SkeletonLoader';

interface ListViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
}

export default function ListView({ events, onEventClick, onFilterClick, isLoading }: ListViewProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto px-4 py-4">
        <Header
          title="Spotly"
          eventCount={events.length}
          onFilterClick={onFilterClick}
        />

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
