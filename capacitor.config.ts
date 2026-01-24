import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.muratveozturk.eventmap',
  appName: 'Happenin',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
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
    scheme: 'Happenin',
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
