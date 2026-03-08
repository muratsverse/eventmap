import { X, Upload, Camera as CameraIcon, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ProfilePhotoModal({ isOpen, onClose }: ProfilePhotoModalProps) {
  const { user, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const onSelectFile = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos,
        });
        if (image.dataUrl) {
          setImgSrc(image.dataUrl);
          setScale(1);
          setRotate(0);
        }
      } catch (error) {
        console.error('Camera error:', error);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImgSrc(reader.result as string);
      setScale(1);
      setRotate(0);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const getCroppedImage = async (): Promise<Blob | null> => {
    const image = imgRef.current;
    if (!image || !completedCrop) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    const centerX = outputSize / 2;
    const centerY = outputSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const handleUpload = async () => {
    if (!imgSrc || !user) return;

    setUploading(true);
    try {
      const blob = await getCroppedImage();
      if (!blob) {
        alert('Resim kırpılamadı, lütfen tekrar deneyin');
        return;
      }

      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await updateProfile({ profile_photo: publicUrl });
      if (updateError) throw updateError;

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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative rounded-3xl max-w-md w-full p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm animate-slide-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors z-10"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl mb-3">
            <CameraIcon className="w-7 h-7 text-[var(--text)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-1">Profil Resmi</h2>
          <p className="text-[var(--muted)] text-sm">
            {imgSrc ? 'Kırpma alanını ayarlayın' : 'Bir resim seçin'}
          </p>
        </div>

        {imgSrc ? (
          <>
            {/* Crop Area */}
            <div className="mb-4 flex justify-center bg-black/20 rounded-2xl overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop"
                  style={{
                    maxHeight: '50vh',
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                aria-label="Uzaklaştır"
              >
                <ZoomOut className="w-5 h-5 text-[var(--text)]" />
              </button>

              <span className="text-sm text-[var(--muted)] min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setScale(Math.min(3, scale + 0.1))}
                className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                aria-label="Yakınlaştır"
              >
                <ZoomIn className="w-5 h-5 text-[var(--text)]" />
              </button>

              <button
                type="button"
                onClick={() => setRotate((rotate + 90) % 360)}
                className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                aria-label="Döndür"
              >
                <RotateCw className="w-5 h-5 text-[var(--text)]" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onSelectFile}
                disabled={uploading}
                className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-semibold rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-[var(--surface-2)] active:scale-95 transition-all disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span>Başka Resim Seç</span>
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading || !completedCrop}
                className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {uploading ? 'Yükleniyor...' : 'Kaydet'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-40 h-40 mx-auto rounded-full bg-[var(--surface-2)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
                <Upload className="w-12 h-12 text-[var(--muted)]" />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={onSelectFile}
              disabled={uploading}
              className="w-full bg-[var(--accent)] text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>Resim Seç</span>
            </button>

            <p className="text-center text-[var(--muted)] text-xs mt-4">
              Maks 5MB &middot; JPG, PNG, GIF, WEBP
            </p>
          </>
        )}
      </div>
    </div>
  );
}
