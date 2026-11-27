/**
 * @file src/components/CommunityHub.tsx
 * @description Comunidade 2.0: ligas semanais por idioma, fórum interativo, desafio mensal (+80 XP), reações, áudios e correção entre pares com diff.
 * @exports CommunityHub
 */
import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Heart,
  MessageSquare,
  Pin,
  PlusCircle,
  Send,
  Sparkles,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import type {
  CEFRLevel,
  CommunityPost,
  LanguageCourse,
  UserProfile,
} from '../types/learning';
import {
  computeLanguageLeaderboard,
  getCurrentWeekKey,
  getLeagueForWeeklyXp,
  getMonthlyChallengeForLanguage,
  getStarterPostsForLanguage,
  LEAGUES,
  moderateCommunityText,
} from '../utils/communityEngine';
import { isMasterAdminEmail } from '../config/appConfig';
import { DualAudioButtons } from './DualAudioButtons';
import { EmptyStateCard } from './EmptyStateCard';

interface CommunityHubProps {
  currentUser: UserProfile;
  users: UserProfile[];
  activeCourse: LanguageCourse;
  posts: CommunityPost[];
  realtimeConnected?: boolean;
  onCreatePost: (payload: {
    languageCode: LanguageCourse['code'];
    level: CEFRLevel;
    category: CommunityPost['category'];
    title: string;
    body: string;
    targetSnippet?: string;
  }) => void;
  onReplyPost: (postId: string, content: string, correctionSuggestion?: string) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleReaction?: (postId: string, emoji: string) => void;
  onAcceptCorrection?: (postId: string, replyId: string) => void;
  onClaimChallenge?: (challengeId: string, xpReward: number) => void;
  onDeletePost: (postId: string) => void;
}

const CATEGORY_LABELS: Record<CommunityPost['category'], string> = {
  question: 'Dúvida',
  correction: 'Correção de Texto',
  culture: 'Cultura & Dica',
  milestone: 'Conquista',
  study_partner: 'Parceiro de Estudo',
};

const QUICK_REACTIONS = ['👏', '🔥', '💡', '🎯'] as const;

export function CommunityHub({
  currentUser,
  users,
  activeCourse,
  posts,
  realtimeConnected = false,
  onCreatePost,
  onReplyPost,
  onToggleLikePost,
  onToggleReaction,
  onAcceptCorrection,
  onClaimChallenge,
  onDeletePost,
}: CommunityHubProps) {
  const [tab, setTab] = useState<'leagues' | 'forum'>('leagues');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | CommunityPost['category']>('ALL');
  const [showComposer, setShowComposer] = useState(false);

  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('question');
  const [newLevel, setNewLevel] = useState<CEFRLevel>('A1');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [correctionDrafts, setCorrectionDrafts] = useState<Record<string, string>>({});
  const [moderationError, setModerationError] = useState<string | null>(null);

  const monthlyChallenge = useMemo(
    () => getMonthlyChallengeForLanguage(activeCourse.code),
    [activeCourse.code],
  );
  const challengeClaimed = Boolean(
    currentUser.claimedChallengeIds?.includes(monthlyChallenge.id),
  );

  const weekKey = getCurrentWeekKey();
  const myWeeklyXp =
    currentUser.weeklyXpWeekKey === weekKey
      ? currentUser.weeklyXpByLanguage?.[activeCourse.code] ?? 0
      : 0;
  const myLeague = getLeagueForWeeklyXp(myWeeklyXp);

  const leaderboard = useMemo(
    () => computeLanguageLeaderboard(users, currentUser, activeCourse.code),
    [users, currentUser, activeCourse.code],
  );
  const myRank = leaderboard.findIndex((e) => e.isCurrentUser) + 1;

  const langPosts = useMemo(() => {
    const custom = posts.filter((p) => p.languageCode === activeCourse.code);
    const merged = custom.length > 0 ? custom : getStarterPostsForLanguage(activeCourse.code);
    return merged
      .filter((p) => categoryFilter === 'ALL' || p.category === categoryFilter)
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [posts, activeCourse.code, categoryFilter]);

  const isModerator =
    currentUser.role === 'teacher' ||
    Boolean(currentUser.isMasterAdmin) ||
    isMasterAdminEmail(currentUser.email);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const modCheck = moderateCommunityText(`${newTitle} ${newBody} ${newSnippet}`);
    if (!modCheck.allowed) {
      setModerationError(modCheck.reasonPt ?? 'Conteúdo bloqueado pela moderação.');
      return;
    }
    setModerationError(null);
    onCreatePost({
      languageCode: activeCourse.code,
      level: newLevel,
      category: newCategory,
      title: newTitle.trim(),
      body: newBody.trim(),
      targetSnippet: newSnippet.trim() || undefined,
    });
    setNewTitle('');
    setNewBody('');
    setNewSnippet('');
    setShowComposer(false);
  };

  const handleSendReply = (postId: string) => {
    const text = (replyDrafts[postId] ?? '').trim();
    if (!text) return;
    const correction = (correctionDrafts[postId] ?? '').trim() || undefined;
    const modCheck = moderateCommunityText(`${text} ${correction ?? ''}`);
    if (!modCheck.allowed) {
      setModerationError(modCheck.reasonPt ?? 'Resposta bloqueada pela moderação.');
      return;
    }
    setModerationError(null);
    onReplyPost(postId, text, correction);
    setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
    setCorrectionDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
            <Users className="h-3.5 w-3.5" />
            Comunidade · {activeCourse.flag} {activeCourse.namePt}
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
            Ligas &amp; Fórum de {activeCourse.namePt}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Compita de forma saudável nas ligas semanais deste idioma, tire dúvidas e receba correções de colegas e professores.
          </p>
        </div>

        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs self-start">
          <button
            type="button"
            data-testid="community-tab-leagues"
            onClick={() => setTab('leagues')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'leagues' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Ligas &amp; Ranking</span>
          </button>
          <button
            type="button"
            data-testid="community-tab-forum"
            onClick={() => setTab('forum')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              tab === 'forum' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Fórum ({langPosts.length})</span>
          </button>
        </div>
      </div>

      {tab === 'leagues' ? (
        <div className="space-y-5">
          {/* Current League Banner */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${myLeague.colorClass}`}>
                    <span>{myLeague.badge}</span>
                    <span>{myLeague.namePt}</span>
                  </span>
                  <h2 className="mt-2 font-display text-lg font-extrabold text-slate-900">
                    Sua posição em {activeCourse.namePt}: #{myRank}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Você acumulou <strong>{myWeeklyXp} XP</strong> esta semana ({weekKey}) estudando {activeCourse.namePt}. Top 3 sobem de divisão!
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                  <p className="font-mono text-2xl font-extrabold text-blue-700">{myWeeklyXp}</p>
                  <p className="text-[11px] font-bold text-blue-600">XP Semanal</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      realtimeConnected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {realtimeConnected ? 'Supabase Realtime' : 'Modo Local'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {LEAGUES.map((tier) => (
                  <span
                    key={tier.id}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-bold ${
                      tier.id === myLeague.id
                        ? `${tier.colorClass} ring-2 ring-blue-400`
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {tier.badge} {tier.namePt.replace('Liga ', '')} ({tier.minWeeklyXp}+)
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-emerald-950">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Como subir no Ranking
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-xs text-emerald-900">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Conclua unidades (+35 XP)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Faça Simulados Oficiais (+60 XP)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Ajude colegas no Fórum (+5 XP)
                </li>
              </ul>
            </div>
          </div>

          {/* Desafio do Mês */}
          <div
            data-testid="monthly-challenge-card"
            className="fb-card-primary rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-blue-50/80 p-5 shadow-2xs dark:border-indigo-900 dark:from-indigo-950/50 dark:to-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-200">
                  <Trophy className="h-3 w-3" /> Desafio do Mês · {monthlyChallenge.badgeLabel}
                </span>
                <h3 className="mt-1.5 font-display text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {monthlyChallenge.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {monthlyChallenge.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                  {Math.min(myWeeklyXp, monthlyChallenge.goalXp)} / {monthlyChallenge.goalXp} XP
                </span>
                {onClaimChallenge && (
                  <button
                    type="button"
                    data-testid="claim-monthly-challenge-btn"
                    disabled={challengeClaimed || myWeeklyXp < monthlyChallenge.goalXp}
                    onClick={() => onClaimChallenge(monthlyChallenge.id, monthlyChallenge.xpReward)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      challengeClaimed
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : myWeeklyXp >= monthlyChallenge.goalXp
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {challengeClaimed ? 'Resgatado ✓' : `Resgatar +${monthlyChallenge.xpReward} XP`}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${Math.min(100, Math.round((myWeeklyXp / monthlyChallenge.goalXp) * 100))}%` }}
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Placar Semanal · {activeCourse.flag} {activeCourse.namePt}
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between gap-3 px-5 py-3 ${
                    entry.isCurrentUser ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-extrabold ${
                        idx === 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : idx === 1
                            ? 'bg-slate-200 text-slate-800'
                            : idx === 2
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: entry.avatarColor }}
                    >
                      {entry.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {entry.name} {entry.isCurrentUser && '(Você)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {entry.league.badge} {entry.league.namePt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
                      <Flame className="h-3.5 w-3.5" />
                      {entry.streakDays}d
                    </span>
                    <span className="rounded-xl bg-slate-100 px-2.5 py-1 font-mono text-xs font-extrabold text-slate-800">
                      {entry.weeklyXp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Forum Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'question', 'correction', 'culture', 'milestone', 'study_partner'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos' : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <button
              type="button"
              data-testid="community-new-post-btn"
              onClick={() => setShowComposer((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Nova Publicação</span>
            </button>
          </div>

          {showComposer && (
            <form
              onSubmit={handlePublish}
              className="space-y-3 rounded-3xl border border-blue-200 bg-white p-5 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityPost['category'])}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="question">Dúvida</option>
                  <option value="correction">Pedir Correção de Texto</option>
                  <option value="culture">Cultura &amp; Dica</option>
                  <option value="milestone">Conquista</option>
                  <option value="study_partner">Parceiro de Estudo</option>
                </select>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as CEFRLevel)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Nível {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                data-testid="community-post-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={`Título da publicação em ${activeCourse.namePt}...`}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
              />
              <textarea
                required
                rows={3}
                data-testid="community-post-body"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Explique sua dúvida, compartilhe sua conquista ou peça feedback..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900"
              />
              <input
                type="text"
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                placeholder={`Frase opcional no idioma (${activeCourse.namePt}) para correção...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="community-publish-btn"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  Publicar no Fórum
                </button>
              </div>
            </form>
          )}

          {moderationError && (
            <div
              data-testid="community-moderation-error"
              className="flex items-center justify-between gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800"
            >
              <span>🛡️ {moderationError}</span>
              <button
                type="button"
                onClick={() => setModerationError(null)}
                className="text-[11px] font-bold underline cursor-pointer"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {langPosts.length === 0 && (
              <EmptyStateCard
                icon={MessageSquare}
                title="Nenhuma publicação nesta categoria"
                description="Seja o primeiro(a) a iniciar uma conversa, pedir correção de frase ou procurar um parceiro de estudo!"
                actionLabel="Criar publicação"
                onAction={() => setShowComposer(true)}
                testId="empty-community-posts"
              />
            )}
            {langPosts.map((post) => {
              const likedByMe = post.likes.includes(currentUser.id);
              const canDelete =
                !post.id.startsWith('starter-') &&
                (post.authorId === currentUser.id || isModerator);
              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold text-white"
                        style={{ backgroundColor: post.authorAvatarColor }}
                      >
                        {post.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {post.authorName}{' '}
                          {post.authorRole === 'teacher' && (
                            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                              Professor
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {post.createdAt} · Nível {post.level} · {CATEGORY_LABELS[post.category]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          <Pin className="h-3 w-3" /> Fixado
                        </span>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDeletePost(post.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          title="Excluir publicação"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-slate-900">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{post.body}</p>

                  {post.targetSnippet && (
                    <div
                      dir={activeCourse.code === 'ar' ? 'rtl' : 'ltr'}
                      className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2.5 text-sm font-semibold text-indigo-950"
                    >
                      <span>“{post.targetSnippet}”</span>
                      <DualAudioButtons
                        text={post.targetSnippet}
                        languageCode={post.languageCode}
                        size="xs"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onToggleLikePost(post.id)}
                      className={`inline-flex items-center gap-1 text-xs font-bold cursor-pointer ${
                        likedByMe ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${likedByMe ? 'fill-current' : ''}`} />
                      <span>{post.likes.length}</span>
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.replies.length} respostas</span>
                    </span>
                    {onToggleReaction && (
                      <div className="flex flex-wrap items-center gap-1">
                        {QUICK_REACTIONS.map((emoji) => {
                          const usersForEmoji = post.reactions?.[emoji] ?? [];
                          const activeReact = usersForEmoji.includes(currentUser.id);
                          return (
                            <button
                              key={emoji}
                              type="button"
                              data-testid={`reaction-btn-${emoji}`}
                              onClick={() => onToggleReaction(post.id, emoji)}
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold transition cursor-pointer ${
                                activeReact
                                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span>{emoji}</span>
                              {usersForEmoji.length > 0 && <span>{usersForEmoji.length}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3">
                      {post.replies.map((rep) => {
                        const isAccepted = post.acceptedReplyId === rep.id;
                        return (
                        <div key={rep.id} className="rounded-xl bg-slate-50 p-3 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              {rep.authorName}
                              {rep.authorRole === 'teacher' ? ' (Prof.)' : ''}
                              {isAccepted && (
                                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                                  Aceita ✓
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                          </div>
                          <p className="mt-1 text-slate-700">{rep.content}</p>
                          {rep.correctionSuggestion && (
                            <div className="mt-1.5 space-y-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-950">
                              {post.targetSnippet && (
                                <p className="text-[11px] text-rose-700 line-through">
                                  {post.targetSnippet}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-semibold">
                                  ✍️ Sugestão: {rep.correctionSuggestion}
                                </p>
                                {onAcceptCorrection && post.authorId === currentUser.id && !isAccepted && (
                                  <button
                                    type="button"
                                    onClick={() => onAcceptCorrection(post.id, rep.id)}
                                    className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                                  >
                                    Aceitar correção (+10 XP)
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Reply */}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={replyDrafts[post.id] ?? ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Escreva uma resposta amigável (+5 XP)..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={correctionDrafts[post.id] ?? ''}
                      onChange={(e) =>
                        setCorrectionDrafts((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Sugestão de correção (opcional)..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(post.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Responder</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
