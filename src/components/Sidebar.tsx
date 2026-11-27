/**
 * @file src/components/Sidebar.tsx
 * @description Navegação lateral responsiva e barra mobile inferior com seletor de 17 idiomas, badges de XP/ofensiva e acesso a todos os módulos.
 * @exports NavView, Sidebar
 */
import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Compass,
  Download,
  FileCheck2,
  Flame,
  GraduationCap,
  Headphones,
  Languages,
  Lightbulb,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { isMasterAdminEmail } from '../config/appConfig';
import { LANGUAGE_COURSES_META as LANGUAGE_COURSES } from '../data/platformDefaults';
import type { LanguageCode, LanguageCourse, UserProfile } from '../types/learning';
import type { ThemeMode } from '../utils/theme';
import type { FontScale } from '../utils/accessibility';
import { getAccentDisplayMeta } from '../utils/accentPreference';
import { tUi, type UiLocale } from '../utils/i18n';

const LANGUAGE_BADGE_META: Record<LanguageCode, { symbol: string; accent: string }> = {
  en: { symbol: 'EN', accent: 'bg-blue-600 text-white' },
  es: { symbol: 'ES', accent: 'bg-amber-600 text-white' },
  fr: { symbol: 'FR', accent: 'bg-indigo-600 text-white' },
  it: { symbol: 'IT', accent: 'bg-emerald-600 text-white' },
  de: { symbol: 'DE', accent: 'bg-slate-800 text-amber-300' },
  ru: { symbol: 'РУ', accent: 'bg-sky-700 text-white' },
  ja: { symbol: '日本', accent: 'bg-rose-600 text-white' },
  zh: { symbol: '中文', accent: 'bg-red-700 text-amber-200' },
  ar: { symbol: 'عربي', accent: 'bg-teal-700 text-white' },
  nl: { symbol: 'NL', accent: 'bg-orange-600 text-white' },
  af: { symbol: 'AF', accent: 'bg-green-700 text-white' },
  sv: { symbol: 'SV', accent: 'bg-blue-700 text-yellow-300' },
  tr: { symbol: 'TR', accent: 'bg-red-600 text-white' },
  he: { symbol: 'עב', accent: 'bg-blue-800 text-white' },
  nb: { symbol: 'NB', accent: 'bg-rose-700 text-white' },
  da: { symbol: 'DA', accent: 'bg-red-700 text-white' },
  pt: { symbol: 'PT', accent: 'bg-emerald-700 text-yellow-300' },
};

export type NavView =
  | 'learn'
  | 'tracks'
  | 'tutor'
  | 'translator'
  | 'review'
  | 'exams'
  | 'community'
  | 'live'
  | 'immersion'
  | 'tips'
  | 'certificates'
  | 'teacher'
  | 'admin';

interface SidebarProps {
  activeView: NavView;
  onChangeView: (view: NavView) => void;
  schoolName: string;
  teacherName: string;
  user: UserProfile;
  activeCourse: LanguageCourse;
  activeDialect: string;
  topicsCount: number;
  vocabCount: number;
  classNameLabel?: string;
  onChangeLanguage: (code: LanguageCode) => void;
  onChangeDialect: (dialectCode: string) => void;
  dueVocabCount: number;
  pendingSubmissionsCount: number;
  themeMode: ThemeMode;
  onCycleTheme: () => void;
  onOpenDownloadModal?: () => void;
  onOpenUpdateModal?: () => void;
  onOpenPrivacyLgpd?: () => void;
  onOpenSettings?: () => void;
  pendingOutboxCount?: number;
  onFlushOutbox?: () => void;
  hasAppUpdate?: boolean;
  latestAppVersion?: string;
  uiLocale?: UiLocale;
  onChangeUiLocale?: (loc: UiLocale) => void;
  fontScale?: FontScale;
  onChangeFontScale?: (scale: FontScale) => void;
  onLogout: () => void;
}

export function Sidebar({
  activeView,
  onChangeView,
  schoolName,
  teacherName,
  user,
  activeCourse,
  activeDialect,
  topicsCount,
  vocabCount,
  classNameLabel,
  onChangeLanguage,
  onChangeDialect,
  dueVocabCount,
  pendingSubmissionsCount,
  themeMode,
  onCycleTheme,
  onOpenDownloadModal,
  onOpenUpdateModal,
  onOpenPrivacyLgpd,
  onOpenSettings,
  pendingOutboxCount = 0,
  onFlushOutbox,
  hasAppUpdate,
  latestAppVersion,
  uiLocale = 'pt',
  onChangeUiLocale,
  fontScale = 'md',
  onChangeFontScale,
  onLogout,
}: SidebarProps) {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!langMenuOpen) return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [langMenuOpen]);

  const activeLangBadge = LANGUAGE_BADGE_META[activeCourse.code] ?? {
    symbol: activeCourse.code.toUpperCase(),
    accent: 'bg-blue-600 text-white',
  };
  const ThemeIcon =
    themeMode === 'dark' ? Moon : themeMode === 'system' ? Monitor : Sun;
  const themeLabel =
    themeMode === 'dark' ? 'Escuro' : themeMode === 'system' ? 'Auto' : 'Claro';

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('fluentbridge_sidebar_collapsed') === '1';
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('fluentbridge_sidebar_collapsed', next ? '1' : '0');
      }
      return next;
    });
  };

  const isMaster =
    Boolean(user.isMasterAdmin) || isMasterAdminEmail(user.email);

  const navItems: {
    id: NavView;
    label: string;
    shortLabel: string;
    Icon: typeof Compass;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'learn',
      label: `${tUi(uiLocale, 'nav.learn')} (${topicsCount})`,
      shortLabel: uiLocale === 'pt' ? 'Trilha' : tUi(uiLocale, 'nav.learn'),
      Icon: Compass,
    },
    {
      id: 'tracks',
      label: 'Trilhas Especializadas (12)',
      shortLabel: 'Trilhas Pro',
      Icon: Sparkles,
    },
    {
      id: 'tutor',
      label: tUi(uiLocale, 'nav.tutor'),
      shortLabel: uiLocale === 'pt' ? 'Tutor IA' : 'AI Tutor',
      Icon: Bot,
    },
    {
      id: 'review',
      label: `${tUi(uiLocale, 'nav.review')} (${vocabCount})`,
      shortLabel: uiLocale === 'pt' ? 'Revisão' : 'Review',
      Icon: BrainCircuit,
      badge: dueVocabCount > 0 ? dueVocabCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'exams',
      label: tUi(uiLocale, 'nav.exams'),
      shortLabel: uiLocale === 'pt' ? 'Simulados' : 'Exams',
      Icon: FileCheck2,
    },
    {
      id: 'community',
      label: tUi(uiLocale, 'nav.community'),
      shortLabel: 'Comunidade',
      Icon: Users,
    },
    {
      id: 'live',
      label: tUi(uiLocale, 'nav.live'),
      shortLabel: 'Ao Vivo',
      Icon: Video,
    },
    {
      id: 'immersion',
      label: tUi(uiLocale, 'nav.immersion'),
      shortLabel: 'Imersão',
      Icon: Headphones,
    },
    {
      id: 'tips',
      label: tUi(uiLocale, 'nav.tips'),
      shortLabel: 'Guias',
      Icon: Lightbulb,
    },
    {
      id: 'translator',
      label: tUi(uiLocale, 'nav.translator'),
      shortLabel: tUi(uiLocale, 'nav.translator'),
      Icon: Languages,
    },
    {
      id: 'certificates',
      label: tUi(uiLocale, 'nav.certificates'),
      shortLabel: 'Certs',
      Icon: Award,
      badge:
        user.issuedCertificates.length > 0
          ? user.issuedCertificates.length
          : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    ...(user.role === 'teacher'
      ? [
          {
            id: 'teacher' as NavView,
            label: tUi(uiLocale, 'nav.teacher'),
            shortLabel: 'Professor',
            Icon: GraduationCap,
            badge:
              pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
            badgeColor: 'bg-amber-100 text-amber-800',
          },
        ]
      : []),
    ...(isMaster
      ? [
          {
            id: 'admin' as NavView,
            label: tUi(uiLocale, 'nav.admin'),
            shortLabel: 'Admin',
            Icon: ShieldAlert,
          },
        ]
      : []),
  ];

  const cycleMobileDialect = () => {
    if (activeCourse.dialects.length < 2) return;
    const idx = activeCourse.dialects.findIndex((d) => d.code === activeDialect);
    const next = activeCourse.dialects[(idx + 1) % activeCourse.dialects.length];
    onChangeDialect(next.code);
  };

  const activeDialectMeta = getAccentDisplayMeta(activeCourse.code, activeDialect);
  const activeDialectObj = {
    code: activeDialectMeta.code,
    flag: activeDialectMeta.flag,
    label: activeDialectMeta.shortLabel,
    regionPt: activeDialectMeta.regionPt,
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-slate-200/80 lg:bg-white lg:py-5 transition-all duration-200 ${
          isCollapsed ? 'lg:w-20 lg:px-2.5' : 'lg:w-72 lg:px-5'
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-2 px-1'}`}>
          {!isCollapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-extrabold tracking-tight text-slate-900">
                  {schoolName}
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {teacherName} · Multi-Idiomas
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
            title={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Multi-Language Course Switcher (Collapsible Dropdown) */}
        {!isCollapsed && (
          <div ref={langMenuRef} className="relative mt-4">
            <p className="mb-1.5 px-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Idioma em estudo
            </p>
            <button
              type="button"
              data-testid="language-switcher-trigger"
              aria-expanded={langMenuOpen}
              onClick={() => setLangMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-white cursor-pointer"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold tracking-tight shadow-2xs ${activeLangBadge.accent}`}
                >
                  {activeLangBadge.symbol}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-extrabold text-slate-900">
                    {activeCourse.namePt}
                  </p>
                  <p className="truncate text-[11px] font-medium text-slate-500">
                    {activeCourse.nativeName} · {LANGUAGE_COURSES.length} idiomas
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                  langMenuOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            {langMenuOpen && (
              <div
                data-testid="language-switcher-menu"
                className="animate-fade-up absolute inset-x-0 top-full z-40 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
              >
                {LANGUAGE_COURSES.map((course) => {
                  const selected = course.code === activeCourse.code;
                  const badge = LANGUAGE_BADGE_META[course.code] ?? {
                    symbol: course.code.toUpperCase(),
                    accent: 'bg-slate-600 text-white',
                  };
                  return (
                    <button
                      key={course.code}
                      type="button"
                      data-testid={`lang-option-${course.code}`}
                      title={`${course.namePt} (${course.nativeName})`}
                      onClick={() => {
                        onChangeLanguage(course.code);
                        setLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition cursor-pointer ${
                        selected
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${badge.accent}`}
                        >
                          {badge.symbol}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold">
                            {course.namePt}
                          </span>
                          <span className="block truncate text-[10px] text-slate-500">
                            {course.nativeName}
                          </span>
                        </span>
                      </span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Logged-in User Card */}
        {!isCollapsed && (
          <div className="mt-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xs font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] font-medium text-slate-500">
                    {isMaster
                      ? 'Admin Mestre'
                      : user.role === 'teacher'
                        ? 'Professor(a)'
                        : classNameLabel ?? 'Aluno(a)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                title="Trocar conta / Sair"
                aria-label="Trocar conta ou sair"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Streak & XP Pills */}
        {!isCollapsed && (
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="font-mono text-sm font-bold text-slate-900">
                  {user.streakDays}d
                </p>
                <p className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Ofensiva</span>
                  <span title="Proteções de Ofensiva (Streak Freeze)" className="inline-flex items-center gap-0.5 text-sky-600 font-semibold">
                    <Snowflake className="h-2.5 w-2.5" />
                    {user.streakFreezes ?? 1}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-mono text-sm font-bold text-slate-900">
                  {user.xp}
                </p>
                <p className="text-[11px] text-slate-500">Total XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links (sem flex-1 para manter Sotaque & Tema logo abaixo) */}
        <nav className="mt-4 space-y-1" aria-label="Navegação principal">
          {navItems.map(({ id, label, shortLabel, Icon, badge, badgeColor }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChangeView(id)}
                title={isCollapsed ? label : undefined}
                className={`flex w-full items-center ${
                  isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-2xs ring-1 ring-blue-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      active ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span>{label}</span>}
                  {isCollapsed && <span className="sr-only">{shortLabel}</span>}
                </span>
                {!isCollapsed && badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                      badgeColor ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact Settings & Quick Theme Footer (fits 1080p without clutter) */}
        {!isCollapsed ? (
          <div className="mt-4 space-y-2 border-t border-slate-200/70 pt-4">
            <button
              type="button"
              data-testid="open-settings-btn"
              onClick={onOpenSettings}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Settings className="h-4 w-4 text-blue-600" />
                <span>{tUi(uiLocale, 'nav.settings')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                  {activeDialectObj.flag} {activeDialectObj.label}
                </span>
                {(hasAppUpdate || pendingOutboxCount > 0) && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={onCycleTheme}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ThemeIcon className="h-3.5 w-3.5 text-blue-600" />
                <span>{tUi(uiLocale, 'settings.themeLabel')}</span>
              </span>
              <span className="rounded-md bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200">
                {themeLabel}
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2 border-t border-slate-200/70 pt-4">
            <button
              type="button"
              data-testid="open-settings-btn"
              onClick={onOpenSettings}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
              title={tUi(uiLocale, 'nav.settings')}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onCycleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
              title={`Tema: ${themeLabel}`}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-rose-600 cursor-pointer"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Top Header */}
      <header className="safe-pt-3 sticky top-0 z-30 flex min-w-0 items-center justify-between gap-1.5 overflow-x-hidden border-b border-slate-200/80 bg-white/95 px-2.5 pb-2.5 backdrop-blur-sm sm:px-3 lg:hidden">
        <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
          <div
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white min-[380px]:flex sm:h-8 sm:w-8 sm:text-xs"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <select
            value={activeCourse.code}
            onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
            className="max-w-[108px] min-w-0 truncate rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1 text-xs font-bold text-slate-800 sm:max-w-[122px] sm:px-2"
            aria-label="Selecionar idioma"
          >
            {LANGUAGE_COURSES.map((c) => {
              const badge = LANGUAGE_BADGE_META[c.code]?.symbol ?? c.code.toUpperCase();
              return (
                <option key={c.code} value={c.code}>
                  {badge} · {c.namePt}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {activeDialectObj && (
            <button
              type="button"
              onClick={cycleMobileDialect}
              className="rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] font-semibold text-slate-700 sm:px-2"
            >
              {activeDialectObj.flag}
            </button>
          )}
          <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-1 text-[10px] font-bold text-orange-600 sm:gap-1 sm:px-2 sm:text-[11px]">
            <Flame className="h-3 w-3" />
            {user.streakDays}
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-1 text-[10px] font-bold text-blue-700 sm:gap-1 sm:px-2 sm:text-[11px]">
            <Zap className="h-3 w-3" />
            {user.xp}
          </span>
          <button
            type="button"
            onClick={onCycleTheme}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500"
            title={`Tema: ${themeLabel}`}
            aria-label="Alternar tema"
          >
            <ThemeIcon className="h-3.5 w-3.5" />
          </button>
          {onOpenSettings && (
            <button
              type="button"
              data-testid="open-settings-btn-mobile"
              onClick={onOpenSettings}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600"
              title={tUi(uiLocale, 'nav.settings')}
              aria-label={tUi(uiLocale, 'nav.settings')}
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (4 hábitos principais incl. Revisão + Menu Mais) */}
      <nav
        className="safe-pb-nav fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 px-1 pt-1.5 backdrop-blur-sm lg:hidden"
        aria-label="Navegação mobile"
      >
        {navItems
          .filter((item) => ['learn', 'review', 'tutor', 'exams'].includes(item.id))
          .map(({ id, shortLabel, Icon, badge }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                type="button"
                data-testid={`mobile-nav-${id}`}
                onClick={() => {
                  setMobileMoreOpen(false);
                  onChangeView(id);
                }}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
                  active ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="truncate">{shortLabel}</span>
                {badge !== undefined && (
                  <span className="absolute top-0.5 right-2 rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        <button
          type="button"
          data-testid="mobile-more-trigger"
          onClick={() => setMobileMoreOpen((v) => !v)}
          className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
            mobileMoreOpen || ['community', 'live', 'immersion', 'tips', 'certificates', 'teacher', 'admin'].includes(activeView)
              ? 'text-blue-600'
              : 'text-slate-500'
          }`}
        >
          {mobileMoreOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          <span className="truncate">{tUi(uiLocale, 'nav.more')}</span>
        </button>
      </nav>

      {mobileMoreOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-slate-950/40 backdrop-blur-2xs lg:hidden"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            data-testid="mobile-more-sheet"
            className="safe-bottom max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-bold text-slate-900">
                {tUi(uiLocale, 'nav.moreModules')}
              </p>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="rounded-lg p-1 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems
                .filter((item) => !['learn', 'review', 'tutor', 'exams'].includes(item.id))
                .map(({ id, label, Icon, badge }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onChangeView(id);
                      setMobileMoreOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold ${
                      activeView === id
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </span>
                    {badge !== undefined && (
                      <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
            </div>

            {/* Seção de largura total (fora do grid de 2 colunas) */}
            <div className="mt-4 space-y-2.5 border-t border-slate-200/80 pt-4">
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    onOpenSettings();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <span>{tUi(uiLocale, 'settings.title')}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {activeDialectObj.flag} {activeDialectObj.label}
                  </span>
                </button>
              )}

              {(onChangeUiLocale || onChangeFontScale) && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-2">
                  {onChangeUiLocale && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {tUi(uiLocale, 'a11y.uiLang')}
                      </span>
                      <div className="flex gap-1">
                        {(['pt', 'en', 'es'] as const).map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => onChangeUiLocale(loc)}
                            className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase cursor-pointer ${
                              uiLocale === loc
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-600 ring-1 ring-slate-200'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {onChangeFontScale && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {tUi(uiLocale, 'a11y.fontScale')}
                      </span>
                      <div className="flex gap-1">
                        {(
                          [
                            { id: 'sm', label: 'A-' },
                            { id: 'md', label: 'A' },
                            { id: 'lg', label: 'A+' },
                            { id: 'xl', label: 'A++' },
                          ] as const
                        ).map((sc) => (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => onChangeFontScale(sc.id)}
                            className={`rounded-md px-2 py-1 text-[10px] font-bold cursor-pointer ${
                              fontScale === sc.id
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-600 ring-1 ring-slate-200'
                            }`}
                          >
                            {sc.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {onOpenUpdateModal && (
                  <button
                    type="button"
                    data-testid="mobile-update-app-btn"
                    onClick={() => {
                      setMobileMoreOpen(false);
                      onOpenUpdateModal();
                    }}
                    className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>{tUi(uiLocale, 'nav.updateApp')}</span>
                    </span>
                    {hasAppUpdate && latestAppVersion && (
                      <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 font-mono text-[9px] text-white">
                        v{latestAppVersion}
                      </span>
                    )}
                  </button>
                )}

                {onOpenPrivacyLgpd && (
                  <button
                    type="button"
                    data-testid="mobile-privacy-lgpd-btn"
                    onClick={() => {
                      setMobileMoreOpen(false);
                      onOpenPrivacyLgpd();
                    }}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>{tUi(uiLocale, 'settings.lgpd')}</span>
                  </button>
                )}
              </div>

              {pendingOutboxCount > 0 && onFlushOutbox && (
                <button
                  type="button"
                  data-testid="mobile-flush-outbox-btn"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    onFlushOutbox();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs font-bold text-amber-800"
                >
                  <span>{tUi(uiLocale, 'settings.syncOffline')}</span>
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 font-mono text-[10px] text-white">
                    {pendingOutboxCount}
                  </span>
                </button>
              )}

              {onOpenDownloadModal && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMoreOpen(false);
                    onOpenDownloadModal();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>{tUi(uiLocale, 'nav.downloadApp')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
