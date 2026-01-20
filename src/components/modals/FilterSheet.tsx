import { X, Calendar, DollarSign, ArrowUpDown, MapPin, Plus, Search } from 'lucide-react';
import { EventCategory } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState, KeyboardEvent } from 'react';

export type SortOption = 'newest' | 'upcoming' | 'popular' | 'price-low' | 'price-high';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: EventCategory[];
  selectedCities: string[];
  showNearby: boolean;
  priceRange: [number, number];
  dateRange: { start: Date | null; end: Date | null };
  sortBy: SortOption;
  searchQuery: string;
  onCategoryToggle: (category: EventCategory) => void;
  onCityToggle: (city: string) => void;
  onNearbyToggle: () => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  onApply: () => void;
}

const categories: EventCategory[] = ['Konser', 'Spor', 'Tiyatro', 'Festival', 'Meetup', 'Sergi'];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'upcoming', label: 'Yaklaşan' },
  { value: 'popular', label: 'En Popüler' },
  { value: 'price-low', label: 'Fiyat (Düşük-Yüksek)' },
  { value: 'price-high', label: 'Fiyat (Yüksek-Düşük)' },
];

export default function FilterSheet({
  isOpen,
  onClose,
  selectedCategories,
  selectedCities,
  showNearby,
  priceRange,
  dateRange,
  sortBy,
  searchQuery,
  onCategoryToggle,
  onCityToggle,
  onNearbyToggle,
  onPriceRangeChange,
  onDateRangeChange,
  onSortChange,
  onSearchChange,
  onClearAll,
  onApply,
}: FilterSheetProps) {
  const [localPriceMin, setLocalPriceMin] = useState(priceRange[0]);
  const [localPriceMax, setLocalPriceMax] = useState(priceRange[1]);
  const [cityInput, setCityInput] = useState('');

  if (!isOpen) return null;

  // Şehir ekleme fonksiyonu
  const handleAddCity = () => {
    const trimmedCity = cityInput.trim();
    if (trimmedCity && !selectedCities.includes(trimmedCity)) {
      onCityToggle(trimmedCity);
      setCityInput('');
    }
  };

  // Enter tuşuyla şehir ekleme
  const handleCityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCity();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Kapat"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-mobile bg-[var(--surface)] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl border border-[var(--border)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-[var(--surface)] pt-2 -mt-2 z-10">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Filtreler</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2.5 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] active:scale-95 transition-all"
              aria-label="Kapat"
            >
              <X className="w-6 h-6 text-[var(--text)]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-[var(--muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">Ara</h3>
            </div>
            <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)]">
              <input
                type="text"
                placeholder="Etkinlik adı, açıklama veya organizatör ara..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Kategoriler</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={cn(
                      'rounded-2xl p-4 flex items-center gap-3 transition-all border',
                      'hover:scale-[1.02] active:scale-[0.99]',
                      isSelected
                        ? 'bg-[var(--accent-15)] border-[var(--accent)]'
                        : 'bg-[var(--surface)] border-[var(--border)]'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                      isSelected
                        ? `bg-gradient-to-br ${getCategoryColor(category)}`
                        : 'bg-[var(--surface-2)] border border-[var(--border)]'
                    )}>
                      {getCategoryIcon(category)}
                    </div>
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-[var(--text)]' : 'text-[var(--muted)]'
                    )}>
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cities */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[var(--muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">Şehirler</h3>
            </div>

            {/* City Input */}
            <div className="rounded-2xl p-4 mb-3 bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Şehir adı yazın (örn: London, Paris, Tokyo...)"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={handleCityKeyDown}
                  className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)] text-sm"
                />
                <button
                  onClick={handleAddCity}
                  disabled={!cityInput.trim()}
                  className={cn(
                    'px-4 rounded-xl font-medium transition-all flex items-center gap-1',
                    cityInput.trim()
                      ? 'bg-[var(--accent)] text-white hover:opacity-90'
                      : 'bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Ekle
                </button>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                Herhangi bir şehir adı yazabilirsiniz. Enter tuşu ile de ekleyebilirsiniz.
              </p>
            </div>

            {/* Selected Cities */}
            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((city) => (
                  <div
                    key={city}
                    className="rounded-full px-4 py-2 flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)]"
                  >
                    <span className="text-sm font-medium text-[var(--text)]">{city}</span>
                    <button
                      onClick={() => onCityToggle(city)}
                      className="hover:bg-[var(--surface)] rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-[var(--muted)]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nearby Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Konum</h3>
            <button
              onClick={onNearbyToggle}
              className={cn(
                'w-full rounded-2xl p-4 flex items-center justify-between transition-all border',
                'hover:scale-[1.02] active:scale-[0.99]',
                showNearby
                  ? 'border-[var(--accent)] bg-[var(--accent-10)]'
                  : 'bg-[var(--surface)] border-[var(--border)]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                  showNearby
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface-2)] border border-[var(--border)]'
                )}>
                  📍
                </div>
                <div className="text-left">
                  <p className={cn(
                    'font-medium',
                    showNearby ? 'text-[var(--text)]' : 'text-[var(--muted)]'
                  )}>
                    Yakınımdakiler
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Kendi şehrimdeki etkinlikler
                  </p>
                </div>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                showNearby
                  ? 'border-[var(--accent)] bg-[var(--accent)]'
                  : 'border-[var(--border)]'
              )}>
                {showNearby && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-[var(--muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">Fiyat Aralığı</h3>
            </div>
            <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-[var(--muted)] mb-1 block">Min</label>
                  <input
                    type="number"
                    value={localPriceMin}
                    onChange={(e) => setLocalPriceMin(Number(e.target.value))}
                    onBlur={() => onPriceRangeChange([localPriceMin, localPriceMax])}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)]"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[var(--muted)] mb-1 block">Max</label>
                  <input
                    type="number"
                    value={localPriceMax}
                    onChange={(e) => setLocalPriceMax(Number(e.target.value))}
                    onBlur={() => onPriceRangeChange([localPriceMin, localPriceMax])}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)]"
                    placeholder="∞"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={localPriceMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLocalPriceMax(val);
                  onPriceRangeChange([localPriceMin, val]);
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[var(--muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">Tarih Aralığı</h3>
            </div>
            <div className="rounded-2xl p-4 space-y-3 bg-[var(--surface)] border border-[var(--border)]">
              <div>
                <label className="text-xs text-[var(--muted)] mb-1 block">Başlangıç</label>
                <input
                  type="date"
                  value={dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onDateRangeChange({
                    start: e.target.value ? new Date(e.target.value) : null,
                    end: dateRange.end
                  })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-1 block">Bitiş</label>
                <input
                  type="date"
                  value={dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onDateRangeChange({
                    start: dateRange.start,
                    end: e.target.value ? new Date(e.target.value) : null
                  })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)]"
                />
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-5 h-5 text-[var(--muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">Sıralama</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    'rounded-xl p-3 text-sm font-medium transition-all border',
                    sortBy === option.value
                      ? 'border-[var(--accent)] bg-[var(--accent-15)] text-[var(--text)]'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClearAll}
              className="flex-1 rounded-2xl py-4 text-[var(--text)] font-semibold bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] active:scale-95 transition-all"
            >
              Temizle
            </button>
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex-1 bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all"
            >
              Filtreleri Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
