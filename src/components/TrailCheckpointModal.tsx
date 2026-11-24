import { CheckCircle2, Clapperboard, Headphones, X } from 'lucide-react';
import type { CEFRLevel, LanguageCode } from '../types/learning';
import { InteractiveVideoView } from './InteractiveVideoView';
import { PodcastImmersionView } from './PodcastImmersionView';

export interface TrailCheckpointTarget {
  id: string;
  kind: 'podcast' | 'video';
  level: CEFRLevel;
  titlePt: string;
  mediaId?: string;
}

interface TrailCheckpointModalProps {
  checkpoint: TrailCheckpointTarget;
  languageCode: LanguageCode;
  alreadyCompleted: boolean;
  onComplete: (checkpointId: string, scorePercent: number) => void;
  onClose: () => void;
}

export function TrailCheckpointModal({
  checkpoint,
  languageCode,
  alreadyCompleted,
  onComplete,
  onClose,
}: TrailCheckpointModalProps) {
  return (
    <div
      data-testid="trail-checkpoint-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              {checkpoint.kind === 'podcast' ? (
                <Headphones className="h-5 w-5" />
              ) : (
                <Clapperboard className="h-5 w-5" />
              )}
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
                Ponto de Verificação · Nível {checkpoint.level}
              </p>
              <h2 className="font-display text-base font-extrabold text-slate-900">
                {checkpoint.titlePt}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {alreadyCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluído
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar ponto de verificação"
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {checkpoint.kind === 'podcast' ? (
            <PodcastImmersionView
              languageCode={languageCode}
              initialEpisodeId={checkpoint.mediaId}
              onCompleteEpisode={(_epId, score) =>
                onComplete(checkpoint.id, score)
              }
            />
          ) : (
            <InteractiveVideoView
              languageCode={languageCode}
              initialClipId={checkpoint.mediaId}
              onCompleteClip={(_clipId, score) =>
                onComplete(checkpoint.id, score)
              }
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-xs text-slate-600">
            Responda às checagens durante o diálogo ou marque como concluído após praticar.
          </p>
          <button
            type="button"
            data-testid="complete-checkpoint-btn"
            onClick={() => {
              onComplete(checkpoint.id, 100);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Concluir Ponto de Verificação (+60 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
