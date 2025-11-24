import { X, Calendar, DollarSign, ArrowUpDown, MapPin, Search } from 'lucide-react';
import { EventCategory } from '@/types';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  onCategoryToggle: (category: EventCategory) => void;
  onCityToggle: (city: string) => void;
  onNearbyToggle: () => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
  onApply: () => void;
}

const categories: EventCategory[] = ['Konser', 'Spor', 'Tiyatro', 'Festival', 'Meetup', 'Sergi'];
const cities: string[] = [
  'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Gaziantep', 'Konya',
  'Mersin', 'Kayseri', 'Eskişehir', 'Diyarbakır', 'Samsun', 'Denizli', 'Şanlıurfa',
  'Adapazarı', 'Malatya', 'Kahramanmaraş', 'Erzurum', 'Van', 'Batman', 'Elazığ',
  'İzmit', 'Manisa', 'Sivas', 'Gebze', 'Balıkesir', 'Tarsus', 'Kütahya', 'Trabzon',
  'Çorum', 'Çorlu', 'Adıyaman', 'Osmaniye', 'Kırıkkale', 'Antakya', 'Aydın', 'İskenderun',
  'Uşak', 'Aksaray', 'Afyon', 'Isparta', 'İnegöl', 'Tekirdağ', 'Edirne', 'Darıca',
  'Ordu', 'Karaman', 'Gölcük', 'Siirt', 'Körfez', 'Kızıltepe', 'Düzce', 'Tokat',
  'Bolu', 'Derince', 'Turgutlu', 'Bandırma', 'Ceyhan', 'Zonguldak', 'Nazilli',
  'Kırşehir', 'Niğde', 'Ereğli', 'Akhisar', 'Polatlı', 'Çanakkale', 'Yalova'
];

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
  onCategoryToggle,
  onCityToggle,
  onNearbyToggle,
  onPriceRangeChange,
  onDateRangeChange,
  onSortChange,
  onClearAll,
  onApply,
}: FilterSheetProps) {
  const [localPriceMin, setLocalPriceMin] = useState(priceRange[0]);
  const [localPriceMax, setLocalPriceMax] = useState(priceRange[1]);
  const [citySearch, setCitySearch] = useState('');

  if (!isOpen) return null;

  // Şehir aramaya göre filtrele
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-mobile bg-gray-900 rounded-t-3xl overflow-hidden animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Filtreler</h2>
            <button
              onClick={onClose}
              className="glassmorphism rounded-full p-2 hover:bg-white/20 active:scale-95 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Kategoriler</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={cn(
                      'glassmorphism rounded-2xl p-4 flex items-center gap-3 transition-all',
                      'hover:scale-105 active:scale-95',
                      isSelected && 'ring-2 ring-white/40'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                      isSelected
                        ? `bg-gradient-to-br ${getCategoryColor(category)}`
                        : 'bg-white/10'
                    )}>
                      {getCategoryIcon(category)}
                    </div>
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-white' : 'text-white/60'
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
              <MapPin className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Şehirler</h3>
            </div>

            {/* City Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Şehir ara..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => {
                  const isSelected = selectedCities.includes(city);
                  return (
                    <button
                      key={city}
                      onClick={() => onCityToggle(city)}
                      className={cn(
                        'glassmorphism rounded-full px-4 py-2 text-sm font-medium transition-all',
                        'hover:scale-105 active:scale-95',
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white ring-2 ring-blue-500/50'
                          : 'text-white/70'
                      )}
                    >
                      {city}
                    </button>
                  );
                })
              ) : (
                <p className="text-white/40 text-sm text-center w-full py-2">
                  Şehir bulunamadı
                </p>
              )}
            </div>
          </div>

          {/* Nearby Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Konum</h3>
            <button
              onClick={onNearbyToggle}
              className={cn(
                'w-full glassmorphism rounded-2xl p-4 flex items-center justify-between transition-all',
                'hover:scale-[1.02] active:scale-95',
                showNearby && 'ring-2 ring-blue-500/50 bg-blue-500/10'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                  showNearby
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-white/10'
                )}>
                  📍
                </div>
                <div className="text-left">
                  <p className={cn(
                    'font-medium',
                    showNearby ? 'text-white' : 'text-white/70'
                  )}>
                    Yakınımdakiler
                  </p>
                  <p className="text-xs text-white/50">
                    Kendi şehrimdeki etkinlikler
                  </p>
                </div>
              </div>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                showNearby
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-white/30'
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
              <DollarSign className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Fiyat Aralığı</h3>
            </div>
            <div className="glassmorphism rounded-2xl p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-white/60 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={localPriceMin}
                    onChange={(e) => setLocalPriceMin(Number(e.target.value))}
                    onBlur={() => onPriceRangeChange([localPriceMin, localPriceMax])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-white/60 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={localPriceMax}
                    onChange={(e) => setLocalPriceMax(Number(e.target.value))}
                    onBlur={() => onPriceRangeChange([localPriceMin, localPriceMax])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
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
              <Calendar className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Tarih Aralığı</h3>
            </div>
            <div className="glassmorphism rounded-2xl p-4 space-y-3">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Başlangıç</label>
                <input
                  type="date"
                  value={dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onDateRangeChange({
                    start: e.target.value ? new Date(e.target.value) : null,
                    end: dateRange.end
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Bitiş</label>
                <input
                  type="date"
                  value={dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onDateRangeChange({
                    start: dateRange.start,
                    end: e.target.value ? new Date(e.target.value) : null
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Sıralama</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    'glassmorphism rounded-xl p-3 text-sm font-medium transition-all',
                    sortBy === option.value
                      ? 'ring-2 ring-purple-500 bg-purple-500/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
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
              className="flex-1 glassmorphism rounded-2xl py-4 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all"
            >
              Temizle
            </button>
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all"
            >
              Filtreleri Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
