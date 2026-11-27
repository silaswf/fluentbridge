/**
 * @file src/components/teacher/SchoolSettingsTab.tsx
 * @description Aba do Estúdio do Professor para configurar nome da escola/professor, chaves de nuvem, snapshot JSON e restauração.
 * @exports SchoolSettingsTab
 */
import { useRef, useState } from 'react';
import {
  CloudDownload,
  CloudUpload,
  Copy,
  Download,
  RefreshCw,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react';
import type { CloudConfig, PlatformState, UserProfile } from '../../types/learning';
import {
  getEffectiveGeminiKey,
  getEffectiveSupabaseConfig,
  hasEmbeddedGeminiKey,
} from '../../config/appConfig';
import {
  SUPABASE_SQL_SCHEMA,
  mergePlatformStates,
  pullStateFromCloud,
  pushStateToCloud,
  testSupabaseConnection,
} from '../../utils/cloudSync';
import { DualAudioButtons } from '../DualAudioButtons';

interface SchoolSettingsTabProps {
  state: PlatformState;
  currentUser: UserProfile;
  autoSyncStatus?: { state: string; message?: string };
  voiceLabels: { us: string; uk: string };
  onUpdateSettings: (payload: { schoolName: string; teacherName: string }) => void;
  onUpdateCloudConfig: (cfg: CloudConfig) => void;
  onApplyCloudSnapshot: (state: PlatformState) => void;
  onImportState: (state: PlatformState) => void;
  onResetDemo: () => void;
}

export function SchoolSettingsTab({
  state,
  currentUser,
  autoSyncStatus,
  voiceLabels,
  onUpdateSettings,
  onUpdateCloudConfig,
  onApplyCloudSnapshot,
  onImportState,
  onResetDemo,
}: SchoolSettingsTabProps) {
  const [schoolName, setSchoolName] = useState(state.schoolName);
  const [teacherName, setTeacherName] = useState(
    currentUser.teacherDisplayName?.trim() ||
      (currentUser.isMasterAdmin ? state.teacherName : '') ||
      currentUser.name,
  );
  const [supaUrl, setSupaUrl] = useState(state.cloudConfig.supabaseUrl);
  const [supaKey, setSupaKey] = useState(state.cloudConfig.supabaseAnonKey);
  const [geminiKey, setGeminiKey] = useState(state.cloudConfig.geminiApiKey);
  const [cloudStatus, setCloudStatus] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const effectiveSupabase = getEffectiveSupabaseConfig(state.cloudConfig);
  const effectiveGemini = getEffectiveGeminiKey(state.cloudConfig.geminiApiKey);
  const embeddedGeminiActive = hasEmbeddedGeminiKey();

  const handleSaveCloudKeys = () => {
    onUpdateCloudConfig({
      supabaseUrl: supaUrl.trim(),
      supabaseAnonKey: supaKey.trim(),
      geminiApiKey: geminiKey.trim(),
      lastSyncedAt: state.cloudConfig.lastSyncedAt,
    });
    setCloudStatus({
      ok: true,
      message: 'Chaves salvas localmente neste navegador!',
    });
  };

  const handleTestCloud = async () => {
    setIsSyncing(true);
    const res = await testSupabaseConnection(supaUrl, supaKey);
    setCloudStatus(res);
    setIsSyncing(false);
  };

  const handlePushCloud = async () => {
    setIsSyncing(true);
    const nextState: PlatformState = {
      ...state,
      cloudConfig: {
        supabaseUrl: supaUrl.trim(),
        supabaseAnonKey: supaKey.trim(),
        geminiApiKey: geminiKey.trim(),
        lastSyncedAt: state.cloudConfig.lastSyncedAt,
      },
    };
    onUpdateCloudConfig(nextState.cloudConfig);
    const res = await pushStateToCloud(nextState);
    if (res.ok && res.syncedAt) {
      onUpdateCloudConfig({
        ...nextState.cloudConfig,
        lastSyncedAt: res.syncedAt,
      });
    }
    setCloudStatus({ ok: res.ok, message: res.message });
    setIsSyncing(false);
  };

  const handlePullCloud = async () => {
    setIsSyncing(true);
    const res = await pullStateFromCloud(supaUrl, supaKey);
    if (res.ok && res.state) {
      const merged = mergePlatformStates(state, res.state, 'remote');
      onApplyCloudSnapshot({
        ...merged,
        cloudConfig: {
          supabaseUrl: supaUrl.trim(),
          supabaseAnonKey: supaKey.trim(),
          geminiApiKey: geminiKey.trim(),
          lastSyncedAt: new Date().toISOString(),
        },
      });
    }
    setCloudStatus({ ok: res.ok, message: res.message });
    setIsSyncing(false);
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setSqlCopied(true);
      window.setTimeout(() => setSqlCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluentbridge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as PlatformState;
        if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.classes)) {
          setImportError('Arquivo JSON inválido para a plataforma FluentBridge v2.');
          return;
        }
        setImportError('');
        onImportState(parsed);
      } catch {
        setImportError('Não foi possível ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Supabase & Gemini */}
      <div className="fb-card-primary space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
            Nuvem (Supabase) &amp; IA (Gemini)
          </h2>
          <button
            type="button"
            onClick={() => void handleCopySql()}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{sqlCopied ? 'SQL Copiado!' : 'Copiar SQL Supabase'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div
            className={`rounded-2xl border p-3 text-xs ${
              effectiveSupabase.url && effectiveSupabase.anonKey
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-extrabold">
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  autoSyncStatus?.state === 'syncing' ? 'animate-spin' : ''
                }`}
              />
              <span>
                {effectiveSupabase.source === 'embedded'
                  ? 'Supabase Fixo Conectado'
                  : effectiveSupabase.source === 'custom'
                    ? 'Supabase Customizado'
                    : 'Supabase Pendente'}
              </span>
            </div>
            <p className="mt-1 text-[11px] opacity-85">
              {autoSyncStatus?.message
                ? autoSyncStatus.message
                : effectiveSupabase.url
                  ? 'Auto-sync em segundo plano ativo entre dispositivos.'
                  : 'Informe URL e Anon Key abaixo (ou peça para fixar no build).'}
            </p>
          </div>

          <div
            className={`rounded-2xl border p-3 text-xs ${
              effectiveGemini
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <p className="font-extrabold">
              {embeddedGeminiActive
                ? 'Gemini Proxy Seguro Ativo'
                : effectiveGemini
                  ? 'Gemini Fallback/Própria Ativa'
                  : 'Tutor Local Ativo (Fallback Pendente)'}
            </p>
            <p className="mt-1 text-[11px] opacity-85">
              {embeddedGeminiActive
                ? 'IA generativa via Cloudflare Worker (chave protegida no servidor).'
                : effectiveGemini
                  ? 'Usando chave salva manualmente abaixo.'
                  : 'Configure uma chave de fallback abaixo se desejar sobrescrever.'}
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Se sua base no Supabase já estiver criada, cole abaixo sua URL e Anon Key para habilitar sincronização automática e login Google/e-mail entre Windows, Android e Web:
        </p>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supabase Project URL</label>
          <input
            value={supaUrl}
            onChange={(e) => setSupaUrl(e.target.value)}
            placeholder={effectiveSupabase.url || 'https://seu-projeto.supabase.co'}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supabase Anon Key</label>
          <input
            type="password"
            value={supaKey}
            onChange={(e) => setSupaKey(e.target.value)}
            placeholder={
              effectiveSupabase.source === 'embedded'
                ? 'Chave fixa já configurada no build (preencha só para sobrescrever)'
                : 'eyJhbGciOi...'
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Google Gemini API Key (Fallback / Chave própria opcional)
          </label>
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder={
              embeddedGeminiActive
                ? 'Chave fixa embutida ativa (digite aqui apenas se quiser substituir)'
                : 'AIzaSy... (chave própria de fallback)'
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveCloudKeys}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Salvar chaves</span>
          </button>
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => void handleTestCloud()}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Testar conexão
          </button>
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => void handlePushCloud()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            <CloudUpload className="h-3.5 w-3.5" />
            <span>Enviar p/ Nuvem</span>
          </button>
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => void handlePullCloud()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
          >
            <CloudDownload className="h-3.5 w-3.5" />
            <span>Baixar da Nuvem</span>
          </button>
        </div>

        {cloudStatus && (
          <p
            className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
              cloudStatus.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {cloudStatus.message}
          </p>
        )}

        {state.cloudConfig.lastSyncedAt && (
          <p className="text-[11px] text-slate-400">
            Última sincronização:{' '}
            {new Date(state.cloudConfig.lastSyncedAt).toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Voice Quality + School Identity & JSON Backup */}
      <div className="space-y-6">
        <div className="fb-card-primary space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Vozes Naturais (🇺🇸 US &amp; 🇬🇧 UK)
            </h2>
            <DualAudioButtons
              text="Welcome back! Let's practice natural English pronunciation together."
              languageCode="en"
              size="xs"
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Vozes neurais <span className="font-semibold">Deepgram Aura-2</span> via Cloudflare Workers AI em todos os dispositivos (PC, Android e Web):
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
            <div className="fb-card-secondary rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="font-bold text-slate-700 dark:text-slate-200">🇺🇸 Inglês Americano</p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {voiceLabels.us}
              </p>
            </div>
            <div className="fb-card-secondary rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="font-bold text-slate-700 dark:text-slate-200">🇬🇧 Inglês Britânico</p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {voiceLabels.uk}
              </p>
            </div>
          </div>
        </div>

        <div className="fb-card-primary space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
            Identidade da Escola / Curso
          </h2>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome do App / Escola</label>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome do Professor</label>
            <input
              data-testid="teacher-display-name-input"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            data-testid="save-teacher-settings-btn"
            onClick={() =>
              onUpdateSettings({
                schoolName: schoolName.trim() || state.schoolName,
                teacherName: teacherName.trim() || currentUser.name,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Salvar alterações</span>
          </button>
        </div>

        <div className="fb-card-primary space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
            Backup Completo (.json)
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Exportar tudo (.json)</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Importar backup (.json)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
          {importError && (
            <p className="text-xs font-semibold text-rose-600">{importError}</p>
          )}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restaurar dados iniciais de demonstração</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
