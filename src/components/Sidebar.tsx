import { useState } from 'react';
import {
  Award,
  Bot,
  BrainCircuit,
  Compass,
  Flame,
  GraduationCap,
  Lightbulb,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Snowflake,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react';
import { isMasterAdminEmail } from '../config/appConfig';
import { LANGUAGE_COURSES } from '../data/languages';
import type { LanguageCode, LanguageCourse, UserProfile } from '../types/learning';
import type { ThemeMode } from '../utils/theme';

export type NavView =
  | 'learn'
  | 'tutor'
  | 'review'
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
  onLogout,
}: SidebarProps) {
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
      label: `Trilha (${topicsCount} unid.)`,
      shortLabel: 'Trilha',
      Icon: Compass,
    },
    {
      id: 'tutor',
      label: 'Conversação IA',
      shortLabel: 'Tutor IA',
      Icon: Bot,
    },
    {
      id: 'review',
      label: `Revisão (${vocabCount} cards)`,
      shortLabel: 'Revisão',
      Icon: BrainCircuit,
      badge: dueVocabCount > 0 ? dueVocabCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'tips',
      label: 'Central & Guia',
      shortLabel: 'Dicas',
      Icon: Lightbulb,
    },
    {
      id: 'certificates',
      label: 'Certificados CEFR',
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
            label: 'Modo Professor',
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
            label: 'Painel Admin',
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

  const activeDialectObj =
    activeCourse.dialects.find((d) => d.code === activeDialect) ??
    activeCourse.dialects[0];

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

        {/* Multi-Language Course Switcher */}
        {!isCollapsed && (
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2.5">
            <p className="px-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Idioma em estudo
            </p>
            <div className="mt-1.5 grid grid-cols-4 gap-1">
              {LANGUAGE_COURSES.map((course) => {
                const selected = course.code === activeCourse.code;
                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => onChangeLanguage(course.code)}
                    title={`${course.namePt} (${course.nativeName})`}
                    className={`flex flex-col items-center rounded-xl px-1 py-1.5 text-[10px] font-bold transition cursor-pointer ${
                      selected
                        ? 'bg-white text-blue-700 shadow-2xs ring-1 ring-blue-200'
                        : 'text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-base leading-none">{course.flag}</span>
                    <span className="mt-1 w-full truncate text-center">
                      {course.namePt.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
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

        {/* Dynamic Dialect & Theme Selector right below navigation */}
        {!isCollapsed ? (
          <div className="mt-4 space-y-2.5 border-t border-slate-200/70 pt-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
              <p className="text-xs font-semibold text-slate-700">
                Sotaque ({activeCourse.namePt})
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {activeCourse.dialects.map((dial) => (
                  <button
                    key={dial.code}
                    type="button"
                    onClick={() => onChangeDialect(dial.code)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeDialect === dial.code
                        ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-200'
                        : 'text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    {dial.flag} {dial.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onCycleTheme}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ThemeIcon className="h-3.5 w-3.5 text-blue-600" />
                <span>Tema da interface</span>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200">
                {themeLabel}
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2 border-t border-slate-200/70 pt-4">
            <button
              type="button"
              onClick={cycleMobileDialect}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm cursor-pointer"
              title={`Sotaque: ${activeDialectObj?.label ?? activeDialect}`}
            >
              {activeDialectObj?.flag ?? '🌐'}
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
      <header className="safe-pt-3 sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 pb-2.5 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <select
            value={activeCourse.code}
            onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800"
            aria-label="Selecionar idioma"
          >
            {LANGUAGE_COURSES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.namePt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          {activeDialectObj && (
            <button
              type="button"
              onClick={cycleMobileDialect}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700"
            >
              {activeDialectObj.flag}
            </button>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-600">
            <Flame className="h-3 w-3" />
            {user.streakDays}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
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
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500"
            aria-label="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="safe-pb-nav fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 px-1 pt-1.5 backdrop-blur-sm lg:hidden"
        aria-label="Navegação mobile"
      >
        {navItems.map(({ id, shortLabel, Icon, badge }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeView(id)}
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
      </nav>
    </>
  );
}
