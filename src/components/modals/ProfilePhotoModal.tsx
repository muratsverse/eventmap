import { X, Upload, Camera as CameraIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePhotoModal({ isOpen, onClose }: ProfilePhotoModalProps) {
  const { user, profile, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleFileSelect = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    // Mobil cihazda Camera API kullan
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos, // Galeri
        });

        if (image.dataUrl) {
          setPreview(image.dataUrl);
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
      return;
    }

    // Web'de FileReader kullan
    const file = e?.target.files?.[0];
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
    if (!preview || !user) return;

    setUploading(true);

    try {
      let fileToUpload: File | Blob;

      // Mobilde dataUrl'den Blob oluştur
      if (Capacitor.isNativePlatform()) {
        const response = await fetch(preview);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        // Web'de file input'tan al
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
          alert('Lütfen bir resim seçin');
          return;
        }
        fileToUpload = file;
      }

      // Benzersiz dosya adı oluştur
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `profiles/${fileName}`;

      // Supabase Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Profile tablosunu güncelle
      const { error: updateError } = await updateProfile({ profile_photo: publicUrl });

      if (updateError) {
        throw updateError;
      }

      // Başarılı - modal'ı kapat
      onClose();
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
            <CameraIcon className="w-8 h-8 text-[var(--text)]" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Profil Resmi</h2>
          <p className="text-[var(--muted)] text-sm">
            Yeni bir profil resmi yükleyin
          </p>
        </div>

        {/* Preview */}
        {preview ? (
          <div className="mb-6">
            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[var(--accent-50)]">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="w-40 h-40 mx-auto rounded-2xl bg-[var(--surface-2)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
              <Upload className="w-12 h-12 text-[var(--muted)]" />
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
            onClick={() => {
              if (Capacitor.isNativePlatform()) {
                handleFileSelect();
              } else {
                fileInputRef.current?.click();
              }
            }}
            disabled={uploading}
            className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] active:scale-95 transition-all disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            <span>Resim Seç</span>
          </button>

          {preview && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {uploading ? 'Yükleniyor...' : 'Profil Resmini Güncelle'}
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-center text-[var(--muted)] text-xs mt-4">
          Maksimum dosya boyutu: 5MB
          <br />
          Desteklenen formatlar: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
}
