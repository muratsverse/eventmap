import { X, Bell, Mail, Smartphone, Calendar, Heart } from 'lucide-react';
import { useState } from 'react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettingsModal({ isOpen, onClose }: NotificationSettingsModalProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [favoriteUpdates, setFavoriteUpdates] = useState(true);
  const [newEventsInCity, setNewEventsInCity] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    // TODO: Save to backend/localStorage
    console.log('Notification settings saved:', {
      emailNotifications,
      pushNotifications,
      eventReminders,
      favoriteUpdates,
      newEventsInCity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-3xl max-w-lg w-full p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl mb-4">
            <Bell className="w-8 h-8 text-[var(--text)]" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Bildirim Ayarları</h2>
          <p className="text-[var(--muted)] text-sm">
            Hangi bildirimleri almak istediğinizi seçin
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-4 mb-6">
          {/* Email Notifications */}
          <div className="rounded-2xl p-4 flex items-center justify-between bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2">
                <Mail className="w-5 h-5 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-[var(--text)] font-medium">Email Bildirimleri</p>
                <p className="text-[var(--muted)] text-xs">Önemli güncellemeleri email ile alın</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer border border-[var(--border)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="rounded-2xl p-4 flex items-center justify-between bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2">
                <Smartphone className="w-5 h-5 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-[var(--text)] font-medium">Push Bildirimleri</p>
                <p className="text-[var(--muted)] text-xs">Anlık bildirimler alın</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer border border-[var(--border)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
          </div>

          {/* Event Reminders */}
          <div className="rounded-2xl p-4 flex items-center justify-between bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2">
                <Calendar className="w-5 h-5 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-[var(--text)] font-medium">Etkinlik Hatırlatmaları</p>
                <p className="text-[var(--muted)] text-xs">Katıldığınız etkinlikler yaklaşınca hatırlat</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={eventReminders}
                onChange={(e) => setEventReminders(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer border border-[var(--border)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
          </div>

          {/* Favorite Updates */}
          <div className="rounded-2xl p-4 flex items-center justify-between bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2">
                <Heart className="w-5 h-5 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-[var(--text)] font-medium">Favori Güncellemeleri</p>
                <p className="text-[var(--muted)] text-xs">Favorilerimdeki değişiklikler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={favoriteUpdates}
                onChange={(e) => setFavoriteUpdates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer border border-[var(--border)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
          </div>

          {/* New Events in City */}
          <div className="rounded-2xl p-4 flex items-center justify-between bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-2">
                <Bell className="w-5 h-5 text-[var(--text)]" />
              </div>
              <div>
                <p className="text-[var(--text)] font-medium">Şehrimde Yeni Etkinlikler</p>
                <p className="text-[var(--muted)] text-xs">Yakınımda yeni etkinlik eklendi</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newEventsInCity}
                onChange={(e) => setNewEventsInCity(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--surface-2)] peer-focus:outline-none rounded-full peer border border-[var(--border)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all"
        >
          Kaydet
        </button>

        {/* Note */}
        <p className="text-center text-[var(--muted)] text-xs mt-4">
          Ayarlarınızı istediğiniz zaman değiştirebilirsiniz
        </p>
      </div>
    </div>
  );
}
