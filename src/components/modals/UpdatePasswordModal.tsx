import { useState } from 'react';
import { X, Lock, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdatePasswordModal({ isOpen, onClose }: UpdatePasswordModalProps) {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasyon
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    // Şifre güncelle
    const { error: updateError } = await updatePassword(newPassword);

    if (updateError) {
      setError(updateError.message || 'Şifre güncellenemedi');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);

      // 2 saniye sonra modal'ı kapat
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative rounded-3xl max-w-md w-full p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-slide-up">
        {/* Close Button */}
        {!loading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            aria-label="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {!success ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl mb-4">
                <Lock className="w-8 h-8 text-[var(--text)]" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Yeni Şifre Belirle</h2>
              <p className="text-[var(--muted)] text-sm">
                Hesabınız için yeni bir şifre oluşturun
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Yeni Şifre */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Şifre Tekrar */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  'Şifreyi Güncelle'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#4fb07a]/15 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-[#4fb07a]" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Şifre Güncellendi!</h2>
              <p className="text-[var(--muted)] mb-8">
                Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
