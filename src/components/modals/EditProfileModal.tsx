import { X, User, Save } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('İsim boş bırakılamaz');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await updateProfile({ name: name.trim() });

      if (updateError) {
        throw updateError;
      }

      // Başarılı - modal'ı kapat
      onClose();
    } catch (err: any) {
      console.error('Update error:', err);
      setError(`Güncelleme hatası: ${err.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-3xl max-w-md w-full p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl mb-4">
            <User className="w-8 h-8 text-[var(--text)]" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Profili Düzenle</h2>
          <p className="text-[var(--muted)] text-sm">
            İsminizi ve diğer bilgilerinizi güncelleyin
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              İsim / Kullanıcı Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
              maxLength={50}
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              {name.length}/50 karakter
            </p>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--muted)] cursor-not-allowed"
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              E-posta adresi değiştirilemez
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
