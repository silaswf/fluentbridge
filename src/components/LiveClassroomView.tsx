import { useState } from 'react';
import { Calendar, ExternalLink, Plus, Sparkles, Video } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import type {
  ClassGroup,
  LanguageCode,
  LiveSessionRecord,
  UserProfile,
} from '../types/learning';

interface LiveClassroomViewProps {
  currentUser: UserProfile;
  activeLanguage: LanguageCode;
  classes: ClassGroup[];
  students: UserProfile[];
  sessions: LiveSessionRecord[];
  onCreateSession: (payload: Omit<LiveSessionRecord, 'id' | 'createdAt'>) => void;
  onUpdateSessionNotes: (sessionId: string, notes: string) => void;
  onGeneratePostClassTask: (session: LiveSessionRecord) => void;
}

export function LiveClassroomView({
  currentUser,
  activeLanguage,
  classes,
  students,
  sessions,
  onCreateSession,
  onUpdateSessionNotes,
  onGeneratePostClassTask,
}: LiveClassroomViewProps) {
  const isTeacher = currentUser.role === 'teacher';
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('2026-11-28T19:00');
  const [durationMin, setDurationMin] = useState(50);
  const [targetType, setTargetType] = useState<'vip' | 'class'>('vip');
  const [targetId, setTargetId] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [notesDraftById, setNotesDraftById] = useState<Record<string, string>>({});

  const visibleSessions = sessions.filter((s) => {
    if (s.languageCode !== activeLanguage) return false;
    if (isTeacher) return true;
    return (
      (!s.studentId && !s.classId) ||
      s.studentId === currentUser.id ||
      (currentUser.classId && s.classId === currentUser.classId)
    );
  });

  const activeSession = visibleSessions.find((s) => s.id === activeRoomId) ?? null;

  const handleSchedule = () => {
    if (!title.trim()) return;
    const slug = `FB-${activeLanguage}-${Date.now().toString(36)}`;
    onCreateSession({
      languageCode: activeLanguage,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      studentId: targetType === 'vip' && targetId ? targetId : undefined,
      classId: targetType === 'class' && targetId ? targetId : undefined,
      title: title.trim(),
      scheduledAt,
      durationMin,
      roomSlug: slug,
      status: 'scheduled',
      notes: '',
    });
    setTitle('');
  };

  return (
    <div data-testid="live-classroom-view" className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
              <Video className="h-3.5 w-3.5" />
              <span>Sala de Aula ao Vivo 1:1 &amp; Turmas</span>
            </span>
            <h1 className="mt-2 font-display text-2xl font-extrabold">
              Agenda VIP, Vídeo Integrado &amp; Tarefa Pós-Aula com IA
            </h1>
            <p className="mt-1 text-xs text-blue-100">
              Agende mentorias ao vivo, entre na sala de vídeo sem sair da plataforma e transforme suas anotações em tarefa + flashcards SM-2.
            </p>
          </div>
        </div>
      </div>

      {isTeacher && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
            <Plus className="h-4 w-4 text-blue-600" />
            <span>Agendar Nova Aula ao Vivo</span>
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              type="text"
              data-testid="live-session-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mentoria Speaking CELPIP"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 lg:col-span-2"
            />
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
            <select
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value === 'class' ? 'class' : 'vip');
                setTargetId('');
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="vip">Aluno VIP / Geral</option>
              <option value="class">Turma</option>
            </select>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="">Todos / Aberta</option>
              {targetType === 'vip'
                ? students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))
                : classes.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.name}
                    </option>
                  ))}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Duração (min):</span>
              <input
                type="number"
                min={15}
                max={180}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value) || 50)}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs"
              />
            </label>
            <button
              type="button"
              data-testid="schedule-live-session-btn"
              onClick={handleSchedule}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              Agendar Aula
            </button>
          </div>
        </div>
      )}

      {activeSession && (
        <div className="space-y-3 rounded-3xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-extrabold text-slate-900">
                {activeSession.title} · Sala Ao Vivo
              </h3>
              <p className="text-xs text-slate-500">
                Professor: {activeSession.teacherName} · Duração: {activeSession.durationMin} min
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://meet.jit.si/${activeSession.roomSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Abrir em nova aba</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveRoomId(null)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Fechar sala
              </button>
            </div>
          </div>

          <iframe
            title={activeSession.title}
            src={`https://meet.jit.si/${activeSession.roomSlug}`}
            allow="camera; microphone; fullscreen; display-capture"
            className="h-[380px] w-full rounded-2xl border border-slate-200 bg-slate-950"
          />

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="block text-xs font-bold text-slate-800">
              Bloco de Notas ao Vivo da Aula (erros &amp; vocabulário)
            </label>
            <textarea
              rows={3}
              value={notesDraftById[activeSession.id] ?? activeSession.notes}
              onChange={(e) => {
                const val = e.target.value;
                setNotesDraftById((prev) => ({ ...prev, [activeSession.id]: val }));
                onUpdateSessionNotes(activeSession.id, val);
              }}
              placeholder="Anote frases corrigidas e palavras-chave durante a aula..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
            {isTeacher && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onGeneratePostClassTask(activeSession)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Gerar Tarefa + Flashcards Pós-Aula com IA</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visibleSessions.length === 0 ? (
          <EmptyStateCard
            icon={Video}
            title="Nenhuma aula ao vivo agendada"
            description="As sessões ao vivo com seu professor para este idioma aparecerão aqui com link direto da sala e notas pós-aula."
            testId="empty-live-sessions"
          />
        ) : (
          visibleSessions.map((sess) => (
            <div
              key={sess.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs"
            >
              <div>
                <p className="font-display text-sm font-bold text-slate-900">
                  {sess.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{sess.scheduledAt.replace('T', ' ')} · {sess.durationMin} min · Prof. {sess.teacherName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRoomId(sess.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Entrar na Sala</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
