import { useState } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import { Event } from '@/types';
import EventCard from '../EventCard';
import { getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const popularCategories: string[] = [
  'Konser', 'Festival', 'Spor', 'Tiyatro', 'Sergi', 'Meetup',
  'Atölye', 'Parti', 'Komedi', 'Show', 'Müzik', 'Gezi',
  'Keyif', 'Dans', 'Sinema', 'Opera', 'Bar', 'Kültür',
  'Sosyal', 'Eğlence', 'Müzikal', 'Yarışma', 'Çocuk', 'Talk Show',
];
const popularCities: string[] = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

export default function SearchView({ events, onEventClick }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedCities.length > 0;

  const filteredEvents = events.filter(event => {
    // Arama filtresi
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      (event.address && event.address.toLowerCase().includes(query)) ||
      event.organizer.toLowerCase().includes(query);

    // Kategori filtresi - seçili kategorilerden birine uymalı
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);

    // Şehir filtresi - seçili şehirlerden birine uymalı
    const matchesCity = selectedCities.length === 0 || selectedCities.includes(event.city);

    // Tüm kriterler AND ile birleşir
    return matchesSearch && matchesCategory && matchesCity;
  });

  const upcomingEvents = events
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCities([]);
  };

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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
            <h2 className="text-lg font-semibold text-[var(--text)]">Kategoriler</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularCategories.map((category) => {
              const isActive = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[var(--muted)]" />
            <h2 className="text-lg font-semibold text-[var(--text)]">Popüler Şehirler</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => {
              const isActive = selectedCities.includes(city);
              return (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
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

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">
              {filteredEvents.length} sonuç bulundu
            </p>
            <button
              onClick={clearAllFilters}
              className="text-sm text-[var(--accent)] font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Results */}
        {(searchQuery !== '' || hasActiveFilters) ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">
              {searchQuery ? 'Arama Sonuçları' : 'Filtrelenmiş Etkinlikler'} ({filteredEvents.length})
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
        ) : (
          /* Upcoming Events - No filters active */
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
      </div>
    </div>
  );
}
