import { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Loader2, Map, Navigation2 } from 'lucide-react';
import { Event, EventCategory, City } from '@/types';
import { getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon as LeafletIcon } from 'leaflet';
import { geocodeAddress, reverseGeocode } from '@/lib/geocoding';
import { useQueryClient } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const categories: EventCategory[] = ['Konser', 'Spor', 'Tiyatro', 'Festival', 'Meetup', 'Sergi'];
const cities: City[] = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'];

// Map click handler component
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Custom marker icon
const customIcon = new LeafletIcon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    category: event.category as EventCategory | '',
    customCategory: '',
    date: event.date,
    time: event.time,
    endTime: event.endTime || '',
    location: event.location,
    address: event.address || '',
    city: (event.city || '') as City | '',
    priceMin: event.priceMin?.toString() || '',
    priceMax: event.priceMax?.toString() || '',
    maxAttendees: event.maxAttendees?.toString() || '',
    imageUrl: event.imageUrl || '',
    latitude: event.latitude,
    longitude: event.longitude,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.imageUrl || '');
  const [showMap, setShowMap] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Event değiştiğinde formu güncelle
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category as EventCategory | '',
        customCategory: '',
        date: event.date,
        time: event.time,
        endTime: event.endTime || '',
        location: event.location,
        address: event.address || '',
        city: (event.city || '') as City | '',
        priceMin: event.priceMin?.toString() || '',
        priceMax: event.priceMax?.toString() || '',
        maxAttendees: event.maxAttendees?.toString() || '',
        imageUrl: event.imageUrl || '',
        latitude: event.latitude,
        longitude: event.longitude,
      });
      setImagePreview(event.imageUrl || '');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleGeocodeAddress = async () => {
    if (!formData.address) {
      alert('⚠️ Lütfen önce adres bilgisini girin');
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(formData.address, formData.city || 'Türkiye');

      if (result) {
        setFormData({
          ...formData,
          latitude: result.latitude,
          longitude: result.longitude,
        });
        alert(`✅ Konum bulundu! (${result.confidence} güvenilirlik)\n${result.displayName}`);
      } else {
        alert('❌ Adres bulunamadı. Lütfen haritadan manuel olarak seçin.');
      }
    } catch (error) {
      alert('❌ Konum arama hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Görsel boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        alert('Sadece JPEG, PNG ve WEBP formatları desteklenir');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    const finalCategory = formData.customCategory.trim() || formData.category;
    if (!finalCategory) {
      alert('Lütfen bir kategori seçin veya yazın');
      setIsUpdating(false);
      return;
    }

    // Validate end time
    if (formData.endTime && formData.time && formData.date) {
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        alert('⚠️ Bitiş saati başlangıç saatinden sonra olmalıdır');
        setIsUpdating(false);
        return;
      }
    }

    try {
      let finalImageUrl = formData.imageUrl;

      // Eğer yeni görsel yüklendiyse
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${event.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // Etkinliği güncelle - status'u inReview yap (tekrar onaya düşsün)
      const { error: updateError } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          category: finalCategory,
          date: formData.date,
          time: formData.time,
          end_time: formData.endTime || null,
          location: formData.location,
          address: formData.address,
          city: formData.city || null,
          price_min: Number(formData.priceMin) || 0,
          price_max: Number(formData.priceMax) || 0,
          max_attendees: formData.maxAttendees ? Number(formData.maxAttendees) : null,
          image_url: finalImageUrl,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: 'inReview', // Düzenleme sonrası tekrar admin onayına düşsün
          updated_at: new Date().toISOString(),
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      // Cache'i invalidate et
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['user-events'] });

      alert('✅ Etkinlik güncellendi! Admin onayından sonra yayınlanacak.');
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setError((err as Error).message);
      alert('❌ Hata: ' + (err as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-mobile bg-[var(--surface)] border border-[var(--border)] rounded-3xl my-8 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-[var(--surface)] rounded-t-3xl p-6 flex items-center justify-between border-b border-[var(--border)] z-10">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Etkinliği Düzenle</h2>
            <button
              type="button"
              onClick={onClose}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-full p-2 hover:bg-[var(--surface)]"
              disabled={isUpdating}
            >
              <X className="w-6 h-6 text-[var(--text)]" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mx-6 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-300 text-sm">
              ⚠️ Düzenleme sonrası etkinlik tekrar admin onayına gönderilecektir.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Temel Bilgiler */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Temel Bilgiler</h3>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Etkinlik Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)] resize-none"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Kategori *
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFormData({ ...formData, category, customCategory: '' })}
                      className={cn(
                        'rounded-xl p-3 flex flex-col items-center gap-1 transition-all border',
                        formData.category === category && !formData.customCategory
                          ? 'border-[var(--accent)] bg-[var(--accent-10)]'
                          : 'bg-[var(--surface)] border-[var(--border)]',
                        isUpdating && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={isUpdating}
                    >
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <span className="text-xs text-[var(--muted)]">{category}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Category Input */}
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value, category: '' })}
                  placeholder="veya kendi kategorinizi yazın..."
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border transition-all text-[var(--text)] placeholder:text-[var(--muted)]",
                    formData.customCategory
                      ? "border-[var(--accent)] bg-[var(--accent-10)]"
                      : "border-[var(--border)]"
                  )}
                  disabled={isUpdating}
                  maxLength={30}
                />
              </div>
            </div>

            {/* Tarih ve Saat */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Tarih ve Saat</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Tarih *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isUpdating}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Başlangıç Saati *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Bitiş Saati</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>

            {/* Konum Bilgileri */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Konum Bilgileri</h3>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Mekan Adı *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Tam Adres *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">Şehir</label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setFormData({ ...formData, city })}
                      className={cn(
                        'rounded-full px-4 py-2 font-medium text-sm transition-all border',
                        formData.city === city
                          ? 'bg-[var(--accent)] text-white border-transparent'
                          : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]',
                        isUpdating && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={isUpdating}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geocode Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGeocodeAddress}
                  disabled={isGeocoding || isUpdating || !formData.address}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] transition-all disabled:opacity-50"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="w-5 h-5 text-[var(--muted)] animate-spin" />
                      <span className="text-[var(--muted)]">Konum aranıyor...</span>
                    </>
                  ) : (
                    <>
                      <Navigation2 className="w-5 h-5 text-[var(--muted)]" />
                      <span className="text-[var(--muted)]">Adresten Konum Bul</span>
                    </>
                  )}
                </button>
              </div>

              {/* Map Toggle */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] transition-all"
                  disabled={isUpdating}
                >
                  <Map className="w-5 h-5 text-[var(--muted)]" />
                  <span className="text-[var(--muted)]">
                    {showMap ? 'Haritayı Gizle' : 'Haritadan Konum Seç'}
                  </span>
                </button>
              </div>

              {/* Map */}
              {showMap && (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ height: '300px' }}>
                  <MapContainer
                    center={[formData.latitude, formData.longitude]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      onLocationSelect={async (lat, lng) => {
                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                        try {
                          const address = await reverseGeocode(lat, lng);
                          if (address) {
                            setFormData(prev => ({ ...prev, address }));
                          }
                        } catch (error) {
                          console.error('Reverse geocoding error:', error);
                        }
                      }}
                    />
                    <Marker position={[formData.latitude, formData.longitude]} icon={customIcon} />
                  </MapContainer>
                </div>
              )}

              <div className="text-xs text-[var(--muted)]">
                📍 Koordinatlar: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </div>
            </div>

            {/* Fiyat */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Fiyat Bilgisi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Min Fiyat (₺)</label>
                  <input
                    type="number"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    min="0"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Max Fiyat (₺)</label>
                  <input
                    type="number"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    min="0"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>

            {/* Katılımcı Kapasitesi */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Katılımcı Kapasitesi</h3>

              <div className="flex items-center justify-between mb-4 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                <span className="text-[var(--text)]">Sınırsız Katılım</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, maxAttendees: formData.maxAttendees === '' ? '100' : '' })}
                  disabled={isUpdating}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    formData.maxAttendees === '' ? "bg-[#4fb07a]" : "bg-[var(--surface-2)]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                    formData.maxAttendees === '' ? "translate-x-6" : ""
                  )} />
                </button>
              </div>

              {formData.maxAttendees !== '' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Maksimum Katılımcı</label>
                  <input
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    min="1"
                    disabled={isUpdating}
                  />
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Etkinlik Görseli</h3>

              {imagePreview && (
                <div className="mb-4 relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    disabled={isUpdating}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isUpdating}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-[var(--surface-2)] transition-all"
                disabled={isUpdating}
              >
                <Upload className="w-5 h-5 text-[var(--muted)]" />
                <span className="text-[var(--muted)]">
                  {imageFile ? 'Başka Görsel Seç' : 'Yeni Görsel Yükle'}
                </span>
              </button>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">veya Görsel URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[var(--surface)] rounded-b-3xl p-6 border-t border-[var(--border)]">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                'Değişiklikleri Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
