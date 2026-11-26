export type HebrewScriptMode = 'niqqud' | 'modern';

const HEBREW_MODE_KEY = 'fb_he_script_mode_v1';

/**
 * Remove sinais vocálicos hebraicos (Niqqud / cantilação U+0591..U+05C7)
 * para treinar leitura moderna sem vogais a partir do B1–C1.
 */
export function stripHebrewNiqqud(text: string): string {
  return text.replace(/[\u0591-\u05c7]/g, '');
}

export function loadHebrewScriptMode(): HebrewScriptMode {
  try {
    const raw = globalThis.localStorage?.getItem(HEBREW_MODE_KEY);
    return raw === 'modern' ? 'modern' : 'niqqud';
  } catch {
    return 'niqqud';
  }
}

export function saveHebrewScriptMode(mode: HebrewScriptMode): void {
  try {
    globalThis.localStorage?.setItem(HEBREW_MODE_KEY, mode);
  } catch {
    // Ignore storage quota errors
  }
}
