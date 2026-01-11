import { useState } from 'react';
import { X } from 'lucide-react';

interface RestoreAccountModalProps {
  daysAgo: number;
  onRestore: () => Promise<void>;
  onDecline: () => Promise<void>;
  isOpen: boolean;
}

export function RestoreAccountModal({
  daysAgo,
  onRestore,
  onDecline,
  isOpen,
}: RestoreAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await onRestore();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDecline();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Hesap Geri Yükleme</h2>
            <p className="text-gray-300 text-sm">
              Hesabınız {daysAgo} gün önce silindi. Geri yüklemek ister misiniz?
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-purple-300 text-sm">
              Hesabınızı geri yüklerseniz, tüm etkinlikleriniz ve favorileriniz geri gelecek.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hayır
          </button>
          <button
            onClick={handleRestore}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Yükleniyor...' : 'Evet, Geri Yükle'}
          </button>
        </div>
      </div>
    </div>
  );
}
