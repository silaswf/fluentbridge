/**
 * @file src/components/SettingsModal.tsx
 * @description Modal unificado de Configurações: sotaque regional, tema (Claro/Escuro/Sistema), idioma da interface, fonte, fila offline e logout.
 * @exports SettingsModal
 */
import { useState } from 'react';
import {
  Download,
  Globe2,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { getRegionalAccents } from '../data/regionalAccents';
import type { LanguageCode, LanguageCourse, UserProfile } from '../types/learning';
import { tUi, type UiLocale } from '../utils/i18n';
import type { ThemeMode } from '../utils/theme';
import type { FontScale } from '../utils/accessibility';

interface SettingsModalProps {
  open: boolean;
  user: UserProfile;
  activeCourse: LanguageCourse;
  activeDialect: string;
  themeMode: ThemeMode;
  uiLocale: UiLocale;
  fontScale: FontScale;
  pendingOutboxCount?: number;
  hasAppUpdate?: boolean;
  latestAppVersion?: string | null;
  onClose: () => void;
  onChangeDialect: (langCode: LanguageCode, dialectCode: string) => void;
  onCycleTheme: () => void;
  onChangeUiLocale: (locale: UiLocale) => void;
  onChangeFontScale: (scale: FontScale) => void;
  onFlushOutbox?: () => void;
  onOpenUpdateModal?: () => void;
  onOpenPrivacyLgpd?: () => void;
  onOpenDownloadModal?: () => void;
  onLogout: () => void;
}

export function SettingsModal({
  open,
  user,
  activeCourse,
  activeDialect,
  themeMode,
  uiLocale,
  fontScale,
  pendingOutboxCount = 0,
  hasAppUpdate = false,
  latestAppVersion = null,
  onClose,
  onChangeDialect,
  onCycleTheme,
  onChangeUiLocale,
  onChangeFontScale,
  onFlushOutbox,
  onOpenUpdateModal,
  onOpenPrivacyLgpd,
  onOpenDownloadModal,
  onLogout,
}: SettingsModalProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (!open) return null;

  const regionalAccents = getRegionalAccents(activeCourse.code);
  const ThemeIcon =
    themeMode === 'dark' ? Moon : themeMode === 'light' ? Sun : Monitor;
  const themeLabel =
    themeMode === 'dark' ? 'Escuro' : themeMode === 'light' ? 'Claro' : 'Sistema';

  return (
    <div
      data-testid="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="fb-card-primary max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              {tUi(uiLocale, 'settings.title')}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {tUi(uiLocale, 'settings.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tUi(uiLocale, 'common.close')}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* 1. Voz & Sotaque Regional */}
          <section className="fb-card-secondary p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                {tUi(uiLocale, 'settings.voiceSection')} · {activeCourse.namePt}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              {tUi(uiLocale, 'settings.voiceHelp')}
            </p>
            <select
              data-testid="settings-accent-select"
              value={activeDialect}
              onChange={(e) => onChangeDialect(activeCourse.code, e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800"
            >
              {regionalAccents.map((acc) => (
                <option key={acc.code} value={acc.code}>
                  {acc.flag} {acc.regionPt} ({acc.shortLabel})
                </option>
              ))}
            </select>
          </section>

          {/* 2. Aparência & Acessibilidade */}
          <section className="fb-card-secondary p-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              {tUi(uiLocale, 'settings.appearanceSection')}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {tUi(uiLocale, 'settings.themeLabel')}
              </span>
              <button
                type="button"
                data-testid="settings-theme-btn"
                onClick={onCycleTheme}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ThemeIcon className="h-3.5 w-3.5 text-blue-600" />
                <span>{themeLabel}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {tUi(uiLocale, 'a11y.uiLang')}
              </span>
              <div className="flex gap-1">
                {(['pt', 'en', 'es'] as const).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    data-testid={`ui-locale-${loc}`}
                    onClick={() => onChangeUiLocale(loc)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
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

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
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
                    data-testid={`font-scale-${sc.id}`}
                    onClick={() => onChangeFontScale(sc.id)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer ${
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
          </section>

          {/* 3. App, Offline & Privacidade */}
          <section className="fb-card-secondary p-4 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              {tUi(uiLocale, 'settings.appSection')}
            </h3>

            {pendingOutboxCount > 0 && onFlushOutbox && (
              <button
                type="button"
                data-testid="sidebar-flush-outbox-btn"
                onClick={onFlushOutbox}
                className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
              >
                <span>{tUi(uiLocale, 'settings.syncOffline')}</span>
                <span className="rounded-full bg-amber-600 px-2 py-0.5 font-mono text-[10px] text-white">
                  {pendingOutboxCount}
                </span>
              </button>
            )}

            {onOpenUpdateModal && (
              <button
                type="button"
                data-testid="sidebar-update-app-btn"
                onClick={() => {
                  onClose();
                  onOpenUpdateModal();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{tUi(uiLocale, 'nav.updateApp')}</span>
                </span>
                {hasAppUpdate && latestAppVersion && (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 font-mono text-[10px] text-white">
                    v{latestAppVersion}
                  </span>
                )}
              </button>
            )}

            {onOpenPrivacyLgpd && (
              <button
                type="button"
                data-testid="sidebar-privacy-lgpd-btn"
                onClick={() => {
                  onClose();
                  onOpenPrivacyLgpd();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{tUi(uiLocale, 'settings.lgpd')}</span>
                </span>
              </button>
            )}

            {onOpenDownloadModal && (
              <button
                type="button"
                data-testid="sidebar-download-app-btn"
                onClick={() => {
                  onClose();
                  onOpenDownloadModal();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="h-3.5 w-3.5" />
                  <span>{tUi(uiLocale, 'nav.downloadApp')}</span>
                </span>
              </button>
            )}
          </section>

          {/* 4. Conta (confirmação em 2 cliques para evitar saída acidental) */}
          <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <p className="text-xs font-bold text-slate-800">{user.name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
            {confirmLogout ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setConfirmLogout(false)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {tUi(uiLocale, 'common.cancel')}
                </button>
                <button
                  type="button"
                  data-testid="settings-confirm-logout-btn"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-rose-700 cursor-pointer"
                >
                  {tUi(uiLocale, 'settings.logoutConfirm')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-testid="settings-logout-btn"
                onClick={() => setConfirmLogout(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{tUi(uiLocale, 'settings.logout')}</span>
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
