/**
 * @file capacitor.config.ts
 * @description Configuração do Capacitor para empacotamento Android (.apk/.aab), deep link OAuth e SplashScreen.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fluentbridge.app',
  appName: 'FluentBridge',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
