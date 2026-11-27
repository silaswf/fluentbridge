/**
 * @file src/components/steps/VocabIntroStep.tsx
 * @description Renderiza etapa inicial de vocabulário da unidade com IPA, exemplos, áudio e marcação de estudo.
 * @exports VocabIntroStep
 */
import { Check, RefreshCw, Sparkles } from 'lucide-react';
import type { LanguageCode, VocabCard } from '../../types/learning';
import { extractScriptCharsFromWord } from '../../data/scriptTrainerData';
import { resolveVisualConceptId } from '../../data/visualConcepts';
import { toJapaneseKana, type JapaneseScriptMode } from '../../utils/japaneseKana';
import { ConceptIllustration } from '../ConceptIllustration';
import { DualAudioButtons } from '../DualAudioButtons';
import { ScriptStrokeTrainer } from '../ScriptStrokeTrainer';

interface VocabIntroStepProps {
  cards: VocabCard[];
  topicLanguageCode?: LanguageCode;
  jaScriptMode?: JapaneseScriptMode;
  studiedVocabIds: string[];
  expandedTraceCardId: string | null;
  onMarkStudied: (cardId: string) => void;
  onMarkAllStudied: () => void;
  onToggleTraceCard: (cardId: string) => void;
}

export function VocabIntroStep({
  cards,
  topicLanguageCode,
  jaScriptMode = 'standard',
  studiedVocabIds,
  expandedTraceCardId,
  onMarkStudied,
  onMarkAllStudied,
  onToggleTraceCard,
}: VocabIntroStepProps) {
  return (
    <div className="animate-fade-up rounded-3xl border border-cyan-200/90 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
          <Sparkles className="h-3.5 w-3.5" />
          Etapa 1 · Vocabulário da Unidade ({cards.length}{' '}
          {cards.length === 1 ? 'palavra' : 'palavras'})
        </span>
        <button
          type="button"
          onClick={onMarkAllStudied}
          className="text-xs font-bold text-cyan-700 hover:underline cursor-pointer"
        >
          Marcar todas como estudadas
        </button>
      </div>

      <h2 className="mt-3 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
        Palavras-chave com áudio e frase de exemplo
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Ouça cada expressão e sua frase real de uso. Ao avançar, essas palavras entram automaticamente na sua aba de <strong>Revisão (SRS)</strong>!
      </p>

      <div className="mt-5 space-y-3">
        {cards.map((card) => {
          const isStudied = studiedVocabIds.includes(card.id);
          const lang = card.languageCode ?? topicLanguageCode ?? 'en';
          const conceptId =
            card.visualConceptId ||
            resolveVisualConceptId(card.word, card.translation, card.category);
          return (
            <div
              key={card.id}
              className={`rounded-2xl border p-4 transition ${
                isStudied
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ConceptIllustration
                    conceptId={conceptId}
                    imageUrl={card.imageUrl}
                    alt={card.word}
                    size="sm"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-extrabold text-slate-900">
                      {lang === 'ja' && jaScriptMode === 'kana'
                        ? toJapaneseKana(card.word)
                        : card.word}
                    </span>
                    {card.ipa && (
                      <span className="font-mono text-xs text-slate-500">
                        {card.ipa}
                      </span>
                    )}
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                      {card.category}
                    </span>
                    {card.isRecycled && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200"
                        title={
                          card.recycledFromTitle
                            ? `Conectado com: ${card.recycledFromTitle}`
                            : 'Revisão espiral de unidade anterior'
                        }
                      >
                        <RefreshCw className="h-2.5 w-2.5" />
                        Revisão Espiral
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    {card.translation}
                  </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DualAudioButtons
                    text={card.word}
                    languageCode={lang}
                    size="xs"
                  />
                  <button
                    type="button"
                    onClick={() => onMarkStudied(card.id)}
                    className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isStudied
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isStudied ? 'Aprendida' : 'Marcar'}</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900">
                    “{card.exampleEn}”
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    {card.examplePt}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(lang === 'ja' || lang === 'zh' || lang === 'ru' || lang === 'ar') &&
                    extractScriptCharsFromWord(card.word, lang).length > 0 && (
                      <button
                        type="button"
                        onClick={() => onToggleTraceCard(card.id)}
                        className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-bold text-cyan-800 hover:bg-cyan-100 cursor-pointer"
                      >
                        ✍️ {expandedTraceCardId === card.id ? 'Fechar' : 'Traços'}
                      </button>
                    )}
                  <DualAudioButtons
                    text={card.exampleEn}
                    languageCode={lang}
                    size="xs"
                  />
                </div>
              </div>

              {expandedTraceCardId === card.id &&
                (lang === 'ja' || lang === 'zh' || lang === 'ru' || lang === 'ar') && (
                  <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50/30 p-3">
                    <ScriptStrokeTrainer
                      languageCode={lang}
                      initialChars={extractScriptCharsFromWord(card.word, lang)}
                      compact
                    />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
