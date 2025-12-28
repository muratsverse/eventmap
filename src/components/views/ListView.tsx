import { Fragment } from 'react';
import { Event } from '@/types';
import EventCard from '../EventCard';
import Header from '../Header';
import { EventListSkeleton } from '../SkeletonLoader';
import AdBanner from '../AdBanner';
import { useAuth } from '@/contexts/AuthContext';

interface ListViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
}

export default function ListView({ events, onEventClick, onFilterClick, isLoading }: ListViewProps) {
  const { profile } = useAuth();
  const isPremium = profile?.is_premium || false;

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto px-4 py-4">
        <Header
          title="Socia"
          eventCount={events.length}
          onFilterClick={onFilterClick}
        />

        {/* Events Grid */}
        {isLoading ? (
          <EventListSkeleton count={6} />
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <Fragment key={event.id}>
                <EventCard
                  event={event}
                  onClick={() => onEventClick(event)}
                />

                {/* Her 5 etkinlikte bir reklam göster (Premium olmayanlara) */}
                {!isPremium && (index + 1) % 5 === 0 && (
                  <AdBanner variant="horizontal" />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
