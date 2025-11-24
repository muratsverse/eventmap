// Cloud Storage for Event Images
// Supports: Supabase Storage, AWS S3, Cloudflare R2

import { supabase, supabaseHelpers } from './supabase';

// Storage configuration
const STORAGE_BUCKET = 'event-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Validate file before upload
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / 1024 / 1024}MB olmalıdır.`,
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Geçersiz dosya formatı. Sadece ${ALLOWED_TYPES.join(', ')} desteklenir.`,
    };
  }

  return { valid: true };
}

// Generate unique filename with timestamp and random string
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}

// Upload image to Supabase Storage
export async function uploadImageToSupabase(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check if Supabase is configured
    if (!supabaseHelpers.isConfigured()) {
      return { success: false, error: 'Supabase yapılandırılmamış' };
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filePath = `${userId}/${filename}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

// Delete image from Supabase Storage
export async function deleteImageFromSupabase(imageUrl: string): Promise<boolean> {
  try {
    if (!supabaseHelpers.isConfigured()) {
      return false;
    }

    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`${STORAGE_BUCKET}/`);
    if (pathParts.length < 2) {
      return false;
    }

    const filePath = pathParts[1];

    // Delete file
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

// Get presigned URL for temporary upload (for direct browser-to-storage upload)
export async function getPresignedUploadUrl(
  filename: string,
  userId: string
): Promise<{ url?: string; path?: string; error?: string }> {
  try {
    if (!supabaseHelpers.isConfigured()) {
      return { error: 'Supabase yapılandırılmamış' };
    }

    const uniqueFilename = generateUniqueFilename(filename);
    const filePath = `${userId}/${uniqueFilename}`;

    // Create signed upload URL (valid for 60 seconds)
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(filePath);

    if (error) {
      return { error: error.message };
    }

    return {
      url: data.signedUrl,
      path: data.path,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

// Upload via presigned URL (direct to storage, bypasses server)
export async function uploadViaPresignedUrl(
  file: File,
  presignedUrl: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Upload directly to storage
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Yükleme başarısız oldu' };
    }

    // Convert presigned URL to public URL
    const publicUrl = presignedUrl.split('?')[0];

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}

// Optimize image before upload (resize, compress)
export async function optimizeImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            // Create new file with optimized blob
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          'image/jpeg',
          0.85 // 85% quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Check if storage is properly configured
export async function checkStorageConfiguration(): Promise<{
  configured: boolean;
  bucketExists?: boolean;
  error?: string;
}> {
  try {
    if (!supabaseHelpers.isConfigured()) {
      return { configured: false, error: 'Supabase yapılandırılmamış' };
    }

    // Try to list files in bucket (this checks if bucket exists and we have access)
    const { error } = await supabase.storage.from(STORAGE_BUCKET).list('', { limit: 1 });

    if (error) {
      return {
        configured: false,
        bucketExists: false,
        error: error.message,
      };
    }

    return {
      configured: true,
      bucketExists: true,
    };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}
