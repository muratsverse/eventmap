import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Event } from '@/types';
import EventCard from '../EventCard';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const popularCategories: string[] = ['Konser', 'Festival', 'Spor', 'Tiyatro', 'Sergi', 'Meetup'];
const popularCities: string[] = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

export default function SearchView({ events, onEventClick }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      (event.address && event.address.toLowerCase().includes(query)) ||
      event.organizer.toLowerCase().includes(query);

    const matchesCategory = !activeCategory || event.category === activeCategory || event.city === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = events
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto px-4 py-4 safe-area-top">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text)] mb-4">Etkinlik Ara</h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Etkinlik, mekan veya şehir ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl pl-12 pr-4 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
            />
          </div>
        </div>

        {/* Popular Searches */}
        {searchQuery === '' && (
          <div className="mb-6 space-y-4">
            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
                <h2 className="text-lg font-semibold text-[var(--text)]">Kategoriler</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(isActive ? null : category)}
                      className={cn(
                        'rounded-full px-4 py-2 font-medium text-sm transition-all border',
                        'hover:scale-[1.02] active:scale-[0.99]',
                        isActive
                          ? 'bg-[var(--accent)] text-white border-transparent'
                          : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
                      )}
                    >
                      <span className="mr-1.5">{getCategoryIcon(category)}</span>
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
                <h2 className="text-lg font-semibold text-[var(--text)]">Popüler Şehirler</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((city) => {
                  const isActive = activeCategory === city;
                  return (
                    <button
                      key={city}
                      onClick={() => setActiveCategory(isActive ? null : city)}
                      className={cn(
                        'rounded-full px-4 py-2 font-medium text-sm transition-all border',
                        'hover:scale-[1.02] active:scale-[0.99]',
                        isActive
                          ? 'bg-[var(--accent)] text-white border-transparent'
                          : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
                      )}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery !== '' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
              Arama Sonuçları ({filteredEvents.length})
            </h2>
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  variant="compact"
                />
              ))}
              {filteredEvents.length === 0 && (
                <div className="rounded-2xl p-8 text-center bg-[var(--surface)] border border-[var(--border)]">
                  <p className="text-[var(--muted)]">Sonuç bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {searchQuery === '' && !activeCategory && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
              Yakında Başlayacaklar
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Filtered Results */}
        {activeCategory && searchQuery === '' && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
              {activeCategory} Etkinlikleri ({filteredEvents.length})
            </h2>
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
