export type UiLocale = 'pt' | 'en' | 'es';

const UI_LOCALE_KEY = 'fb_ui_locale_v1';

const DICTIONARY: Record<UiLocale, Record<string, string>> = {
  pt: {
    'nav.learn': 'Trilha de Aulas',
    'nav.tutor': 'Conversação IA',
    'nav.review': 'Revisão & Vocab',
    'nav.tips': 'Central & Guias',
    'nav.exams': 'Simulados Oficiais',
    'nav.community': 'Comunidade & Ligas',
    'nav.live': 'Aulas ao Vivo',
    'nav.certificates': 'Certificados',
    'nav.teacher': 'Estúdio do Professor',
    'nav.admin': 'Admin Mestre',
    'nav.downloadApp': 'Baixar App (Win/Android)',
    'nav.updateApp': 'Atualizar App',
    'a11y.fontScale': 'Tamanho da Fonte',
    'a11y.uiLang': 'Idioma da Interface',
    'a11y.skipToContent': 'Ir para o conteúdo principal',
  },
  en: {
    'nav.learn': 'Learning Path',
    'nav.tutor': 'AI Conversation',
    'nav.review': 'Review & Vocab',
    'nav.tips': 'Guides & Drills',
    'nav.exams': 'Mock Exams',
    'nav.community': 'Community & Leagues',
    'nav.live': 'Live Classes',
    'nav.certificates': 'Certificates',
    'nav.teacher': 'Teacher Studio',
    'nav.admin': 'Master Admin',
    'nav.downloadApp': 'Download App (Win/Android)',
    'nav.updateApp': 'Update App',
    'a11y.fontScale': 'Font Size',
    'a11y.uiLang': 'Interface Language',
    'a11y.skipToContent': 'Skip to main content',
  },
  es: {
    'nav.learn': 'Ruta de Clases',
    'nav.tutor': 'Conversación IA',
    'nav.review': 'Repaso y Vocab',
    'nav.tips': 'Guías y Práctica',
    'nav.exams': 'Simulacros Oficiales',
    'nav.community': 'Comunidad y Ligas',
    'nav.live': 'Clases en Vivo',
    'nav.certificates': 'Certificados',
    'nav.teacher': 'Estudio Docente',
    'nav.admin': 'Admin Maestro',
    'nav.downloadApp': 'Descargar App (Win/Android)',
    'nav.updateApp': 'Actualizar App',
    'a11y.fontScale': 'Tamaño de Fuente',
    'a11y.uiLang': 'Idioma de Interfaz',
    'a11y.skipToContent': 'Ir al contenido principal',
  },
};

export function tUi(locale: UiLocale, key: string): string {
  return DICTIONARY[locale]?.[key] ?? DICTIONARY.pt[key] ?? key;
}

export function getAllUiTranslationKeys(): string[] {
  return Object.keys(DICTIONARY.pt);
}

export function loadStoredUiLocale(): UiLocale {
  if (typeof window === 'undefined') return 'pt';
  const raw = window.localStorage.getItem(UI_LOCALE_KEY);
  return raw === 'en' || raw === 'es' ? raw : 'pt';
}

export function saveUiLocale(locale: UiLocale): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UI_LOCALE_KEY, locale);
}
