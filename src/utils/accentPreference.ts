import { REGIONAL_ACCENTS_BY_LANGUAGE, type RegionalAccentOption } from '../data/regionalAccents';
import type { Accent, LanguageCode } from '../types/learning';

export function resolvePreferredAccent(
  languageCode: LanguageCode,
  dialectByLanguage?: Partial<Record<LanguageCode, string>>,
  legacyAccent?: Accent,
): RegionalAccentOption {
  const list = REGIONAL_ACCENTS_BY_LANGUAGE[languageCode] ?? REGIONAL_ACCENTS_BY_LANGUAGE.en;
  const saved = dialectByLanguage?.[languageCode];
  if (saved) {
    const found = list.find((a) => a.code.toLowerCase() === saved.toLowerCase());
    if (found) return found;
  }
  if (languageCode === 'en' && legacyAccent) {
    const found = list.find((a) => a.code.toLowerCase() === legacyAccent.toLowerCase());
    if (found) return found;
  }
  return list[0];
}

export function getAccentDisplayMeta(
  languageCode: LanguageCode,
  code?: string,
): RegionalAccentOption {
  const list = REGIONAL_ACCENTS_BY_LANGUAGE[languageCode] ?? REGIONAL_ACCENTS_BY_LANGUAGE.en;
  if (!code) return list[0];
  return list.find((a) => a.code.toLowerCase() === code.toLowerCase()) ?? list[0];
}
