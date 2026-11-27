/**
 * @file src/utils/platform.ts
 * @description Helpers de detecção de plataforma (Web, Electron, Capacitor Android) e idiomas RTL (Árabe/Hebraico).
 * @exports isNativeAndroid, isElectronDesktop, isWebPlatform, isRtlLanguage
 */
import { Capacitor } from '@capacitor/core';
import type { LanguageCode } from '../types/learning';

export function isNativeAndroid(): boolean {
  try {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  } catch {
    return false;
  }
}

export function isElectronDesktop(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /electron/i.test(navigator.userAgent);
}

export function isWebPlatform(): boolean {
  return !isNativeAndroid() && !isElectronDesktop();
}

export function isRtlLanguage(code?: LanguageCode): boolean {
  return code === 'ar' || code === 'he';
}
