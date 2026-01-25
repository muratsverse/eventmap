import { Event } from '@/types';
import EventCard from '../EventCard';
import Header from '../Header';
import { EventListSkeleton } from '../SkeletonLoader';
import SponsoredEventCard, { AdMobNativeAdCard } from '../SponsoredEventCard';
import { useSponsoredEvents } from '@/hooks/useSponsoredEvents';

interface ListViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onFilterClick: () => void;
  isLoading?: boolean;
}

export default function ListView({ events, onEventClick, onFilterClick, isLoading }: ListViewProps) {
  const { data: sponsoredEvents = [] } = useSponsoredEvents();

  // İlk sponsorlu etkinliği al (featured > premium > basic sırasına göre)
  const topSponsoredEvent = sponsoredEvents[0];

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto px-4 py-4">
        <Header
          title="Happenin"
          eventCount={events.length}
          onFilterClick={onFilterClick}
        />

        {/* Events Grid */}
        {isLoading ? (
          <EventListSkeleton count={6} />
        ) : (
          <div className="space-y-4">
            {/* Sponsorlu Etkinlik veya AdMob Reklam - En üstte */}
            {topSponsoredEvent ? (
              <SponsoredEventCard
                event={topSponsoredEvent}
                onClick={() => onEventClick(topSponsoredEvent)}
              />
            ) : (
              <AdMobNativeAdCard />
            )}

            {/* Normal Etkinlikler */}
            {events.map((event, index) => (
              <div key={event.id}>
                <EventCard
                  event={event}
                  onClick={() => onEventClick(event)}
                />

                {/* Her 5 etkinlikten sonra bir reklam alanı daha */}
                {(index + 1) % 5 === 0 && index < events.length - 1 && (
                  <div className="mt-4">
                    {sponsoredEvents[Math.floor((index + 1) / 5)] ? (
                      <SponsoredEventCard
                        event={sponsoredEvents[Math.floor((index + 1) / 5)]}
                        onClick={() => onEventClick(sponsoredEvents[Math.floor((index + 1) / 5)])}
                      />
                    ) : (
                      <AdMobNativeAdCard />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
