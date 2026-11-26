import { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Cloud,
  GraduationCap,
  Mic,
  PenTool,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
  Crown,
  ShieldCheck,
} from 'lucide-react';
import type {
  UserProfile,
  CEFRLevel,
  ClassGroup,
  CloudConfig,
  LanguageCode,
  PlatformState,
  PronunciationRubric,
  StudentSubmission,
  TeacherAssignment,
  TipCategory,
  Topic,
} from '../types/learning';
import { getAudioClip } from '../utils/audioDb';
import { resolveSubmissionAudioUrl } from '../utils/cloudSync';
import { getSelectedVoiceLabels } from '../utils/speech';
import { ConfirmDialog } from './ConfirmDialog';
import { DualAudioButtons } from './DualAudioButtons';
import { SchoolSettingsTab } from './teacher/SchoolSettingsTab';
import { VipStudentsPanel } from './teacher/VipStudentsPanel';
import { downloadPedagogicalReportPdf } from '../utils/pedagogicalReportPdf';
import { getLanguageCourseMeta } from '../data/platformDefaults';
import {
  DEFAULT_BACKEND_API_URL,
  DEFAULT_TEACHER_ACCESS_CODE,
  isMasterAdminEmail,
  MASTER_ADMIN_EMAIL,
} from '../config/appConfig';

export type TeacherTab = 'corrections' | 'classes' | 'create' | 'cloud';

interface TeacherStudioProps {
  state: PlatformState;
  initialTab?: TeacherTab;
  currentUser: UserProfile;
  autoSyncStatus?: {
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
    updatedAt?: string;
  };
  onGradeSubmission: (
    submissionId: string,
    payload: {
      teacherFeedback: string;
      correctedText: string;
      teacherBadge: string;
      pronunciationRubric?: PronunciationRubric;
    },
  ) => void;
  onCreateClass: (payload: {
    name: string;
    level: CEFRLevel;
    schedule: string;
    description: string;
  }) => void;
  onDeleteClass: (classId: string) => void;
  onIssueCertificateToStudent: (studentId: string, level: CEFRLevel) => void;
  onAddCustomTopic: (topic: Topic) => void;
  onDeleteCustomTopic: (topicId: string) => void;
  onUpdateSettings: (payload: {
    schoolName: string;
    teacherName: string;
  }) => void;
  onUpdateCloudConfig: (cloudConfig: CloudConfig) => void;
  onApplyCloudSnapshot: (snapshot: Partial<PlatformState>) => void;
  onImportState: (imported: PlatformState) => void;
  onResetDemo: () => void;
  onPlayTopic: (topic: Topic) => void;
  onToggleUserRole: (userId: string) => void;
  onMoveUserClass: (userId: string, classId?: string) => void;
  onDeleteUser: (userId: string) => void;
  onLinkStudentToTeacher?: (studentId: string, teacherId: string) => void;
  onUnlinkStudentFromTeacher?: (studentId: string) => void;
  onCreateAssignment?: (payload: {
    title: string;
    description: string;
    classId?: string;
    studentId?: string;
    languageCode: LanguageCode;
    topicId?: string;
    dueDate: string;
  }) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
}

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

export function TeacherStudio({
  state,
  currentUser,
  autoSyncStatus,
  initialTab = 'corrections',
  onGradeSubmission,
  onCreateClass,
  onDeleteClass,
  onIssueCertificateToStudent,
  onAddCustomTopic,
  onDeleteCustomTopic,
  onUpdateSettings,
  onUpdateCloudConfig,
  onApplyCloudSnapshot,
  onImportState,
  onResetDemo,
  onPlayTopic,
  onToggleUserRole,
  onMoveUserClass,
  onDeleteUser,
  onLinkStudentToTeacher,
  onUnlinkStudentFromTeacher,
  onCreateAssignment,
  onDeleteAssignment,
}: TeacherStudioProps) {
  const isMaster =
    Boolean(currentUser.isMasterAdmin) || isMasterAdminEmail(currentUser.email);
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    description: string;
    warningBox?: string;
    confirmLabel: string;
    tone: 'danger' | 'warning' | 'primary';
    action: () => void;
  } | null>(null);
  const [tab, setTab] = useState<TeacherTab>(initialTab);
  const [voiceLabels, setVoiceLabels] = useState(() => getSelectedVoiceLabels());

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const refreshVoices = () => setVoiceLabels(getSelectedVoiceLabels());
    refreshVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
      return () => {
        window.speechSynthesis.removeEventListener?.(
          'voiceschanged',
          refreshVoices,
        );
      };
    }
    return undefined;
  }, []);

  // Corrections filters & selection
  const [filterType, setFilterType] = useState<'all' | 'writing' | 'speaking'>('all');
  const [filterClassId, setFilterClassId] = useState<string>('ALL');
  const [selectedSubId, setSelectedSubId] = useState<string>(
    state.submissions[0]?.id ?? '',
  );

  const filteredSubs = state.submissions.filter((sub) => {
    if (!isMaster) {
      const subStu = state.users.find((u) => u.id === sub.studentId);
      const subCls = state.classes.find((c) => c.id === sub.classId);
      const hasExplicitOwner = Boolean(
        sub.teacherId || subStu?.assignedTeacherId || subCls?.teacherId,
      );
      const belongsToMe =
        sub.teacherId === currentUser.id ||
        subStu?.assignedTeacherId === currentUser.id ||
        subCls?.teacherId === currentUser.id;
      if (hasExplicitOwner && !belongsToMe) return false;
    }
    if (filterType !== 'all' && sub.type !== filterType) return false;
    if (filterClassId !== 'ALL' && sub.classId !== filterClassId) return false;
    return true;
  });

  const selectedSub: StudentSubmission | undefined =
    filteredSubs.find((s) => s.id === selectedSubId) ?? filteredSubs[0];

  const [feedbackDraft, setFeedbackDraft] = useState<string>(
    selectedSub?.teacherFeedback ?? '',
  );
  const [correctedDraft, setCorrectedDraft] = useState<string>(
    selectedSub?.correctedText ?? selectedSub?.responseText ?? '',
  );
  const [badgeDraft, setBadgeDraft] = useState<string>(
    selectedSub?.teacherBadge ??
      (selectedSub?.type === 'speaking' ? SPEAKING_BADGES[0] : WRITING_BADGES[0]),
  );
  const [rubricDraft, setRubricDraft] = useState<PronunciationRubric>(
    selectedSub?.pronunciationRubric ?? { clarity: 4, intonation: 4, rhythm: 4 },
  );
  const [loadedAudioUrl, setLoadedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;
    setLoadedAudioUrl(null);

    if (selectedSub?.type === 'speaking') {
      const loadAudio = async () => {
        if (selectedSub.audioId) {
          const blob = await getAudioClip(selectedSub.audioId);
          if (!active) return;
          if (blob) {
            createdUrl = URL.createObjectURL(blob);
            setLoadedAudioUrl(createdUrl);
            return;
          }
        }
        const remoteUrl = resolveSubmissionAudioUrl(
          selectedSub,
          state.cloudConfig,
        );
        if (active && remoteUrl) {
          setLoadedAudioUrl(remoteUrl);
        }
      };
      void loadAudio();
    }

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [
    selectedSub?.id,
    selectedSub?.audioId,
    selectedSub?.audioPath,
    selectedSub?.audioDataUrl,
    selectedSub?.type,
    state.cloudConfig,
  ]);

  const handleSelectSubmission = (sub: StudentSubmission) => {
    setSelectedSubId(sub.id);
    setFeedbackDraft(sub.teacherFeedback ?? '');
    setCorrectedDraft(sub.correctedText ?? sub.responseText);
    setBadgeDraft(
      sub.teacherBadge ??
        (sub.type === 'speaking' ? SPEAKING_BADGES[0] : WRITING_BADGES[0]),
    );
    setRubricDraft(
      sub.pronunciationRubric ?? { clarity: 4, intonation: 4, rhythm: 4 },
    );
  };

  // Classes tab state
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<CEFRLevel>('A2');
  const [newClassSchedule, setNewClassSchedule] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [certTargetLevel, setCertTargetLevel] = useState<Record<string, CEFRLevel>>({});

  // Phase 8 Assignments & AI Topic Generator state
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignClassId, setAssignClassId] = useState('');
  const [assignLang, setAssignLang] = useState<LanguageCode>('en');
  const [assignDueDate, setAssignDueDate] = useState(() =>
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [aiTopicIdea, setAiTopicIdea] = useState('');
  const [isGeneratingAiTopic, setIsGeneratingAiTopic] = useState(false);

  // Create Topic Form State
  const [topicLanguage, setTopicLanguage] = useState<LanguageCode>('en');
  const [titlePt, setTitlePt] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [tipCategory, setTipCategory] = useState<TipCategory>('grammar');
  const [tipTitle, setTipTitle] = useState('');
  const [tipSummary, setTipSummary] = useState('');
  const [tipDetails, setTipDetails] = useState('');
  const [tipExampleEn, setTipExampleEn] = useState('');
  const [tipExamplePt, setTipExamplePt] = useState('');

  const [listenAudio, setListenAudio] = useState('');
  const [listenQuestion, setListenQuestion] = useState('');
  const [listenRight, setListenRight] = useState('');
  const [listenWrong, setListenWrong] = useState('');

  const [readText, setReadText] = useState('');
  const [readQuestion, setReadQuestion] = useState('');
  const [readRight, setReadRight] = useState('');
  const [readWrong, setReadWrong] = useState('');

  const [speakSentence, setSpeakSentence] = useState('');
  const [speakTranslation, setSpeakTranslation] = useState('');
  const [speakHint, setSpeakHint] = useState('');

  const [writePrompt, setWritePrompt] = useState('');
  const [writeModel, setWriteModel] = useState('');

  // Teacher link modal / actions state

  const handlePrefillSampleTopic = () => {
    setTitlePt('Negócios & Networking Internacional');
    setTitleEn('International Networking');
    setSubtitle('Apresente sua empresa, faça perguntas inteligentes e troque contatos.');
    setLevel('B1');
    setTipCategory('culture');
    setTipTitle('Small talk que gera conexão real');
    setTipSummary('Evite perguntas fechadas (sim/não). Pergunte "What brought you to..."');
    setTipDetails(
      'Em conferências ou cafés corporativos, perguntas abertas convidam o outro a contar histórias e destravam a conversa naturalmente.',
    );
    setTipExampleEn('What brought you to this year’s conference?');
    setTipExamplePt('O que trouxe você para a conferência deste ano?');
    setListenAudio(
      "Hi! I'm Laura from Lisbon. Currently I lead customer partnerships at a clean-tech startup. What kind of projects is your team focusing on?",
    );
    setListenQuestion('Qual é o cargo atual da Laura?');
    setListenRight('Ela lidera parcerias com clientes em uma startup de tecnologia limpa.');
    setListenWrong('Ela é estudante de medicina em Londres.');
    setReadText(
      'Hi David! Great meeting you at the panel earlier. As promised, here is the link to our case study. Let us touch base next Tuesday for a quick 15-minute call.',
    );
    setReadQuestion('O que a mensagem propõe para a próxima terça-feira?');
    setReadRight('Uma ligação rápida de 15 minutos para manter contato.');
    setReadWrong('Cancelar a parceria atual.');
    setSpeakSentence("It was great connecting—let's touch base next week!");
    setSpeakTranslation('Foi ótimo conectar com você — vamos conversar na semana que vem!');
    setSpeakHint('Pronuncie "touch base" com clareza ("tâtch bêis").');
    setWritePrompt('Escreva uma mensagem curta de follow-up após conhecer alguém em um evento.');
    setWriteModel(
      'Hi Alex! It was great meeting you at the workshop today. Let us stay in touch on LinkedIn!',
    );
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titlePt.trim() || !speakSentence.trim() || !listenAudio.trim() || !readText.trim()) {
      return;
    }

    const id = `custom-${Date.now()}`;
    const newTopic: Topic = {
      id,
      languageCode: topicLanguage,
      titlePt: titlePt.trim(),
      titleEn: titleEn.trim() || titlePt.trim(),
      subtitle:
        subtitle.trim() ||
        'Lição personalizada criada pelo professor com as 4 habilidades.',
      level,
      estimatedMinutes: 8,
      icon: 'Sparkles',
      color: '#7C3AED',
      isCustom: true,
      topicTipsSummary: [tipTitle.trim() || 'Dica exclusiva do professor'],
      steps: [
        {
          id: `${id}-tip`,
          type: 'tip',
          tip: {
            id: `${id}-tip-content`,
            category: tipCategory,
            title: tipTitle.trim() || 'Dica do Professor',
            summary: tipSummary.trim() || 'Ponto de atenção para este tópico.',
            details:
              tipDetails.trim() ||
              'Revise o exemplo abaixo em voz alta para memorizar a estrutura.',
            examples: [
              {
                en: tipExampleEn.trim() || speakSentence.trim(),
                pt: tipExamplePt.trim() || speakTranslation.trim() || 'Exemplo prático.',
              },
            ],
          },
        },
        {
          id: `${id}-listen`,
          type: 'listening',
          speakerLabel: `Áudio do Professor · ${state.teacherName}`,
          contextPt: 'Ouça o áudio com atenção e escolha a resposta correta.',
          audioText: listenAudio.trim(),
          question: listenQuestion.trim() || 'O que foi informado no áudio?',
          options: [
            listenRight.trim() || 'A informação principal dita no áudio.',
            listenWrong.trim() || 'Uma informação diferente do áudio.',
          ],
          correctIndex: 0,
          explanation: `No áudio ouvimos: "${listenAudio.trim()}".`,
          hintTip: 'Use a velocidade 0.75x se precisar captar cada palavra.',
        },
        {
          id: `${id}-read`,
          type: 'reading',
          title: 'Leitura Guiada',
          format: 'article',
          text: readText.trim(),
          glossary: [],
          question: readQuestion.trim() || 'Qual é a ideia principal do texto?',
          options: [
            readRight.trim() || 'Ideia principal confirmada pelo texto.',
            readWrong.trim() || 'Afirmação incorreta sobre o texto.',
          ],
          correctIndex: 0,
          explanation: 'Confira o trecho principal do texto acima.',
          hintTip: 'Você pode clicar em "Ouvir texto" para treinar leitura + áudio juntos.',
        },
        {
          id: `${id}-speak`,
          type: 'speaking',
          promptPt: 'Pratique esta frase-chave em voz alta:',
          targetSentence: speakSentence.trim(),
          translationPt: speakTranslation.trim() || 'Pratique a pronúncia natural.',
          ipa: '/prática guiada/',
          brPhoneticHint: speakHint.trim() || 'Fale pausadamente mantendo o ritmo.',
          focusTip: speakHint.trim() || 'Foque na clareza das palavras principais.',
        },
        {
          id: `${id}-write`,
          type: 'writing_free',
          promptPt: writePrompt.trim() || 'Escreva 1 ou 2 frases sobre este tema.',
          scenarioPt: 'Sua resposta poderá ser enviada diretamente para correção do professor.',
          minWords: 6,
          checklist: [{ label: 'Pelo menos 6 palavras em inglês', keywords: [' '] }],
          modelAnswer: writeModel.trim() || speakSentence.trim(),
          hintTip: 'Use a estrutura da dica inicial para montar sua frase.',
        },
      ],
    };

    onAddCustomTopic(newTopic);
    setTitlePt('');
    setTitleEn('');
    setSubtitle('');
    setTipTitle('');
    setTipSummary('');
    setTipDetails('');
    setTipExampleEn('');
    setTipExamplePt('');
    setListenAudio('');
    setListenQuestion('');
    setListenRight('');
    setListenWrong('');
    setReadText('');
    setReadQuestion('');
    setReadRight('');
    setReadWrong('');
    setSpeakSentence('');
    setSpeakTranslation('');
    setSpeakHint('');
    setWritePrompt('');
    setWriteModel('');
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    onCreateClass({
      name: newClassName.trim(),
      level: newClassLevel,
      schedule: newClassSchedule.trim() || 'Horário flexível',
      description:
        newClassDesc.trim() || 'Turma de acompanhamento das 4 habilidades.',
    });
    setNewClassName('');
    setNewClassSchedule('');
    setNewClassDesc('');
  };

  const pendingCount = state.submissions.filter((s) => s.status === 'pending').length;
  const students = state.users.filter((u) => u.role === 'student');

  const getClassName = (classId?: string) =>
    state.classes.find((c) => c.id === classId)?.name ?? 'Sem turma';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-200">
            <GraduationCap className="h-3.5 w-3.5" />
            Painel de Gestão, Correção & Nuvem
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Modo Professor
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Corrija textos e áudios de Speaking, gerencie turmas e certificados, crie unidades e sincronize com Supabase/Gemini.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setTab('corrections')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'corrections'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Correções ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('classes')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'classes'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Turmas ({state.classes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Criar Tópico</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('cloud')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'cloud'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Cloud className="h-4 w-4" />
            <span>Nuvem, IA & Escola</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CORRECTIONS (WRITING + SPEAKING AUDIO) */}
      {tab === 'corrections' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'all', label: 'Todos os envios' },
                  { id: 'writing', label: 'Escrita (Writing)' },
                  { id: 'speaking', label: 'Áudio (Speaking)' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    filterType === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Todas as turmas</option>
              {state.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              {filteredSubs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                  Nenhum envio encontrado neste filtro.
                </div>
              ) : (
                filteredSubs.map((sub) => {
                  const active = selectedSub?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelectSubmission(sub)}
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
              {selectedSub ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            selectedSub.type === 'speaking'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {selectedSub.type === 'speaking'
                            ? 'Áudio de Speaking'
                            : 'Produção de Writing'}
                        </span>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          {selectedSub.studentName}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {selectedSub.topicTitle} · {getClassName(selectedSub.classId)} ·{' '}
                        {selectedSub.createdAt}
                      </p>
                    </div>
                    {selectedSub.teacherBadge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                        <Award className="h-3.5 w-3.5" />
                        {selectedSub.teacherBadge}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        Proposta do exercício
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-slate-700">
                        {selectedSub.promptPt}
                      </p>

                      {selectedSub.type === 'speaking' ? (
                        <div className="mt-3 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-rose-700 uppercase">
                              Frase-alvo & Gravação do Aluno
                            </span>
                            {selectedSub.autoPronunciationScore !== undefined && (
                              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-800">
                                Auto-precisão: {selectedSub.autoPronunciationScore}%
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            “{selectedSub.targetSentence ?? selectedSub.responseText}”
                          </p>

                          {loadedAudioUrl ? (
                            <audio controls src={loadedAudioUrl} className="h-10 w-full" />
                          ) : (
                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-white p-3">
                              <span className="text-xs text-slate-600">
                                {selectedSub.audioArchived
                                  ? 'Áudio removido automaticamente após 60 dias (transcrição, nota e feedback escritos preservados).'
                                  : selectedSub.audioId
                                    ? 'Áudio gravado em outro dispositivo (use o player modelo abaixo).'
                                    : 'Áudio demonstrativo · Clique para ouvir a frase:'}
                              </span>
                              <DualAudioButtons
                                text={
                                  selectedSub.targetSentence ??
                                  selectedSub.responseText
                                }
                                languageCode={selectedSub.languageCode ?? 'en'}
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
                            “{selectedSub.responseText}”
                          </p>
                        </>
                      )}
                    </div>

                    {/* Pronunciation Rubric for Speaking */}
                    {selectedSub.type === 'speaking' && (
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
                                      setRubricDraft((prev) => ({
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
                        Feedback e Dica do Professor (em português)
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackDraft}
                        onChange={(e) => setFeedbackDraft(e.target.value)}
                        placeholder="Escreva elogios, pontos de melhoria e dicas de pronúncia ou gramática..."
                        className="mt-1.5 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>

                    {selectedSub.type === 'writing' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700">
                          Versão sugerida / corrigida (em inglês)
                        </label>
                        <textarea
                          rows={2}
                          value={correctedDraft}
                          onChange={(e) => setCorrectedDraft(e.target.value)}
                          className="mt-1.5 w-full rounded-2xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Selo de reconhecimento
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(selectedSub.type === 'speaking'
                          ? SPEAKING_BADGES
                          : WRITING_BADGES
                        ).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBadgeDraft(b)}
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
                        onGradeSubmission(selectedSub.id, {
                          teacherFeedback:
                            feedbackDraft.trim() ||
                            (selectedSub.type === 'speaking'
                              ? 'Boa articulação! Continue praticando em voz alta todos os dias.'
                              : 'Excelente esforço! Continue praticando diariamente.'),
                          correctedText:
                            selectedSub.type === 'writing'
                              ? correctedDraft.trim() || selectedSub.responseText
                              : '',
                          teacherBadge: badgeDraft,
                          pronunciationRubric:
                            selectedSub.type === 'speaking' ? rubricDraft : undefined,
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
      )}

      {/* TAB 2: CLASSES, STUDENTS & CERTIFICATES */}
      {tab === 'classes' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Create New Class + Assignments + School Analytics */}
          <div className="space-y-4 lg:col-span-4 lg:self-start">
          <form
            onSubmit={handleCreateClassSubmit}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Nova Turma
            </h2>
            <div>
              <label className="text-xs font-bold text-slate-700">Nome da Turma *</label>
              <input
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ex: Turma A2 · Terça Noite"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Nível</label>
                <select
                  value={newClassLevel}
                  onChange={(e) => setNewClassLevel(e.target.value as CEFRLevel)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Horário</label>
                <input
                  value={newClassSchedule}
                  onChange={(e) => setNewClassSchedule(e.target.value)}
                  placeholder="Ter/Qui 19h"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Descrição</label>
              <textarea
                rows={2}
                value={newClassDesc}
                onChange={(e) => setNewClassDesc(e.target.value)}
                placeholder="Objetivos e foco da turma..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Criar turma e gerar código</span>
            </button>
          </form>

          {/* Phase 8: School Skill Analytics */}
          {students.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-display text-sm font-extrabold text-slate-900">
                Analytics Médio da Escola
              </h3>
              {(['listening', 'reading', 'speaking', 'writing'] as const).map((sk) => {
                const avg = Math.round(
                  students.reduce((acc, s) => acc + (s.skillScores[sk] ?? 50), 0) /
                    students.length,
                );
                return (
                  <div key={sk} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="capitalize">{sk}</span>
                      <span className="font-mono">{avg}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-center">
                <div>
                  <p className="font-mono text-base font-extrabold text-indigo-800">
                    {students.reduce((acc, s) => acc + (s.completedTopicIds?.length ?? 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-700">Unid. Concluídas</p>
                </div>
                <div>
                  <p className="font-mono text-base font-extrabold text-emerald-700">
                    {students.reduce((acc, s) => acc + (s.examAttempts?.length ?? 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-700">Simulados Feitos</p>
                </div>
                <div>
                  <p className="font-mono text-base font-extrabold text-amber-700">
                    {students.filter((s) => (s.streakDays ?? 0) >= 3).length}/{students.length}
                  </p>
                  <p className="text-[10px] font-bold text-amber-700">Ativos (3d+)</p>
                </div>
              </div>
            </div>
          )}

          {/* Phase 8: Assignments */}
          {onCreateAssignment && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-display text-sm font-extrabold text-slate-900">
                Nova Tarefa de Casa
              </h3>
              <input
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="Título (ex: Completar Unidade A1-2)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
              <input
                value={assignDesc}
                onChange={(e) => setAssignDesc(e.target.value)}
                placeholder="Instrução rápida para a turma..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={assignLang}
                  onChange={(e) => setAssignLang(e.target.value as LanguageCode)}
                  className="rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                >
                  <option value="en">Inglês</option>
                  <option value="es">Espanhol</option>
                  <option value="fr">Francês</option>
                  <option value="it">Italiano</option>
                  <option value="de">Alemão</option>
                </select>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                />
              </div>
              <select
                value={assignClassId}
                onChange={(e) => setAssignClassId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
              >
                <option value="">Todas as turmas</option>
                {state.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!assignTitle.trim()) return;
                  onCreateAssignment({
                    title: assignTitle.trim(),
                    description: assignDesc.trim(),
                    classId: assignClassId || undefined,
                    languageCode: assignLang,
                    dueDate: assignDueDate,
                  });
                  setAssignTitle('');
                  setAssignDesc('');
                }}
                className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Publicar tarefa
              </button>

              {(state.assignments ?? []).length > 0 && (
                <div className="space-y-1.5 border-t border-slate-100 pt-2">
                  {(state.assignments ?? []).slice(0, 4).map((a: TeacherAssignment) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]"
                    >
                      <span className="truncate font-semibold text-slate-800">
                        {a.title} ({a.dueDate})
                      </span>
                      {onDeleteAssignment && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Remover tarefa "${a.title}"?`,
                              description:
                                'A tarefa deixará de aparecer na trilha dos alunos.',
                              confirmLabel: 'Remover tarefa',
                              tone: 'danger',
                              action: () => onDeleteAssignment(a.id),
                            })
                          }
                          className="text-rose-600 hover:underline cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>

          {/* Existing Classes & Students */}
          <div className="space-y-4 lg:col-span-8">
            <h2 className="font-display text-sm font-bold tracking-wide text-slate-500 uppercase">
              Turmas Ativas ({state.classes.length}) & Alunos ({students.length})
            </h2>

            {state.classes.map((cls: ClassGroup) => {
              const enrolled = students.filter((s) => s.classId === cls.id);
              return (
                <div
                  key={cls.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700">
                          {cls.level}
                        </span>
                        <h3 className="font-display text-base font-extrabold text-slate-900">
                          {cls.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {cls.schedule} · {cls.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                        Código: {cls.code}
                      </span>
                      {state.classes.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Excluir turma "${cls.name}"?`,
                              description: `Os alunos matriculados em ${cls.name} ficarão sem turma vinculada.`,
                              warningBox:
                                'Esta ação remove o código da turma. Alunos que não tiverem professor VIP vinculado passarão para o modo autônomo.',
                              confirmLabel: 'Excluir turma',
                              tone: 'danger',
                              action: () => onDeleteClass(cls.id),
                            })
                          }
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          aria-label={`Excluir turma ${cls.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {enrolled.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-400">
                      Nenhum aluno nesta turma ainda. Compartilhe o código{' '}
                      <strong className="font-mono text-slate-600">{cls.code}</strong> no cadastro!
                    </p>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {enrolled.map((stu) => {
                        const chosenLvl = certTargetLevel[stu.id] ?? cls.level;
                        const alreadyHas = stu.issuedCertificates.some(
                          (c) => c.level === chosenLvl,
                        );
                        return (
                          <div
                            key={stu.id}
                            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                                  style={{ backgroundColor: stu.avatarColor }}
                                >
                                  {stu.name.slice(0, 2).toUpperCase()}
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">
                                    {stu.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {stu.xp} XP · {stu.completedTopicIds.length} unid. concluídas
                                  </p>
                                </div>
                              </div>
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                                {stu.issuedCertificates.length} cert.
                              </span>
                            </div>

                            <div className="mt-2.5 grid grid-cols-4 gap-1 text-center font-mono text-[10px] font-semibold text-slate-600">
                              <span className="rounded bg-white py-1">L:{stu.skillScores.listening}%</span>
                              <span className="rounded bg-white py-1">R:{stu.skillScores.reading}%</span>
                              <span className="rounded bg-white py-1">S:{stu.skillScores.speaking}%</span>
                              <span className="rounded bg-white py-1">W:{stu.skillScores.writing}%</span>
                            </div>

                            <div className="mt-3 flex items-center gap-1.5">
                              <select
                                value={chosenLvl}
                                onChange={(e) =>
                                  setCertTargetLevel((prev) => ({
                                    ...prev,
                                    [stu.id]: e.target.value as CEFRLevel,
                                  }))
                                }
                                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-mono text-xs font-bold"
                              >
                                {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map(
                                  (l) => (
                                    <option key={l} value={l}>
                                      {l}
                                    </option>
                                  ),
                                )}
                              </select>
                              <button
                                type="button"
                                disabled={alreadyHas}
                                onClick={() =>
                                  onIssueCertificateToStudent(stu.id, chosenLvl)
                                }
                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
                              >
                                <Award className="h-3.5 w-3.5" />
                                <span>
                                  {alreadyHas
                                    ? `Certificado ${chosenLvl} emitido`
                                    : `Emitir Cert. ${chosenLvl}`}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  downloadPedagogicalReportPdf({
                                    student: stu,
                                    course: getLanguageCourseMeta(stu.activeLanguage ?? 'en'),
                                    schoolName: state.schoolName,
                                    teacherName: currentUser.name,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                                title="Gerar Boletim Mensal em PDF"
                              >
                                <span>Boletim PDF</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {onLinkStudentToTeacher && onUnlinkStudentFromTeacher && (
            <div className="lg:col-span-12">
              <VipStudentsPanel
                currentUser={currentUser}
                users={state.users}
                isMaster={isMaster}
                onLinkStudentToTeacher={onLinkStudentToTeacher}
                onUnlinkStudentFromTeacher={onUnlinkStudentFromTeacher}
                onCreateVipAssignment={onCreateAssignment}
              />
            </div>
          )}

          {/* Master Admin: Gestão Global de Usuários & Permissões */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-12">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <h2 className="font-display text-lg font-extrabold text-slate-900">
                    Gestão de Usuários & Permissões ({state.users.length})
                  </h2>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Admin Mestre autorizado: <span className="font-mono font-bold text-slate-700">{MASTER_ADMIN_EMAIL}</span> · Código de convite docente: <span className="rounded bg-purple-100 px-1.5 py-0.5 font-mono font-bold text-purple-900">{DEFAULT_TEACHER_ACCESS_CODE}</span>
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email)
                    ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email)
                  ? 'Modo Admin Mestre Desbloqueado'
                  : 'Modo Professor (Somente leitura para cargos)'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {state.users.map((u) => {
                const isTargetMaster = Boolean(
                  u.isMasterAdmin || isMasterAdminEmail(u.email),
                );
                const canManage = Boolean(
                  currentUser.isMasterAdmin || isMasterAdminEmail(currentUser.email),
                );
                return (
                  <div
                    key={u.id}
                    className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 ${
                      isTargetMaster
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate font-display text-sm font-bold text-slate-900">
                            {u.name}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              isTargetMaster
                                ? 'bg-amber-300 text-amber-950'
                                : u.role === 'teacher'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isTargetMaster
                              ? 'Admin Mestre'
                              : u.role === 'teacher'
                                ? 'Professor'
                                : 'Aluno'}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                          {u.email}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-600">
                          {u.xp} XP · {u.completedTopicIds.length} unidades · {getClassName(u.classId)}
                        </p>
                      </div>
                      {canManage && !isTargetMaster && u.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          aria-label={`Remover usuário ${u.name}`}
                          title="Excluir conta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {!isTargetMaster && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-2.5">
                        {u.role === 'student' && (
                          <select
                            value={u.classId ?? ''}
                            onChange={(e) =>
                              onMoveUserClass(u.id, e.target.value || undefined)
                            }
                            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                          >
                            <option value="">Sem turma</option>
                            {state.classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => onToggleUserRole(u.id)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            {u.role === 'teacher'
                              ? 'Mudar p/ Aluno'
                              : 'Promover a Professor'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE CUSTOM TOPIC */}
      {tab === 'create' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleCreateTopic}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Criar Tópico com as 4 Habilidades + Dica
                </h2>
                <p className="text-xs text-slate-500">
                  Ao publicar, a lição fica disponível para toda a escola na Trilha de Estudos.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePrefillSampleTopic}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Exemplo pronto</span>
                </button>
              </div>
            </div>

            {/* Phase 9: AI Unit Generator */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-3.5">
              <input
                type="text"
                value={aiTopicIdea}
                onChange={(e) => setAiTopicIdea(e.target.value)}
                placeholder="Tema p/ IA gerar lição (ex: Negociar aumento, Pedir comida em Paris)..."
                className="min-w-[200px] flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
              />
              <button
                type="button"
                disabled={isGeneratingAiTopic || !aiTopicIdea.trim()}
                onClick={async () => {
                  setIsGeneratingAiTopic(true);
                  try {
                    const res = await fetch(
                      `${DEFAULT_BACKEND_API_URL.replace(/\/+$/, '')}/api/gemini-tutor`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [
                            {
                              role: 'user',
                              parts: [
                                {
                                  text: `Create a language lesson draft in ${topicLanguage} (CEFR ${level}) for Brazilian Portuguese students on topic "${aiTopicIdea.trim()}". Reply ONLY with JSON: {"titlePt":"","titleEn":"","subtitle":"","tipTitle":"","tipSummary":"","tipDetails":"","tipExampleEn":"","tipExamplePt":"","listenAudio":"","listenQuestion":"","listenRight":"","listenWrong":"","readText":"","readQuestion":"","readRight":"","readWrong":"","speakSentence":"","speakTranslation":"","speakHint":"","writePrompt":"","writeModel":""}`,
                                },
                              ],
                            },
                          ],
                          generationConfig: { responseMimeType: 'application/json' },
                        }),
                      },
                    );
                    if (res.ok) {
                      const json = (await res.json()) as {
                        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
                      };
                      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (raw) {
                        const d = JSON.parse(raw) as Record<string, string>;
                        if (d.titlePt) setTitlePt(d.titlePt);
                        if (d.titleEn) setTitleEn(d.titleEn);
                        if (d.subtitle) setSubtitle(d.subtitle);
                        if (d.tipTitle) setTipTitle(d.tipTitle);
                        if (d.tipSummary) setTipSummary(d.tipSummary);
                        if (d.tipDetails) setTipDetails(d.tipDetails);
                        if (d.tipExampleEn) setTipExampleEn(d.tipExampleEn);
                        if (d.tipExamplePt) setTipExamplePt(d.tipExamplePt);
                        if (d.listenAudio) setListenAudio(d.listenAudio);
                        if (d.listenQuestion) setListenQuestion(d.listenQuestion);
                        if (d.listenRight) setListenRight(d.listenRight);
                        if (d.listenWrong) setListenWrong(d.listenWrong);
                        if (d.readText) setReadText(d.readText);
                        if (d.readQuestion) setReadQuestion(d.readQuestion);
                        if (d.readRight) setReadRight(d.readRight);
                        if (d.readWrong) setReadWrong(d.readWrong);
                      }
                    }
                  } catch {
                    // Ignore generation errors cleanly
                  } finally {
                    setIsGeneratingAiTopic(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingAiTopic ? 'Gerando...' : 'Gerar rascunho com IA'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">
                  Título em Português *
                </label>
                <input
                  required
                  value={titlePt}
                  onChange={(e) => setTitlePt(e.target.value)}
                  placeholder="Ex: Check-in no Hotel"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Idioma</label>
                <select
                  value={topicLanguage}
                  onChange={(e) => setTopicLanguage(e.target.value as LanguageCode)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="en">🇬🇧 Inglês</option>
                  <option value="es">🇪🇸 Espanhol</option>
                  <option value="fr">🇫🇷 Francês</option>
                  <option value="de">🇩🇪 Alemão</option>
                  <option value="it">🇮🇹 Italiano</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Nível CEFR</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="A1">A1 · Iniciante</option>
                  <option value="A2">A2 · Básico</option>
                  <option value="B1">B1 · Intermediário</option>
                  <option value="B2">B2 · Avançado</option>
                  <option value="C1">C1 · Proficiência</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Título em Inglês (opcional)"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtítulo curto"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <p className="text-xs font-extrabold text-amber-900 uppercase">
                1. Dica do Professor durante o tópico
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  value={tipTitle}
                  onChange={(e) => setTipTitle(e.target.value)}
                  placeholder="Título da dica"
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm sm:col-span-2"
                />
                <select
                  value={tipCategory}
                  onChange={(e) => setTipCategory(e.target.value as TipCategory)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="grammar">Gramática</option>
                  <option value="pronunciation">Pronúncia</option>
                  <option value="false_friend">Falso Cognato</option>
                  <option value="culture">Cultura</option>
                </select>
              </div>
              <input
                value={tipSummary}
                onChange={(e) => setTipSummary(e.target.value)}
                placeholder="Resumo em 1 linha"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                value={tipDetails}
                onChange={(e) => setTipDetails(e.target.value)}
                placeholder="Explicação completa da dica..."
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  value={tipExampleEn}
                  onChange={(e) => setTipExampleEn(e.target.value)}
                  placeholder="Exemplo em inglês"
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  value={tipExamplePt}
                  onChange={(e) => setTipExamplePt(e.target.value)}
                  placeholder="Tradução do exemplo"
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2.5 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
                <p className="text-xs font-extrabold text-indigo-900 uppercase">
                  2. Listening (Áudio em Inglês) *
                </p>
                <textarea
                  required
                  rows={2}
                  value={listenAudio}
                  onChange={(e) => setListenAudio(e.target.value)}
                  placeholder="Texto em inglês que o app falará..."
                  className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={listenQuestion}
                  onChange={(e) => setListenQuestion(e.target.value)}
                  placeholder="Pergunta de compreensão (PT)"
                  className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={listenRight}
                  onChange={(e) => setListenRight(e.target.value)}
                  placeholder="Alternativa correta"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={listenWrong}
                  onChange={(e) => setListenWrong(e.target.value)}
                  placeholder="Alternativa distratora"
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-2.5 rounded-2xl border border-teal-200 bg-teal-50/40 p-4">
                <p className="text-xs font-extrabold text-teal-900 uppercase">
                  3. Reading (Texto em Inglês) *
                </p>
                <textarea
                  required
                  rows={2}
                  value={readText}
                  onChange={(e) => setReadText(e.target.value)}
                  placeholder="Texto ou e-mail curto em inglês..."
                  className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={readQuestion}
                  onChange={(e) => setReadQuestion(e.target.value)}
                  placeholder="Pergunta sobre o texto (PT)"
                  className="w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={readRight}
                  onChange={(e) => setReadRight(e.target.value)}
                  placeholder="Alternativa correta"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={readWrong}
                  onChange={(e) => setReadWrong(e.target.value)}
                  placeholder="Alternativa distratora"
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2.5 rounded-2xl border border-rose-200 bg-rose-50/40 p-4">
                <p className="text-xs font-extrabold text-rose-900 uppercase">
                  4. Speaking (Fala) *
                </p>
                <input
                  required
                  value={speakSentence}
                  onChange={(e) => setSpeakSentence(e.target.value)}
                  placeholder="Frase alvo em inglês..."
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={speakTranslation}
                  onChange={(e) => setSpeakTranslation(e.target.value)}
                  placeholder="Tradução da frase"
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  value={speakHint}
                  onChange={(e) => setSpeakHint(e.target.value)}
                  placeholder="Dica de pronúncia"
                  className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-2.5 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                <p className="text-xs font-extrabold text-amber-900 uppercase">
                  5. Writing (Escrita)
                </p>
                <input
                  value={writePrompt}
                  onChange={(e) => setWritePrompt(e.target.value)}
                  placeholder="Instrução da escrita (PT)"
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs"
                />
                <textarea
                  rows={2}
                  value={writeModel}
                  onChange={(e) => setWriteModel(e.target.value)}
                  placeholder="Resposta modelo do professor (EN)"
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publicar tópico na Trilha de Estudos</span>
            </button>
          </form>

          <div className="space-y-3 lg:col-span-4">
            <h3 className="font-display text-sm font-bold tracking-wide text-slate-500 uppercase">
              Seus tópicos publicados ({state.customTopics.length})
            </h3>
            {state.customTopics.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">
                Você ainda não criou tópicos próprios. Use “Preencher exemplo pronto” ao lado para testar em 1 clique!
              </div>
            ) : (
              state.customTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-600">
                          {topic.languageCode ?? 'en'}
                        </span>
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-700">
                          {topic.level}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-sm font-bold text-slate-900">
                        {topic.titlePt}
                      </h4>
                      <p className="text-xs text-slate-500">{topic.steps.length} etapas</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomTopic(topic.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      aria-label={`Remover ${topic.titlePt}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPlayTopic(topic)}
                    className="mt-3 w-full rounded-xl border border-blue-200 bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                  >
                    Testar tópico agora →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CLOUD SYNC (SUPABASE), GEMINI AI & SCHOOL SETTINGS */}
      {tab === 'cloud' && (
        <SchoolSettingsTab
          state={state}
          currentUser={currentUser}
          autoSyncStatus={autoSyncStatus}
          voiceLabels={voiceLabels}
          onUpdateSettings={onUpdateSettings}
          onUpdateCloudConfig={onUpdateCloudConfig}
          onApplyCloudSnapshot={onApplyCloudSnapshot}
          onImportState={onImportState}
          onResetDemo={onResetDemo}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingConfirm)}
        title={pendingConfirm?.title ?? ''}
        description={pendingConfirm?.description ?? ''}
        warningBox={pendingConfirm?.warningBox}
        confirmLabel={pendingConfirm?.confirmLabel ?? 'Confirmar'}
        tone={pendingConfirm?.tone ?? 'warning'}
        onConfirm={() => {
          pendingConfirm?.action();
          setPendingConfirm(null);
        }}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}
