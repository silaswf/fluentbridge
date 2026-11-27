/**
 * @file src/components/AppDownloadGateway.tsx
 * @description Gateway multiplataforma Dark Sober: links para Windows (.exe), Android (.apk), instruções iOS Safari PWA ($0/ano), seletor PT/EN/ES e entrada na versão Web.
 * @exports AppDownloadGateway
 */
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Globe,
  Laptop,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ANDROID_APK_DOWNLOAD_URL,
  APP_VERSION,
  GITHUB_RELEASES_URL,
  WINDOWS_DOWNLOAD_URL,
} from '../config/appConfig';
import { tUi, type UiLocale } from '../utils/i18n';

interface AppDownloadGatewayProps {
  mode: 'landing' | 'modal';
  schoolName: string;
  uiLocale?: UiLocale;
  onChangeUiLocale?: (locale: UiLocale) => void;
  onContinueWeb: (rememberChoice?: boolean) => void;
  onClose?: () => void;
}

export function AppDownloadGateway({
  mode,
  schoolName,
  uiLocale = 'pt',
  onChangeUiLocale,
  onContinueWeb,
  onClose,
}: AppDownloadGatewayProps) {
  const [rememberWeb, setRememberWeb] = useState(false);

  const innerCard = (
    <div className="relative mx-auto w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-slate-100 shadow-2xl sm:p-8">
      {onChangeUiLocale && (
        <div
          data-testid="gateway-locale-switcher"
          className="mb-3 flex justify-end gap-1"
        >
          {(['pt', 'en', 'es'] as UiLocale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onChangeUiLocale(loc)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition cursor-pointer ${
                uiLocale === loc
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
      {mode === 'modal' && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela de download"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-3.5 py-1 text-xs font-bold text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          {schoolName} · Versão {APP_VERSION}
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {tUi(uiLocale, 'gateway.chooseStudy')}
        </h1>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm text-slate-400">
          {tUi(uiLocale, 'gateway.subtitle')}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-300">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1">17 Idiomas Completos</span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1">2.550 Unidades A1–C1</span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1">100 Simulados Oficiais</span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1">Tradutor + YouTube Lab</span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1">Tutor IA + Professor Real</span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Windows Desktop */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/65 p-5 transition hover:border-blue-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Aplicativo Windows
                </h2>
                <p className="text-xs text-slate-400">
                  Instalador Setup `.exe` (Windows 10/11 64-bit)
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Atalho na Área de Trabalho e Menu Iniciar
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Microfone nativo sem bloqueios de navegador
              </li>
            </ul>
          </div>

          <a
            href={WINDOWS_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="download-windows-link"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-slate-200"
          >
            <Download className="h-4 w-4" />
            <span>Baixar para Windows (.exe)</span>
          </a>
        </div>

        {/* Android Mobile */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/65 p-5 transition hover:border-emerald-500/50">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  Aplicativo Android
                </h2>
                <p className="text-xs text-slate-400">
                  APK Oficial Assinado (Android 8.0+)
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Notificações nativas de estudo e ofensiva
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Login Google nativo e sincronização em nuvem
              </li>
            </ul>
          </div>

          <a
            href={ANDROID_APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="download-android-link"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
          >
            <Download className="h-4 w-4" />
            <span>Baixar APK Android</span>
          </a>
        </div>

        {/* iPhone / iPad (PWA Safari - Zero Taxa Apple) */}
        <div
          data-testid="ios-pwa-card"
          className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/65 p-5 transition hover:border-indigo-500/50"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white">
                  iPhone / iPad (iOS)
                </h2>
                <p className="text-xs text-slate-400">
                  App Web Instalável (PWA) · 100% Gratuito
                </p>
              </div>
            </div>
            <ol className="mt-4 space-y-1.5 text-xs text-slate-300 list-decimal pl-4">
              <li>Abra o site pelo <strong className="text-white">Safari</strong> no iPhone/iPad.</li>
              <li>Toque no botão <strong className="text-white">Compartilhar</strong> (quadrado com seta).</li>
              <li>Escolha <strong className="text-white">&ldquo;Adicionar à Tela de Início&rdquo;</strong>.</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={() => onContinueWeb(rememberWeb)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span>Instalar via Safari (Web)</span>
          </button>
        </div>
      </div>

      {/* Continue on Web CTA */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-blue-950/35 p-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {mode === 'landing' ? 'Prefere estudar direto no navegador?' : 'Continuar estudando na Web'}
            </p>
            {mode === 'landing' ? (
              <label className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberWeb}
                  onChange={(e) => setRememberWeb(e.target.checked)}
                  className="rounded border-slate-600"
                />
                <span>Ir direto para o login web nas próximas visitas</span>
              </label>
            ) : (
              <p className="text-xs text-slate-300">
                Seu progresso fica salvo na nuvem entre Web, Windows e Android.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
          >
            Ver todas as versões
          </a>
          <button
            type="button"
            data-testid="continue-web-btn"
            onClick={() => onContinueWeb(rememberWeb)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500 cursor-pointer"
          >
            <span>{mode === 'landing' ? tUi(uiLocale, 'gateway.continueWeb') : 'Voltar para o App'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (mode === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-xs">
        {innerCard}
      </div>
    );
  }

  return (
    <div className="safe-top safe-bottom flex min-h-screen items-center justify-center bg-[#090D16] px-4 py-8">
      {innerCard}
    </div>
  );
}
