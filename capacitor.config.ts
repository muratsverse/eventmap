import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.muratveozturk.eventmap',
  appName: 'Spotly',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    Browser: {
      // Android'de Chrome Custom Tabs yerine WebView kullan
      androidxBrowser: false
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'eventmap-release-key.keystore',
      keystorePassword: 'EventMap2024!Secure',
      keystoreAlias: 'eventmap-key',
      keystoreAliasPassword: 'EventMap2024!Secure',
      releaseType: 'AAB'
    }
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Spotly',
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
