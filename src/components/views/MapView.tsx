import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../Header';
import EventCard from '../EventCard';
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
    Konser: '#6d7cff',      // accent
    Spor: '#4fb07a',        // green
    Tiyatro: '#d07a6a',     // warm
    Festival: '#d3a253',    // amber
    Meetup: '#5ea2d9',      // blue
    Sergi: '#8a7cd1',       // violet
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
      <div className="px-4 pt-4">
        <Header
          title="Harita"
          eventCount={events.length}
          onFilterClick={onFilterClick}
        />
      </div>

      <div className="flex-1 relative">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="w-20 h-20 bg-[var(--surface-2)] border border-[var(--border)] rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Henüz Etkinlik Yok</h3>
              <p className="text-[var(--muted)]">
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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
          <div className="absolute top-4 left-4 z-10 rounded-2xl px-4 py-2 bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-[var(--text)] font-semibold">
              📍 {events.length} Etkinlik
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
