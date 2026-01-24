// Supabase ve genel hata mesajlarını Türkçe'ye çeviren utility

const errorTranslations: Record<string, string> = {
  // Auth hataları
  'Invalid login credentials': 'E-posta veya şifre hatalı',
  'Invalid email or password': 'E-posta veya şifre hatalı',
  'Email not confirmed': 'E-posta adresi doğrulanmamış. Lütfen e-postanızı kontrol edin',
  'User not found': 'Kullanıcı bulunamadı',
  'User already registered': 'Bu e-posta adresi zaten kayıtlı',
  'Email already in use': 'Bu e-posta adresi zaten kullanımda',
  'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır',
  'Password is too short': 'Şifre çok kısa',
  'Password is too weak': 'Şifre çok zayıf. Daha güçlü bir şifre seçin',
  'Invalid password': 'Geçersiz şifre',
  'Email rate limit exceeded': 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyin',
  'Too many requests': 'Çok fazla istek gönderildi. Lütfen bir süre bekleyin',
  'Rate limit exceeded': 'İstek limiti aşıldı. Lütfen bir süre bekleyin',
  'Signup requires a valid password': 'Kayıt için geçerli bir şifre gereklidir',
  'Unable to validate email address: invalid format': 'Geçersiz e-posta formatı',
  'Invalid email': 'Geçersiz e-posta adresi',
  'Email address is invalid': 'E-posta adresi geçersiz',

  // OAuth hataları
  'OAuth error': 'Google ile giriş yapılamadı',
  'Provider not found': 'Giriş sağlayıcısı bulunamadı',
  'Invalid OAuth token': 'Geçersiz giriş token\'ı',
  'OAuth callback error': 'Giriş işlemi başarısız oldu',

  // Session hataları
  'Session expired': 'Oturum süresi doldu. Lütfen tekrar giriş yapın',
  'Invalid session': 'Geçersiz oturum. Lütfen tekrar giriş yapın',
  'Not authenticated': 'Giriş yapmanız gerekiyor',
  'JWT expired': 'Oturum süresi doldu',
  'Invalid JWT': 'Geçersiz oturum',
  'Refresh token not found': 'Oturum bulunamadı. Lütfen tekrar giriş yapın',

  // Password reset hataları
  'For security purposes, you can only request this once every 60 seconds':
    'Güvenlik nedeniyle 60 saniyede bir istek gönderebilirsiniz',
  'Password recovery requires an email': 'Şifre sıfırlama için e-posta adresi gerekli',
  'New password should be different from the old password':
    'Yeni şifre eski şifreden farklı olmalıdır',

  // Veritabanı hataları
  'duplicate key value': 'Bu kayıt zaten mevcut',
  'violates foreign key constraint': 'İlişkili kayıt bulunamadı',
  'violates not-null constraint': 'Zorunlu alan boş bırakılamaz',
  'violates check constraint': 'Geçersiz değer girdiniz',
  'invalid input syntax': 'Geçersiz giriş formatı',

  // Genel hatalar
  'Network error': 'İnternet bağlantınızı kontrol edin',
  'Network request failed': 'Bağlantı hatası. İnternetinizi kontrol edin',
  'Failed to fetch': 'Sunucuya bağlanılamadı',
  'Request timeout': 'İstek zaman aşımına uğradı',
  'Internal server error': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin',
  'Service unavailable': 'Servis şu an kullanılamıyor',
  'Something went wrong': 'Bir şeyler yanlış gitti',

  // Input validation hataları
  'Invalid characters': 'Geçersiz karakterler içeriyor',
  'Field is required': 'Bu alan zorunludur',
  'Value is too long': 'Girilen değer çok uzun',
  'Value is too short': 'Girilen değer çok kısa',
  'Invalid date format': 'Geçersiz tarih formatı',
  'Invalid time format': 'Geçersiz saat formatı',
  'Invalid URL': 'Geçersiz URL adresi',
  'Invalid phone number': 'Geçersiz telefon numarası',

  // Event hataları
  'Event not found': 'Etkinlik bulunamadı',
  'Event is full': 'Etkinlik kapasitesi dolu',
  'Maximum attendees reached': 'Maksimum katılımcı sayısına ulaşıldı',
  'Already attending': 'Zaten bu etkinliğe katılıyorsunuz',
  'Cannot attend own event': 'Kendi etkinliğinize zaten katılıyorsunuz',

  // Storage hataları
  'File too large': 'Dosya boyutu çok büyük',
  'Invalid file type': 'Geçersiz dosya türü',
  'Upload failed': 'Yükleme başarısız oldu',
  'Storage error': 'Depolama hatası',
};

// Kısmi eşleşme için kullanılacak pattern'ler
const errorPatterns: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /invalid.*email/i, message: 'Geçersiz e-posta adresi' },
  { pattern: /invalid.*password/i, message: 'Geçersiz şifre' },
  { pattern: /password.*short/i, message: 'Şifre çok kısa' },
  { pattern: /password.*weak/i, message: 'Şifre çok zayıf' },
  { pattern: /email.*exist/i, message: 'Bu e-posta adresi zaten kayıtlı' },
  { pattern: /user.*exist/i, message: 'Bu kullanıcı zaten mevcut' },
  { pattern: /not.*found/i, message: 'Bulunamadı' },
  { pattern: /unauthorized/i, message: 'Yetkisiz erişim' },
  { pattern: /forbidden/i, message: 'Erişim engellendi' },
  { pattern: /timeout/i, message: 'İstek zaman aşımına uğradı' },
  { pattern: /network/i, message: 'Bağlantı hatası' },
  { pattern: /duplicate/i, message: 'Bu kayıt zaten mevcut' },
  { pattern: /constraint/i, message: 'Veri doğrulama hatası' },
  { pattern: /rate.*limit/i, message: 'Çok fazla istek. Lütfen bekleyin' },
  { pattern: /too.*many/i, message: 'Çok fazla deneme. Lütfen bekleyin' },
];

/**
 * Hata mesajını Türkçe'ye çevirir
 * @param error Hata nesnesi veya mesaj string'i
 * @returns Türkçe hata mesajı
 */
export function translateError(error: unknown): string {
  // Hata mesajını string olarak al
  let message = '';

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object') {
    // Supabase hata objesi
    const errorObj = error as Record<string, any>;
    message = errorObj.message || errorObj.error_description || errorObj.error || '';
  }

  if (!message) {
    return 'Bir hata oluştu. Lütfen tekrar deneyin';
  }

  // Tam eşleşme kontrolü
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Pattern eşleşme kontrolü
  for (const { pattern, message: translatedMessage } of errorPatterns) {
    if (pattern.test(message)) {
      return translatedMessage;
    }
  }

  // Eşleşme bulunamazsa orijinal mesajı döndür
  // Ama İngilizce gibi görünüyorsa genel bir mesaj ver
  if (/^[a-zA-Z\s.,!?:;'"()-]+$/.test(message)) {
    return 'Bir hata oluştu. Lütfen tekrar deneyin';
  }

  return message;
}

/**
 * Supabase AuthError için özel çevirici
 */
export function translateAuthError(error: unknown): string {
  if (!error) return '';

  const translated = translateError(error);

  // Auth-specific fallback
  if (translated === 'Bir hata oluştu. Lütfen tekrar deneyin') {
    const errorObj = error as Record<string, any>;
    const status = errorObj.status || errorObj.statusCode;

    if (status === 400) return 'Geçersiz giriş bilgileri';
    if (status === 401) return 'Giriş yapmanız gerekiyor';
    if (status === 403) return 'Bu işlem için yetkiniz yok';
    if (status === 404) return 'Kullanıcı bulunamadı';
    if (status === 422) return 'Geçersiz veri formatı';
    if (status === 429) return 'Çok fazla deneme. Lütfen bekleyin';
    if (status >= 500) return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin';
  }

  return translated;
}
