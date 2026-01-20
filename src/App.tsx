import { useState, useMemo, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import ListView from './components/views/ListView';
import MapView from './components/views/MapView';
import SearchView from './components/views/SearchView';
import ProfileView from './components/views/ProfileView';
import EventDetailSheet from './components/modals/EventDetailSheet';
import FilterSheet, { type SortOption } from './components/modals/FilterSheet';
import CreateEventModal from './components/modals/CreateEventModal';
import UpdatePasswordModal from './components/modals/UpdatePasswordModal';
import { useAuth } from './contexts/AuthContext';
import { useEvents } from './hooks/useEvents';
import type { TabType, Event, EventCategory, City } from './types';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('liste');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);

  const { user, profile } = useAuth();

  // Debug: showUpdatePasswordModal değişikliklerini logla
  useEffect(() => {
    console.log('🔐 showUpdatePasswordModal state changed:', showUpdatePasswordModal);
  }, [showUpdatePasswordModal]);

  // Deep Link & URL Handler - OAuth ve şifre sıfırlama için
  useEffect(() => {
    // Mobile deep link handler
    if (Capacitor.isNativePlatform()) {
      let removeListener: (() => void) | undefined;

      void CapacitorApp.addListener('appUrlOpen', async (data) => {
        const url = data.url;
        console.log('🔗 Deep link received:', url);

        // Google OAuth callback - access_token veya code içeriyorsa
        if (url.includes('access_token=') || url.includes('code=')) {
          console.log('✅ OAuth callback detected');
          // URL'i parse et ve Supabase'e gönder
          const hashPart = url.split('#')[1] || url.split('?')[1];
          if (hashPart) {
            // Hash'i window.location.hash'e set et ki Supabase otomatik handle etsin
            window.location.hash = hashPart;
          }
        }
        // Şifre sıfırlama
        else if (url.includes('reset-password') || url.includes('type=recovery')) {
          console.log('✅ Password reset detected');
          setShowUpdatePasswordModal(true);
        }

        // Etkinlik paylaşım deep link'i: eventmap://event?event=<id>
        else if (url.includes('event=')) {
          try {
            const parsed = new URL(url);
            const eventId = parsed.searchParams.get('event') || parsed.searchParams.get('id');
            if (eventId) {
              console.log('✅ Event deep link detected:', eventId);
              setPendingEventId(eventId);
            }
          } catch (e) {
            console.log('❌ Failed to parse event deep link:', e);
          }
        }
      }).then((handle) => {
        removeListener = () => handle.remove();
      });

      return () => {
        removeListener?.();
      };
    } else {
      // Web için URL hash VE query param kontrolü
      const handlePasswordReset = () => {
        const hash = window.location.hash;
        const search = window.location.search;
        const fullUrl = window.location.href;

        console.log('🔍 Checking URL for password reset...');
        console.log('Full URL:', fullUrl);
        console.log('Hash:', hash);
        console.log('Query:', search);

        // Supabase şifre sıfırlama linki farklı formatlarda gelebilir:
        // Format 1: #access_token=...&type=recovery
        // Format 2: ?type=recovery&code=...
        // Format 3: /reset-password yolunda
        const isPasswordReset =
          hash.includes('type=recovery') ||
          hash.includes('reset-password') ||
          search.includes('type=recovery') ||
          search.includes('reset-password') ||
          window.location.pathname.includes('reset-password');

        if (isPasswordReset) {
          console.log('✅ Password reset detected, opening modal...');
          // Infinite loop'u önlemek için sadece bir kere set et
          setShowUpdatePasswordModal((prev) => {
            if (!prev) {
              console.log('🔓 Modal açılıyor (şu an kapalı)');
              return true;
            }
            console.log('⏭️ Modal zaten açık, skip');
            return prev;
          });
        } else {
          console.log('❌ No password reset detected');
        }
      };

      // Sayfa yüklendiğinde kontrol et
      handlePasswordReset();

      // Hash değişikliklerini dinle
      window.addEventListener('hashchange', handlePasswordReset);

      return () => {
        window.removeEventListener('hashchange', handlePasswordReset);
      };
    }
  }, []);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [showNearby, setShowNearby] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // User's city (default to Istanbul for now, can be expanded to use profile data)
  const userCity: City = 'Istanbul';

  // Fetch events from Supabase with filters
  const { data: events = [], isLoading } = useEvents({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    cities: showNearby ? [userCity] : undefined,
  });

  // Native'de deep link ile gelen event ID'yi events yüklenince aç
  useEffect(() => {
    if (!pendingEventId || events.length === 0) return;
    const foundEvent = events.find((e) => e.id === pendingEventId);
    if (foundEvent) {
      setSelectedEvent(foundEvent);
      setPendingEventId(null);
    }
  }, [pendingEventId, events]);

  // URL'den event parametresini kontrol et ve ilgili etkinliği aç
  useEffect(() => {
    if (events.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('event');
      if (eventId) {
        const foundEvent = events.find(e => e.id === eventId);
        if (foundEvent) {
          setSelectedEvent(foundEvent);
          // URL'den event parametresini temizle
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [events]);

  // Client-side filtering and sorting
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.organizer.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    // City filter
    if (selectedCities.length > 0) {
      filtered = filtered.filter(e => selectedCities.includes(e.city));
    }

    // Price filter
    filtered = filtered.filter(e =>
      e.price.min >= priceRange[0] && e.price.max <= priceRange[1]
    );

    // Date filter
    if (dateRange.start) {
      filtered = filtered.filter(e => new Date(e.date) >= dateRange.start!);
    }
    if (dateRange.end) {
      filtered = filtered.filter(e => new Date(e.date) <= dateRange.end!);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        return [...filtered].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case 'upcoming':
        return [...filtered].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case 'popular':
        return [...filtered].sort((a, b) => b.attendees - a.attendees);
      case 'price-low':
        return [...filtered].sort((a, b) => a.price.min - b.price.min);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price.max - a.price.max);
      default:
        return filtered;
    }
  }, [events, selectedCities, priceRange, dateRange, sortBy, searchQuery]);

  const handleCategoryToggle = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const handleNearbyToggle = () => {
    setShowNearby((prev) => !prev);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedCities([]);
    setShowNearby(false);
    setPriceRange([0, 1000]);
    setDateRange({ start: null, end: null });
    setSortBy('newest');
    setSearchQuery('');
  };

  const handleApplyFilters = () => {
    // Filters are applied in real-time, this is just for UI feedback
    console.log('Filters applied:', { selectedCategories, showNearby, priceRange, dateRange, sortBy });
  };

  return (
    <div className="min-h-screen w-full max-w-mobile mx-auto flex flex-col bg-[var(--bg)]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'liste' && (
          <ListView
            events={filteredEvents}
            onEventClick={setSelectedEvent}
            onFilterClick={() => setShowFilter(true)}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'harita' && (
          <MapView
            events={filteredEvents}
            onEventClick={setSelectedEvent}
            onFilterClick={() => setShowFilter(true)}
          />
        )}

        {activeTab === 'ara' && (
          <SearchView
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            events={events}
            onEventClick={setSelectedEvent}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateClick={() => {
          // Giriş kontrolü
          if (!user) {
            setActiveTab('profil');
            return;
          }
          // Etkinlik oluşturma modalını aç
          setShowCreateModal(true);
        }}
      />

      {/* Modals */}
      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <FilterSheet
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        selectedCategories={selectedCategories}
        selectedCities={selectedCities}
        showNearby={showNearby}
        priceRange={priceRange}
        dateRange={dateRange}
        sortBy={sortBy}
        searchQuery={searchQuery}
        onCategoryToggle={handleCategoryToggle}
        onCityToggle={handleCityToggle}
        onNearbyToggle={handleNearbyToggle}
        onPriceRangeChange={setPriceRange}
        onDateRangeChange={setDateRange}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
        onClearAll={handleClearFilters}
        onApply={handleApplyFilters}
      />

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <UpdatePasswordModal
        isOpen={showUpdatePasswordModal}
        onClose={() => setShowUpdatePasswordModal(false)}
      />
    </div>
  );
}

export default App;
