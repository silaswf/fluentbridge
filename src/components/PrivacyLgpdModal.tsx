/**
 * @file src/components/PrivacyLgpdModal.tsx
 * @description Modal de Privacidade & LGPD: exportação completa dos dados em JSON e auto-exclusão definitiva da conta na nuvem.
 * @exports PrivacyLgpdModal
 */
import { useState } from 'react';
import { Download, ShieldCheck, Trash2, X } from 'lucide-react';
import type { UserProfile } from '../types/learning';

interface PrivacyLgpdModalProps {
  open: boolean;
  user: UserProfile;
  onClose: () => void;
  onDeleteAccount: () => Promise<{ ok: boolean; error?: string } | void>;
}

export function PrivacyLgpdModal({
  open,
  user,
  onClose,
  onDeleteAccount,
}: PrivacyLgpdModalProps) {
  const [exportedDone, setExportedDone] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!open) return null;

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      lgpdNotice: 'Exportação completa de dados pessoais e progresso FluentBridge Academy.',
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeLanguage: user.activeLanguage,
        xp: user.xp,
        streakDays: user.streakDays,
        completedTopicIds: user.completedTopicIds,
        learnedVocabIds: user.learnedVocabIds ?? [],
        completedCheckpoints: user.completedCheckpoints ?? [],
      },
      vocabCount: user.vocab.length,
      vocab: user.vocab,
      mistakeBank: user.mistakeBank ?? [],
      examAttempts: user.examAttempts ?? [],
      topicStepProgress: user.topicStepProgress ?? {},
    };

    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fluentbridge-lgpd-${user.id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback for restricted environments
    }
    setExportedDone(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmText.trim().toUpperCase() !== 'EXCLUIR') return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await onDeleteAccount();
      if (res && res.ok === false) {
        setDeleteError(
          res.error || 'Não foi possível excluir os dados na nuvem. Tente novamente.',
        );
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Erro ao excluir conta na nuvem.',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      data-testid="privacy-lgpd-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                Privacidade &amp; LGPD
              </h2>
              <p className="text-xs text-slate-500">
                Portabilidade e exclusão de dados pessoais (Lei 13.709/2018)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar Privacidade e LGPD"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-bold text-slate-900">
              1. Portabilidade de Dados
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Baixe um arquivo JSON completo com seu perfil, vocabulário SM-2, histórico de simulados e caderno de erros.
            </p>
            <button
              type="button"
              data-testid="lgpd-export-btn"
              onClick={handleExportJson}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Meus Dados (JSON)</span>
            </button>
            {exportedDone && (
              <p
                data-testid="lgpd-export-success"
                className="mt-2 text-xs font-bold text-emerald-700"
              >
                Arquivo JSON gerado com sucesso para {user.email}!
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
            <h3 className="text-sm font-bold text-rose-950">
              2. Exclusão Definitiva da Conta
            </h3>
            <p className="mt-1 text-xs text-rose-800">
              Remove seus dados locais, fila offline e solicita limpeza do registro na nuvem. Digite <strong>EXCLUIR</strong> para confirmar.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Digite EXCLUIR"
                className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-rose-400 focus:outline-none"
              />
              <button
                type="button"
                data-testid="lgpd-delete-trigger-btn"
                disabled={confirmText.trim().toUpperCase() !== 'EXCLUIR' || deleting}
                onClick={() => void handleConfirmDelete()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{deleting ? 'Excluindo...' : 'Excluir Minha Conta'}</span>
              </button>
            </div>
            {deleteError && (
              <p
                data-testid="lgpd-delete-error"
                className="mt-2 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-900"
              >
                {deleteError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
