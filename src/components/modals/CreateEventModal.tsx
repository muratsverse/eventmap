import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Loader2, Map, Navigation2, Shield } from 'lucide-react';
import { EventCategory, City } from '@/types';
import { getCategoryIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon as LeafletIcon } from 'leaflet';
import { geocodeAddress } from '@/lib/geocoding';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY, isRecaptchaConfigured, checkRateLimit, formatRemainingTime } from '@/lib/recaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import 'leaflet/dist/leaflet.css';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
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

export default function CreateEventModal({ isOpen, onClose, isPremium }: CreateEventModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { createEvent, isCreating, error } = useCreateEvent();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as EventCategory | '',
    date: '',
    time: '',
    endTime: '', // End time for validation
    location: '',
    address: '', // TAM ADRES
    city: '' as City | '',
    priceMin: '',
    priceMax: '',
    imageUrl: '',
    latitude: 41.0082,
    longitude: 28.9784,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeocodeAddress = async () => {
    if (!formData.address || !formData.city) {
      alert('⚠️ Lütfen önce adres ve şehir bilgilerini girin');
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(formData.address, formData.city);

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
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Görsel boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        alert('Sadece JPEG, PNG ve WEBP formatları desteklenir');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.city) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    // Kota Kontrolü (Premium olmayanlara)
    if (user && !isPremium && supabaseHelpers.isConfigured()) {
      try {
        const { data: canCreate, error: quotaError } = await supabase
          .rpc('can_create_event', { p_user_id: user.id });

        if (quotaError) {
          console.error('Kota kontrol hatası:', quotaError);
        } else if (!canCreate) {
          alert('⚠️ Aylık etkinlik kotanız doldu!\n\nPremium üye olarak sınırsız etkinlik oluşturabilirsiniz.');
          return;
        }
      } catch (error) {
        console.error('Kota kontrol hatası:', error);
        // Hata durumunda devam et (güvenlik için)
      }
    }

    // Rate limiting check
    if (user) {
      const rateLimitResult = checkRateLimit(user.id);
      if (!rateLimitResult.allowed) {
        const timeLeft = formatRemainingTime(rateLimitResult.remainingTime!);
        alert(`⏱️ Çok fazla etkinlik oluşturma denemesi. Lütfen ${timeLeft} sonra tekrar deneyin.`);
        return;
      }
    }

    // ReCAPTCHA validation (if configured)
    if (isRecaptchaConfigured() && !recaptchaToken) {
      alert('🤖 Lütfen robot olmadığınızı doğrulayın');
      return;
    }

    // Validate end time is after start time
    if (formData.endTime && formData.time && formData.date) {
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        alert('⚠️ Bitiş saati başlangıç saatinden sonra olmalıdır');
        return;
      }
    }

    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime, // Bitiş saati eklendi
        location: formData.location,
        address: formData.address, // TAM ADRES EKLENDI
        city: formData.city,
        priceMin: Number(formData.priceMin) || 0,
        priceMax: Number(formData.priceMax) || 0,
        imageFile: imageFile || undefined,
        imageUrl: formData.imageUrl || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: 'inReview', // Varsayılan olarak moderasyon bekliyor
      });

      alert('✅ Etkinlik başarıyla oluşturuldu!');
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        time: '',
        endTime: '',
        location: '',
        address: '', // TAM ADRES RESET
        city: '',
        priceMin: '',
        priceMax: '',
        imageUrl: '',
        latitude: 41.0082,
        longitude: 28.9784,
      });
      setImageFile(null);
      setImagePreview('');
      setRecaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (err) {
      alert('❌ Hata: ' + (err as Error).message);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  if (!isPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-full p-2 hover:bg-[var(--surface)]"
          >
            <X className="w-6 h-6 text-[var(--text)]" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-[var(--surface-2)] border border-[var(--border)] rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👑</span>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-3">Premium Özellik</h2>
            <p className="text-[var(--muted)] mb-6">
              Etkinlik oluşturabilmek için premium üyelik gereklidir.
            </p>
            <button className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all">
              Premium'a Geç
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-mobile bg-[var(--surface)] border border-[var(--border)] rounded-3xl my-8 animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-[var(--surface)] rounded-t-3xl p-6 flex items-center justify-between border-b border-[var(--border)] z-10">
            <h2 className="text-2xl font-semibold text-[var(--text)]">Yeni Etkinlik Oluştur</h2>
            <button
              type="button"
              onClick={onClose}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-full p-2 hover:bg-[var(--surface)]"
              disabled={isCreating}
            >
              <X className="w-6 h-6 text-[var(--text)]" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Temel Bilgiler */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Temel Bilgiler</h3>

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="event-title" className="block text-sm font-medium text-[var(--text)] mb-2">
                  Etkinlik Başlığı *
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Istanbul Jazz Festival 2025"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isCreating}
                  aria-required="true"
                  aria-label="Etkinlik başlığı"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="event-description" className="block text-sm font-medium text-[var(--text)] mb-2">
                  Açıklama *
                </label>
                <textarea
                  id="event-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Etkinliğiniz hakkında detaylı bilgi verin..."
                  rows={4}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)] resize-none"
                  required
                  disabled={isCreating}
                  aria-required="true"
                  aria-label="Etkinlik açıklaması"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label id="category-label" className="block text-sm font-medium text-[var(--text)] mb-2">
                  Kategori *
                </label>
                <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="category-label">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFormData({ ...formData, category })}
                      className={cn(
                        'rounded-xl p-3 flex flex-col items-center gap-1 transition-all border',
                        formData.category === category
                          ? 'border-[var(--accent)] bg-[var(--accent-10)]'
                          : 'bg-[var(--surface)] border-[var(--border)]',
                        isCreating && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={isCreating}
                      aria-label={`Kategori: ${category}`}
                      aria-pressed={formData.category === category}
                    >
                      <span className="text-2xl" aria-hidden="true">{getCategoryIcon(category)}</span>
                      <span className="text-xs text-[var(--muted)]">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tarih ve Saat */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Tarih ve Saat</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Tarih *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Başlangıç Saati *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    disabled={isCreating}
                  />
                </div>
              </div>
              {formData.endTime && formData.time && (
                <p className="text-xs text-[var(--muted)] mt-2">
                  ⏱️ Süre: {(() => {
                    const start = new Date(`2000-01-01T${formData.time}`);
                    const end = new Date(`2000-01-01T${formData.endTime}`);
                    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                    if (diff > 0) {
                      const hours = Math.floor(diff / 60);
                      const minutes = Math.floor(diff % 60);
                      return hours > 0 ? `${hours} saat ${minutes} dakika` : `${minutes} dakika`;
                    }
                    return '';
                  })()}
                </p>
              )}
            </div>

            {/* Konum Bilgileri */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Konum Bilgileri</h3>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Mekan Adı *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Örn: Zorlu PSM"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isCreating}
                />
              </div>

              {/* Address - TAM ADRES */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Tam Adres *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Örn: Levazım Mahallesi, Koru Sokağı No:2 Beşiktaş"
                  className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                  required
                  disabled={isCreating}
                />
                <p className="text-xs text-[var(--muted)] mt-1">
                  Tam adres haritada doğru konumu göstermek için önemlidir
                </p>
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Şehir *
                </label>
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
                        isCreating && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={isCreating}
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
                  disabled={isGeocoding || isCreating || !formData.address || !formData.city}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="w-5 h-5 text-[var(--muted)] animate-spin" />
                      <span className="text-[var(--muted)]">Konum aranıyor...</span>
                    </>
                  ) : (
                    <>
                      <Navigation2 className="w-5 h-5 text-[var(--muted)]" />
                      <span className="text-[var(--muted)]">🔍 Adresten Konum Bul</span>
                    </>
                  )}
                </button>
              </div>

              {/* Map Picker Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] transition-all"
                  disabled={isCreating}
                >
                  <Map className="w-5 h-5 text-[var(--muted)]" />
                  <span className="text-[var(--muted)]">
                    {showMap ? 'Haritayı Gizle' : '📍 Haritadan Konum Seç'}
                  </span>
                </button>
              </div>

              {/* Interactive Map */}
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
                      onLocationSelect={(lat, lng) => {
                        setFormData({ ...formData, latitude: lat, longitude: lng });
                      }}
                    />
                    <Marker position={[formData.latitude, formData.longitude]} icon={customIcon} />
                  </MapContainer>
                  <p className="text-xs text-[var(--muted)] mt-2">
                    🖱️ Haritaya tıklayarak konumu seçin
                  </p>
                </div>
              )}

              {/* Koordinatlar (opsiyonel gösterim) */}
              <div className="text-xs text-[var(--muted)]">
                📍 Koordinatlar: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </div>
            </div>

            {/* Fiyat */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Fiyat Bilgisi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Min Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    min="0"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    Max Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    min="0"
                    disabled={isCreating}
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                Ücretsiz etkinlikler için her iki alana da 0 yazın
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Etkinlik Görseli</h3>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    disabled={isCreating}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isCreating}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-[var(--surface-2)] transition-all"
                disabled={isCreating}
              >
                <Upload className="w-5 h-5 text-[var(--muted)]" />
                <span className="text-[var(--muted)]">
                  {imageFile ? 'Başka Görsel Seç' : 'Görsel Yükle'}
                </span>
              </button>

              {/* URL Input as Alternative */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  veya Görsel URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    disabled={isCreating}
                  />
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] mt-2">
                Max 5MB • JPEG, PNG, WEBP formatları
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[var(--surface)] rounded-b-3xl p-6 border-t border-[var(--border)] space-y-4">
            {/* ReCAPTCHA - Only show if configured */}
            {isRecaptchaConfigured() && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  theme="dark"
                  aria-label="Robot doğrulaması"
                />
              </div>
            )}

            {/* Rate Limit Info */}
            <div className="text-xs text-[var(--muted)] text-center flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>Spam koruması aktif: Saatte maksimum 5 etkinlik</span>
            </div>

            <button
              type="submit"
              disabled={isCreating || (isRecaptchaConfigured() && !recaptchaToken)}
              className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Etkinliği oluştur"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                'Etkinliği Oluştur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
