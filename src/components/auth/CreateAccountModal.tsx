import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface CreateAccountModalProps {
  email: string;
  name: string | null;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
  isOpen: boolean;
}

export function CreateAccountModal({
  email,
  name,
  onConfirm,
  onCancel,
  isOpen,
}: CreateAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Socia'ya Hoş Geldiniz!</h2>
              <p className="text-gray-400 text-sm mt-1">
                {name || email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Hesap oluşturmak ister misiniz? Socia'da etkinlikleri keşfedebilir, favorilerinize ekleyebilir ve daha fazlasını yapabilirsiniz.
          </p>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-purple-300">
              <li>✓ Etkinlikleri favorilere ekle</li>
              <li>✓ Katılım bildirimi al</li>
              <li>✓ Kendi etkinliklerini oluştur</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
}
