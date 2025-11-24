import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../Header';
import EventCard from '../EventCard';
import AdBanner from '../AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import type { Event, EventCategory } from '@/types';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onFilterClick: () => void;
}

// Component to handle map centering
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Custom marker icons based on category
function getCategoryColor(category: EventCategory): string {
  const colors: Record<EventCategory, string> = {
    Konser: '#ec4899',      // pink
    Spor: '#3b82f6',        // blue
    Tiyatro: '#8b5cf6',     // purple
    Festival: '#f59e0b',    // amber
    Meetup: '#10b981',      // green
    Sergi: '#ef4444',       // red
  };
  return colors[category] || '#6b7280';
}

function createCustomIcon(category: EventCategory): Icon {
  const color = getCategoryColor(category);
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.3"/>
    </svg>
  `;

  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function MapView({ events, onEventClick, onFilterClick }: MapViewProps) {
  const { profile } = useAuth();
  const isPremium = profile?.is_premium || false;

  // Default center: Istanbul
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const [mapZoom, setMapZoom] = useState(11);

  // Center map on first event with coordinates
  useEffect(() => {
    if (events.length > 0 && events[0].latitude && events[0].longitude) {
      setMapCenter([events[0].latitude, events[0].longitude]);
      setMapZoom(12);
    }
  }, [events]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Harita"
        showFilter
        onFilterClick={onFilterClick}
      />

      <div className="flex-1 relative">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Henüz Etkinlik Yok</h3>
              <p className="text-white/60">
                Lütfen Supabase'e örnek etkinlikler ekleyin veya Admin panelden sync yapın
              </p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenterController center={mapCenter} />

            {events.map((event) => {
              if (!event.latitude || !event.longitude) return null;

              return (
                <Marker
                  key={event.id}
                  position={[event.latitude, event.longitude]}
                  icon={createCustomIcon(event.category)}
                  eventHandlers={{
                    click: () => onEventClick(event),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <EventCard
                        event={event}
                        onClick={() => onEventClick(event)}
                        variant="compact"
                      />
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}

        {/* Event count indicator */}
        {events.length > 0 && (
          <div className="absolute top-4 left-4 z-10 glassmorphism rounded-2xl px-4 py-2">
            <span className="text-white font-semibold">
              📍 {events.length} Etkinlik
            </span>
          </div>
        )}

        {/* Legend */}
        {events.length > 0 && (
          <div className="absolute bottom-4 left-4 z-10 glassmorphism rounded-2xl p-3 max-w-[200px]">
            <div className="text-white text-xs font-semibold mb-2">Kategoriler:</div>
            <div className="grid grid-cols-2 gap-1">
              {['Konser', 'Spor', 'Tiyatro', 'Festival', 'Meetup', 'Sergi'].map((cat) => {
                const category = cat as EventCategory;
                const count = events.filter((e) => e.category === category).length;
                if (count === 0) return null;

                return (
                  <div key={category} className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
                    <span className="text-white/80 text-xs">
                      {category} ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ad Banner (Premium olmayanlara) */}
        {!isPremium && events.length > 0 && (
          <div className="absolute bottom-20 left-0 right-0 px-4 z-10">
            <AdBanner variant="horizontal" />
          </div>
        )}
      </div>
    </div>
  );
}
