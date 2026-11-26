import { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  BookmarkPlus,
  Check,
  Copy,
  History,
  Languages,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { LanguageCode, LanguageCourse, VocabCard } from '../types/learning';
import {
  getTranslatorLanguagePair,
  loadTranslatorHistory,
  saveTranslatorHistory,
  translateCourseText,
  type TranslationResult,
  type TranslatorRegister,
  type TranslatorVocabToken,
} from '../utils/courseTranslator';
import { DualAudioButtons } from './DualAudioButtons';

interface CourseTranslatorViewProps {
  activeCourse: LanguageCourse;
  courseVocab: VocabCard[];
  onSaveVocabCard?: (card: {
    word: string;
    translation: string;
    ipa: string;
    exampleEn: string;
    examplePt: string;
    languageCode: LanguageCode;
  }) => void;
}

const QUICK_SAMPLE_BY_LANG: Partial<Record<LanguageCode, string>> = {
  pt: 'Good morning! Could you recommend a traditional restaurant nearby?',
  en: 'Gostaria de remarcar nossa reunião para amanhã de manhã, se possível.',
  es: '¿Dónde posso encontrar a estação de metrô mais próxima?',
  fr: 'Eu gostaria de reservar uma mesa para duas pessoas hoje à noite.',
  de: 'Preciso enviar este relatório até o final da tarde.',
  it: 'A comida estava deliciosa, muito obrigado pelo atendimento!',
  ja: 'Com licença, quanto custa o bilhete de ida e volta para Tóquio?',
  zh: 'Prazer em conhecê-lo! Trabalho com tecnologia e educação.',
  ar: 'Olá! Como posso chegar ao centro da cidade a partir daqui?',
  ru: 'Estou aprendendo russo todos os dias para viajar e trabalhar.',
  tr: 'Bom dia! Gostaria de um café turco e a conta, por favor.',
  he: 'Olá! Onde fica a estação de trem mais próxima?',
  nb: 'Hoje o tempo está ótimo para caminhar perto do fiorde.',
  da: 'Você poderia falar um pouco mais devagar, por favor?',
};

export function CourseTranslatorView({
  activeCourse,
  courseVocab,
  onSaveVocabCard,
}: CourseTranslatorViewProps) {
  const pair = getTranslatorLanguagePair(activeCourse.code);
  const [direction, setDirection] = useState<'native-to-target' | 'target-to-native'>(
    'native-to-target',
  );
  const [register, setRegister] = useState<TranslatorRegister>('natural');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<TranslationResult[]>(() => loadTranslatorHistory());
  const [copied, setCopied] = useState(false);
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});

  // Reset current result when switching course so the translator always matches activeCourse
  useEffect(() => {
    setResult(null);
    setError('');
  }, [activeCourse.code]);

  const sourceCode = direction === 'native-to-target' ? pair.nativeCode : pair.targetCode;
  const targetCode = direction === 'native-to-target' ? pair.targetCode : pair.nativeCode;
  const sourceLabel = direction === 'native-to-target' ? pair.nativeLabel : pair.targetLabel;
  const targetLabel = direction === 'native-to-target' ? pair.targetLabel : pair.nativeLabel;

  const isPtCourse = activeCourse.code === 'pt';

  const handleSwap = () => {
    setDirection((prev) =>
      prev === 'native-to-target' ? 'target-to-native' : 'native-to-target',
    );
    if (result?.translatedText) {
      setInputText(result.translatedText);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError(
        isPtCourse
          ? 'Enter a word or sentence to translate.'
          : 'Digite uma palavra ou frase para traduzir.',
      );
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await translateCourseText({
        text: inputText,
        sourceLang: sourceCode,
        targetLang: targetCode,
        courseCode: activeCourse.code,
        register,
        courseVocab,
      });
      setResult(res);
      const nextHist = [res, ...history.filter((h) => h.sourceText !== res.sourceText)].slice(
        0,
        20,
      );
      setHistory(nextHist);
      saveTranslatorHistory(nextHist);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.translatedText || typeof navigator === 'undefined') return;
    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleSaveToken = (tok: TranslatorVocabToken) => {
    if (!onSaveVocabCard) return;
    onSaveVocabCard({
      word: tok.word,
      translation: tok.translation,
      ipa: tok.ipa || `/${tok.word}/`,
      exampleEn: result?.translatedText || tok.word,
      examplePt: result?.sourceText || tok.translation,
      languageCode: activeCourse.code,
    });
    setSavedWords((prev) => ({ ...prev, [tok.word]: true }));
  };

  const audioLangForResult: LanguageCode =
    targetCode === 'pt' || targetCode === 'en' ? targetCode : activeCourse.code;

  return (
    <div data-testid="course-translator-view" className="mx-auto max-w-5xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
                {isPtCourse
                  ? `Translator · ${activeCourse.flag} English ⇄ Português`
                  : `Tradutor do Curso · ${activeCourse.flag} ${activeCourse.namePt}`}
              </h1>
              <p className="text-xs text-slate-500">
                {isPtCourse
                  ? 'Translate naturally between English and Portuguese with IPA, register alternatives & 1-click SM-2 flashcards.'
                  : `Traduza nos dois sentidos (${pair.nativeLabel} ⇄ ${pair.targetLabel}) com pronúncia neural, registro e cards SM-2.`}
              </p>
            </div>
          </div>

          {/* Register pills */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['natural', 'formal', 'informal'] as const).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setRegister(reg)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                  register === reg
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Direction Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
          <span className="text-xs font-extrabold text-slate-800">{sourceLabel}</span>
          <button
            type="button"
            data-testid="translator-swap-btn"
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-2xs transition hover:bg-blue-50 cursor-pointer"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>{isPtCourse ? 'Swap direction' : 'Inverter direção'}</span>
          </button>
          <span className="text-xs font-extrabold text-blue-700">{targetLabel}</span>
        </div>

        {/* Input / Output Split */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Source Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>{sourceLabel}</span>
              <span>{inputText.length}/1200</span>
            </div>
            <textarea
              data-testid="translator-input"
              rows={5}
              maxLength={1200}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isPtCourse
                  ? `Type in ${sourceLabel}...`
                  : `Digite ou cole em ${sourceLabel}...`
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDirection('native-to-target');
                    setInputText(
                      QUICK_SAMPLE_BY_LANG[activeCourse.code] ??
                        'Gostaria de praticar uma conversa natural hoje.',
                    );
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isPtCourse ? 'Sample phrase' : 'Exemplo rápido'}
                </button>
                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setResult(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{isPtCourse ? 'Clear' : 'Limpar'}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                data-testid="translator-submit-btn"
                disabled={loading}
                onClick={() => void handleTranslate()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>
                  {loading
                    ? isPtCourse
                      ? 'Translating...'
                      : 'Traduzindo...'
                    : isPtCourse
                      ? 'Translate'
                      : 'Traduzir'}
                </span>
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>
            )}
          </div>

          {/* Target Output */}
          <div
            data-testid="translator-output"
            className="flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4"
          >
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-blue-700">
                <span>{targetLabel}</span>
                {result && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {result.source === 'gemini-cloud' ? 'IA Neural' : 'Glossário Offline'}
                  </span>
                )}
              </div>

              {result ? (
                <div className="space-y-3">
                  <p
                    dir={targetCode === 'ar' || targetCode === 'he' ? 'rtl' : 'ltr'}
                    className="font-display text-lg font-extrabold leading-relaxed text-slate-900"
                  >
                    {result.translatedText}
                  </p>

                  {result.pronunciationIpa && (
                    <p className="font-mono text-xs text-slate-600">
                      {result.pronunciationIpa}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <DualAudioButtons
                      text={result.translatedText}
                      languageCode={audioLangForResult}
                      showSlow
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => void handleCopy()}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  {result.literalNote && (
                    <p className="rounded-xl border border-blue-200 bg-white/80 p-3 text-xs leading-relaxed text-slate-700">
                      {result.literalNote}
                    </p>
                  )}
                </div>
              ) : (
                <p className="py-10 text-center text-xs text-slate-400">
                  {isPtCourse
                    ? 'The translation, pronunciation audio, and grammar notes will appear here.'
                    : 'A tradução, pronúncia neural e notas de uso aparecerão aqui.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives & Extracted Vocabulary -> SM-2 */}
      {result && (result.alternatives.length > 0 || result.vocabulary.length > 0) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {result.alternatives.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="font-display text-sm font-extrabold text-slate-900">
                {isPtCourse ? 'Register Alternatives' : 'Variações de Registro'}
              </h2>
              <div className="mt-3 space-y-2.5">
                {result.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  >
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-800">
                      {alt.label}
                    </span>
                    <p className="mt-1.5 font-semibold text-slate-900">{alt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.vocabulary.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="font-display text-sm font-extrabold text-slate-900">
                {isPtCourse ? 'Key Vocabulary → SM-2' : 'Vocabulário-Chave → SM-2'}
              </h2>
              <div className="mt-3 space-y-2">
                {result.vocabulary.map((tok, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">
                        {tok.word}{' '}
                        <span className="font-normal text-slate-500">· {tok.translation}</span>
                      </p>
                      {tok.note && (
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">{tok.note}</p>
                      )}
                    </div>
                    {onSaveVocabCard && (
                      <button
                        type="button"
                        data-testid="translator-save-sm2-btn"
                        disabled={Boolean(savedWords[tok.word])}
                        onClick={() => handleSaveToken(tok)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                          savedWords[tok.word]
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        <span>{savedWords[tok.word] ? 'Salva SM-2' : 'Salvar SM-2'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent History */}
      {history.filter((h) => h.courseCode === activeCourse.code).length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-sm font-extrabold text-slate-900">
              <History className="h-4 w-4 text-slate-500" />
              <span>{isPtCourse ? 'Recent Translations' : 'Traduções Recentes'}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setHistory([]);
                saveTranslatorHistory([]);
              }}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              {isPtCourse ? 'Clear history' : 'Limpar histórico'}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {history
              .filter((h) => h.courseCode === activeCourse.code)
              .slice(0, 6)
              .map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setInputText(h.sourceText);
                    setResult(h);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left text-xs transition hover:border-blue-300 cursor-pointer"
                >
                  <p className="truncate font-semibold text-slate-700">{h.sourceText}</p>
                  <p className="mt-0.5 truncate font-bold text-blue-700">{h.translatedText}</p>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
