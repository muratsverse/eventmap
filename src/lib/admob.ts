import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob App ID ve Ad Unit ID'leri
// NOT: Bunları kendi AdMob hesabınızdan alacaksınız
const ADMOB_CONFIG = {
  // Test modunda mı çalışıyor
  testMode: true, // Production'da false yapın

  // Android Ad Unit ID'leri
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111', // Test ID
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test ID
    native: 'ca-app-pub-3940256099942544/2247696110', // Test ID
  },

  // iOS Ad Unit ID'leri
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716', // Test ID
    interstitial: 'ca-app-pub-3940256099942544/4411468910', // Test ID
    native: 'ca-app-pub-3940256099942544/3986624511', // Test ID
  },
};

// Platform bazlı Ad Unit ID al
const getAdUnitId = (type: 'banner' | 'interstitial' | 'native'): string => {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') {
    return ADMOB_CONFIG.ios[type];
  }
  return ADMOB_CONFIG.android[type];
};

// AdMob'u başlat
export const initializeAdMob = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('AdMob: Web platformunda çalışmıyor');
    return;
  }

  try {
    await AdMob.initialize({
      testingDevices: ADMOB_CONFIG.testMode ? ['YOUR_TEST_DEVICE_ID'] : [],
      initializeForTesting: ADMOB_CONFIG.testMode,
    });
    console.log('AdMob başarıyla başlatıldı');
  } catch (error) {
    console.error('AdMob başlatma hatası:', error);
  }
};

// Banner reklam göster
export const showBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const options: BannerAdOptions = {
      adId: getAdUnitId('banner'),
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 60, // Bottom navigation için margin
      isTesting: ADMOB_CONFIG.testMode,
    };

    await AdMob.showBanner(options);
    console.log('Banner reklam gösterildi');
  } catch (error) {
    console.error('Banner reklam hatası:', error);
  }
};

// Banner reklamı gizle
export const hideBannerAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.error('Banner gizleme hatası:', error);
  }
};

// Interstitial (tam ekran) reklam hazırla
export const prepareInterstitialAd = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const options: AdOptions = {
      adId: getAdUnitId('interstitial'),
      isTesting: ADMOB_CONFIG.testMode,
    };

    await AdMob.prepareInterstitial(options);
    console.log('Interstitial reklam hazır');
  } catch (error) {
    console.error('Interstitial hazırlama hatası:', error);
  }
};

// Interstitial reklamı göster
export const showInterstitialAd = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    await AdMob.showInterstitial();
    console.log('Interstitial reklam gösterildi');
    return true;
  } catch (error) {
    console.error('Interstitial gösterme hatası:', error);
    return false;
  }
};

// Reklam event listener'ları
export const setupAdListeners = (): void => {
  if (!Capacitor.isNativePlatform()) return;

  AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
    console.log('Interstitial yüklendi:', info);
  });

  AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
    console.log('Interstitial kapatıldı');
    // Bir sonraki için hazırla
    prepareInterstitialAd();
  });

  AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
    console.error('Interstitial yükleme hatası:', error);
  });
};
