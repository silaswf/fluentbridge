import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Laptop,
  Loader2,
  RefreshCw,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import {
  applyWebOtaRefresh,
  checkForAppUpdate,
  getActivePlatformLabel,
  getDesktopBridge,
  triggerAndroidApkUpdate,
  type AppUpdateInfo,
} from '../utils/appUpdater';

interface AppUpdateModalProps {
  open: boolean;
  initialInfo?: AppUpdateInfo | null;
  onUpdateInfo?: (info: AppUpdateInfo) => void;
  onClose: () => void;
}

export function AppUpdateModal({
  open,
  initialInfo,
  onUpdateInfo,
  onClose,
}: AppUpdateModalProps) {
  const [info, setInfo] = useState<AppUpdateInfo | null>(initialInfo ?? null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; status: string } | null>(
    null,
  );
  const [actionError, setActionError] = useState('');

  const platform = getActivePlatformLabel();
  const desktopBridge = getDesktopBridge();

  useEffect(() => {
    if (initialInfo) setInfo(initialInfo);
  }, [initialInfo]);

  useEffect(() => {
    if (!open) return;
    if (!info) {
      void handleCheck();
    }
  }, [open]);

  useEffect(() => {
    if (!desktopBridge?.onUpdateProgress) return undefined;
    return desktopBridge.onUpdateProgress((data) => {
      setProgress(data);
    });
  }, [desktopBridge]);

  if (!open) return null;

  const handleCheck = async () => {
    setChecking(true);
    setActionError('');
    const next = await checkForAppUpdate();
    setInfo(next);
    onUpdateInfo?.(next);
    setChecking(false);
  };

  const handleWindowsAutoUpdate = async () => {
    if (!info) return;
    setActionError('');
    if (desktopBridge?.downloadAndInstallUpdate) {
      setDownloading(true);
      setProgress({ percent: 5, status: 'Iniciando download...' });
      const res = await desktopBridge.downloadAndInstallUpdate(
        info.windowsUrl,
        info.latestVersion,
      );
      setDownloading(false);
      if (!res.ok) {
        setActionError(res.error ?? 'Falha ao iniciar atualização automática.');
      }
      return;
    }
    window.open(info.windowsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAndroidUpdate = async () => {
    if (!info) return;
    setActionError('');
    try {
      await triggerAndroidApkUpdate(info.androidUrl);
    } catch {
      setActionError('Não foi possível abrir o instalador APK automaticamente.');
    }
  };

  return (
    <div
      data-testid="app-update-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="animate-fade-up relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar atualizador"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <RefreshCw className={`h-5 w-5 ${checking ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              Atualização do FluentBridge
            </h2>
            <p className="text-xs text-slate-500">
              Plataforma atual: <strong>{platform}</strong> · Versão instalada:{' '}
              <strong className="font-mono">v{info?.currentVersion ?? '6.1.0'}</strong>
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-800">
                {checking
                  ? 'Verificando versão mais recente...'
                  : info?.hasUpdate
                    ? `Nova versão disponível: v${info.latestVersion}`
                    : `Você está na versão mais recente (v${info?.latestVersion ?? '6.1.0'})`}
              </p>
              {info?.checkedAt && (
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Última verificação às {info.checkedAt}
                  {info.publishedAt ? ` · Publicada em ${info.publishedAt}` : ''}
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={checking || downloading}
              onClick={() => void handleCheck()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>Verificar agora</span>
            </button>
          </div>

          {info?.error && (
            <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800">
              {info.error}
            </p>
          )}

          {info?.hasUpdate && info.releaseNotes && (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 text-[11px] text-slate-700">
              <p className="font-bold text-blue-900">Novidades da versão:</p>
              <p className="mt-0.5 whitespace-pre-line line-clamp-4">
                {info.releaseNotes}
              </p>
            </div>
          )}
        </div>

        {downloading && progress && (
          <div className="mt-4 space-y-1.5 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs">
            <div className="flex items-center justify-between font-bold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {progress.status}
              </span>
              <span className="font-mono">{progress.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {actionError && (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {actionError}
          </p>
        )}

        <div className="mt-5 space-y-2.5">
          {platform === 'Windows Desktop' && (
            <button
              type="button"
              disabled={downloading}
              onClick={() => void handleWindowsAutoUpdate()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              <Laptop className="h-4 w-4" />
              <span>
                {desktopBridge?.downloadAndInstallUpdate
                  ? 'Baixar & Atualizar Windows Automaticamente (.exe)'
                  : 'Baixar Atualização Windows (.exe)'}
              </span>
            </button>
          )}

          {platform === 'Android' && (
            <button
              type="button"
              onClick={() => void handleAndroidUpdate()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>Baixar &amp; Instalar Atualização Android (.apk)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => void applyWebOtaRefresh()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>
              {platform === 'Web PWA'
                ? 'Atualizar Versão Web (Limpar Cache & Recarregar)'
                : 'Recarregar Recursos & Cache do App'}
            </span>
          </button>

          {platform === 'Web PWA' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => void handleWindowsAutoUpdate()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Installer Windows</span>
              </button>
              <button
                type="button"
                onClick={() => void handleAndroidUpdate()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>APK Android</span>
              </button>
            </div>
          )}

          {info?.releasePageUrl && (
            <a
              href={info.releasePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Ver notas completas no GitHub Releases</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
