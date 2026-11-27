import { useState } from 'react';
import { Award, CheckCircle2, Clock, Mic, PenTool, Save, Search } from 'lucide-react';
import { getLanguageCourseMeta, LANGUAGE_COURSES_META } from '../../data/platformDefaults';
import type {
  ClassGroup,
  LanguageCode,
  PronunciationRubric,
  StudentSubmission,
} from '../../types/learning';
import { DualAudioButtons } from '../DualAudioButtons';

const WRITING_BADGES = [
  'Ótima estrutura!',
  'Vocabulário natural!',
  'Excelente progresso!',
  'Gramática precisa!',
];

const SPEAKING_BADGES = [
  'Pronúncia nítida!',
  'Ótima entonação!',
  'Fluência natural!',
  'Ritmo excelente!',
];

interface SubmissionsGradingTabProps {
  submissions: StudentSubmission[];
  classes: ClassGroup[];
  selectedSub: StudentSubmission | undefined;
  loadedAudioUrl: string | null;
  feedbackDraft: string;
  correctedDraft: string;
  badgeDraft: string;
  rubricDraft: PronunciationRubric;
  filterType: 'all' | 'writing' | 'speaking';
  filterClassId: string;
  onChangeFilterType: (val: 'all' | 'writing' | 'speaking') => void;
  onChangeFilterClassId: (val: string) => void;
  onSelectSubmission: (sub: StudentSubmission) => void;
  onChangeFeedback: (val: string) => void;
  onChangeCorrected: (val: string) => void;
  onChangeBadge: (val: string) => void;
  onChangeRubric: (updater: (prev: PronunciationRubric) => PronunciationRubric) => void;
  onGradeSubmission: (
    submissionId: string,
    payload: {
      teacherFeedback: string;
      correctedText: string;
      teacherBadge: string;
      pronunciationRubric?: PronunciationRubric;
    },
  ) => void;
}

export function SubmissionsGradingTab({
  submissions,
  classes,
  selectedSub,
  loadedAudioUrl,
  feedbackDraft,
  correctedDraft,
  badgeDraft,
  rubricDraft,
  filterType,
  filterClassId,
  onChangeFilterType,
  onChangeFilterClassId,
  onSelectSubmission,
  onChangeFeedback,
  onChangeCorrected,
  onChangeBadge,
  onChangeRubric,
  onGradeSubmission,
}: SubmissionsGradingTabProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [filterLang, setFilterLang] = useState<'ALL' | LanguageCode>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getClassName = (classId?: string) =>
    classes.find((c) => c.id === classId)?.name ?? 'Sem turma';

  const visibleSubs = submissions.filter((sub) => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (filterLang !== 'ALL' && (sub.languageCode ?? 'en') !== filterLang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchTopic = sub.topicTitle.toLowerCase().includes(q);
      if (!matchName && !matchTopic) return false;
    }
    return true;
  });

  const activeSub =
    visibleSubs.find((s) => s.id === selectedSub?.id) ?? visibleSubs[0];
  const activeLangName = activeSub
    ? getLanguageCourseMeta(activeSub.languageCode ?? 'en').namePt
    : 'Idioma';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'writing', label: 'Escrita' },
              { id: 'speaking', label: 'Áudio' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChangeFilterType(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filterType === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}

          <span className="mx-1 h-4 w-px bg-slate-200" />

          {(
            [
              { id: 'all', label: 'Todos status' },
              { id: 'pending', label: 'Aguardando' },
              { id: 'reviewed', label: 'Corrigidos' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar aluno ou tópico..."
              className="w-44 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 text-xs"
            />
          </div>

          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value as 'ALL' | LanguageCode)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
            aria-label="Filtrar envios por idioma"
          >
            <option value="ALL">Todos idiomas</option>
            {LANGUAGE_COURSES_META.map((c) => (
              <option key={c.code} value={c.code}>
                {c.namePt}
              </option>
            ))}
          </select>

          <select
            value={filterClassId}
            onChange={(e) => onChangeFilterClassId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
            aria-label="Filtrar envios por turma"
          >
            <option value="ALL">Todas as turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {visibleSubs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              Nenhum envio encontrado neste filtro.
            </div>
          ) : (
            visibleSubs.map((sub) => {
              const active = activeSub?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubmission(sub)}
                  className={`w-full rounded-2xl border p-4 text-left transition cursor-pointer ${
                    active
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-slate-900">
                      {sub.type === 'speaking' ? (
                        <Mic className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <PenTool className="h-3.5 w-3.5 text-amber-600" />
                      )}
                      {sub.studentName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        sub.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sub.status === 'pending' ? (
                        <>
                          <Clock className="h-3 w-3" />
                          Aguardando
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Corrigido
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-blue-700">
                    {sub.topicTitle} · {getClassName(sub.classId)}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-600">
                    “{sub.responseText}”
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sub.createdAt}</span>
                    {sub.type === 'speaking' && sub.audioDurationSec && (
                      <span className="font-mono font-bold text-rose-600">
                        Áudio {sub.audioDurationSec}s
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7">
          {activeSub ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        activeSub.type === 'speaking'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {activeSub.type === 'speaking'
                        ? 'Áudio de Speaking'
                        : 'Produção de Writing'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                      {activeLangName}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {activeSub.studentName}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {activeSub.topicTitle} · {getClassName(activeSub.classId)} ·{' '}
                    {activeSub.createdAt}
                  </p>
                </div>
                {activeSub.teacherBadge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <Award className="h-3.5 w-3.5" />
                    {activeSub.teacherBadge}
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">
                    Proposta do exercício
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-700">
                    {activeSub.promptPt}
                  </p>

                  {activeSub.type === 'speaking' ? (
                    <div className="mt-3 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-rose-700 uppercase">
                          Frase-alvo & Gravação do Aluno
                        </span>
                        {activeSub.autoPronunciationScore !== undefined && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800">
                            Auto-precisão: {activeSub.autoPronunciationScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        “{activeSub.targetSentence ?? activeSub.responseText}”
                      </p>

                      {loadedAudioUrl ? (
                        <audio controls src={loadedAudioUrl} className="h-10 w-full" />
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-white p-3">
                          <span className="text-xs text-slate-600">
                            {activeSub.audioArchived
                              ? 'Áudio removido automaticamente após 60 dias (transcrição, nota e feedback escritos preservados).'
                              : activeSub.audioId
                                ? 'Áudio gravado em outro dispositivo (use o player modelo abaixo).'
                                : 'Áudio demonstrativo · Clique para ouvir a frase:'}
                          </span>
                          <DualAudioButtons
                            text={activeSub.targetSentence ?? activeSub.responseText}
                            languageCode={activeSub.languageCode ?? 'en'}
                            showSlow
                            size="xs"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 text-[11px] font-bold text-slate-400 uppercase">
                        Texto enviado pelo aluno
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        “{activeSub.responseText}”
                      </p>
                    </>
                  )}
                </div>

                {activeSub.type === 'speaking' && (
                  <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4">
                    <p className="text-xs font-extrabold text-rose-900 uppercase">
                      Avaliação de Pronúncia (1 a 5)
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(
                        [
                          { key: 'clarity', label: 'Clareza' },
                          { key: 'intonation', label: 'Entonação' },
                          { key: 'rhythm', label: 'Ritmo' },
                        ] as const
                      ).map(({ key, label }) => (
                        <div key={key} className="rounded-xl bg-white p-2.5 ring-1 ring-rose-100">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{label}</span>
                            <span className="font-mono text-rose-600">
                              {rubricDraft[key]}/5
                            </span>
                          </div>
                          <div className="mt-1.5 flex gap-1">
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                type="button"
                                onClick={() =>
                                  onChangeRubric((prev) => ({
                                    ...prev,
                                    [key]: score,
                                  }))
                                }
                                className={`flex-1 rounded-md py-1 font-mono text-[11px] font-bold transition cursor-pointer ${
                                  rubricDraft[key] >= score
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Feedback e Dica do Professor
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackDraft}
                    onChange={(e) => onChangeFeedback(e.target.value)}
                    placeholder="Escreva elogios, pontos de melhoria e dicas de pronúncia ou gramática..."
                    className="mt-1.5 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {activeSub.type === 'writing' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Versão sugerida / corrigida (em {activeLangName})
                    </label>
                    <textarea
                      rows={2}
                      value={correctedDraft}
                      onChange={(e) => onChangeCorrected(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Selo de reconhecimento
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(activeSub.type === 'speaking'
                      ? SPEAKING_BADGES
                      : WRITING_BADGES
                    ).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onChangeBadge(b)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          badgeDraft === b
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onGradeSubmission(activeSub.id, {
                      teacherFeedback:
                        feedbackDraft.trim() ||
                        (activeSub.type === 'speaking'
                          ? 'Boa articulação! Continue praticando em voz alta todos os dias.'
                          : 'Excelente esforço! Continue praticando diariamente.'),
                      correctedText:
                        activeSub.type === 'writing'
                          ? correctedDraft.trim() || activeSub.responseText
                          : '',
                      teacherBadge: badgeDraft,
                      pronunciationRubric:
                        activeSub.type === 'speaking' ? rubricDraft : undefined,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar correção e publicar para o aluno</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Selecione um envio à esquerda para corrigir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
