import { X, Upload, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePhotoModal({ isOpen, onClose }: ProfilePhotoModalProps) {
  const { user, profile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya türü kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    // Preview oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      // Benzersiz dosya adı oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Supabase Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Profile tablosunu güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Başarılı - sayfayı yenile
      window.location.reload();
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Yükleme hatası: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glassmorphism rounded-3xl max-w-md w-full p-8 card-shadow animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profil Resmi</h2>
          <p className="text-white/60 text-sm">
            Yeni bir profil resmi yükleyin
          </p>
        </div>

        {/* Preview */}
        {preview ? (
          <div className="mb-6">
            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-4 border-purple-500/50">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="w-40 h-40 mx-auto rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
              <Upload className="w-12 h-12 text-white/40" />
            </div>
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full glassmorphism text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            <span>Resim Seç</span>
          </button>

          {preview && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {uploading ? 'Yükleniyor...' : 'Profil Resmini Güncelle'}
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-center text-white/40 text-xs mt-4">
          Maksimum dosya boyutu: 5MB
          <br />
          Desteklenen formatlar: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
}
