import type { CommunityPost, LanguageCode, UserProfile } from '../types/learning';

export interface LeagueTier {
  id: string;
  namePt: string;
  minWeeklyXp: number;
  badge: string;
  colorClass: string;
}

export const LEAGUES: LeagueTier[] = [
  { id: 'bronze', namePt: 'Liga Bronze', minWeeklyXp: 0, badge: '🥉', colorClass: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'silver', namePt: 'Liga Prata', minWeeklyXp: 150, badge: '🥈', colorClass: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'gold', namePt: 'Liga Ouro', minWeeklyXp: 350, badge: '🥇', colorClass: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'sapphire', namePt: 'Liga Safira', minWeeklyXp: 650, badge: '💎', colorClass: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'ruby', namePt: 'Liga Rubi', minWeeklyXp: 1000, badge: '❤️', colorClass: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'emerald', namePt: 'Liga Esmeralda', minWeeklyXp: 1450, badge: '💚', colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'diamond', namePt: 'Liga Diamante', minWeeklyXp: 2000, badge: '👑', colorClass: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
];

export function getCurrentWeekKey(now: Date = new Date()): string {
  const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getLeagueForWeeklyXp(weeklyXp: number): LeagueTier {
  let current = LEAGUES[0];
  for (const tier of LEAGUES) {
    if (weeklyXp >= tier.minWeeklyXp) current = tier;
  }
  return current;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarColor: string;
  weeklyXp: number;
  totalXp: number;
  streakDays: number;
  isCurrentUser: boolean;
  isRealPeer: boolean;
  league: LeagueTier;
}

const COMMUNITY_BOT_NAMES = [
  'Camila Torres',
  'Rafael Mendes',
  'Beatriz Lima',
  'Thiago Alves',
  'Larissa Souza',
  'Pedro Henrique',
  'Juliana Costa',
  'Mateus Rocha',
];

export function computeLanguageLeaderboard(
  users: UserProfile[],
  currentUser: UserProfile,
  languageCode: LanguageCode,
): LeaderboardEntry[] {
  const currentWeek = getCurrentWeekKey();
  const realEntries: LeaderboardEntry[] = users
    .filter((u) => !u.blocked)
    .map((u) => {
      const sameWeek = u.weeklyXpWeekKey === currentWeek;
      const weeklyXp = sameWeek
        ? u.weeklyXpByLanguage?.[languageCode] ?? 0
        : 0;
      const totalXp = u.xpByLanguage?.[languageCode] ?? (u.activeLanguage === languageCode ? u.xp : 0);
      return {
        id: u.id,
        name: u.name,
        avatarColor: u.avatarColor,
        weeklyXp,
        totalXp,
        streakDays: u.streakDays ?? 1,
        isCurrentUser: u.id === currentUser.id,
        isRealPeer: true,
        league: getLeagueForWeeklyXp(weeklyXp),
      };
    });

  // Preenche com pares globais da liga se houver menos de 8 usuários reais para manter competitividade saudável
  const needed = Math.max(0, 8 - realEntries.length);
  const seedBase = languageCode.charCodeAt(0) + (languageCode.charCodeAt(1) ?? 0);
  for (let i = 0; i < needed; i++) {
    const weeklyXp = Math.max(40, ((seedBase * (i + 3) * 37) % 780) + 40);
    realEntries.push({
      id: `peer-${languageCode}-${i}`,
      name: `${COMMUNITY_BOT_NAMES[i % COMMUNITY_BOT_NAMES.length]} (Liga)`,
      avatarColor: ['#2563EB', '#0D9488', '#D97706', '#7C3AED', '#E11D48', '#059669'][i % 6],
      weeklyXp,
      totalXp: weeklyXp * 4,
      streakDays: ((i + seedBase) % 14) + 2,
      isCurrentUser: false,
      isRealPeer: false,
      league: getLeagueForWeeklyXp(weeklyXp),
    });
  }

  return realEntries.sort((a, b) => {
    if (b.weeklyXp !== a.weeklyXp) return b.weeklyXp - a.weeklyXp;
    return b.totalXp - a.totalXp;
  });
}

export function getStarterPostsForLanguage(languageCode: LanguageCode): CommunityPost[] {
  const labels: Record<LanguageCode, { name: string; sample: string; tip: string }> = {
    en: { name: 'Inglês', sample: 'I have been working remotely for two years.', tip: 'Lembre-se: use "for" para duração e "since" para ponto de início.' },
    es: { name: 'Espanhol', sample: 'Todavía estoy buscando un piso cerca del metro.', tip: 'Atenção: "todavía" = ainda (não "todavia"!).' },
    fr: { name: 'Francês', sample: 'Je voudrais un café allongé, s’il vous plaît.', tip: 'Use "Je voudrais" no lugar de "Je veux" em atendimentos.' },
    it: { name: 'Italiano', sample: 'Mi piacerebbe prenotare un tavolo per due.', tip: '"Mi piacerebbe" soa muito mais elegante que "Voglio".' },
    de: { name: 'Alemão', sample: 'Morgen fahre ich mit dem Zug nach München.', tip: 'Regra V2: o verbo conjugado fica sempre na 2ª posição da frase.' },
    ru: { name: 'Russo', sample: 'Извините, где находится ближайшая станция метро?', tip: 'Em russo, o "о" átono soa como um "a" suave (аканье).' },
    ja: { name: 'Japonês', sample: 'すみません、駅はどこですか。', tip: 'A partícula は lê-se "wa" quando marca o tópico da frase.' },
    zh: { name: 'Chinês', sample: '请问，最近的地铁站在哪里？', tip: 'Mantenha o 3º tom bem baixo em 请 (qǐng) antes de subir.' },
    ar: { name: 'Árabe', sample: 'من فضلك، أين محطة المترو القريبة؟', tip: 'A escrita árabe flui da direita para a esquerda (RTL).' },
    nl: { name: 'Holandês', sample: 'Ik wil graag een kopje koffie bestellen.', tip: 'Pratique os ditongos "ij" e "ui" em voz alta no Modo Shadowing!' },
    af: { name: 'Africâner', sample: 'Ek praat nog nie vlot Afrikaans nie.', tip: 'Não esqueça de fechar a frase negativa com o segundo "nie"!' },
    sv: { name: 'Sueco', sample: 'Jag skulle vilja ta en fika efter jobbet.', tip: 'Fika é muito mais que café: é uma pausa social essencial na Suécia.' },
  };
  const info = labels[languageCode];
  return [
    {
      id: `starter-${languageCode}-1`,
      languageCode,
      authorId: 'user-master-silas',
      authorName: 'Prof. Silas',
      authorAvatarColor: '#0F172A',
      authorRole: 'teacher',
      level: 'A1',
      category: 'culture',
      title: `Bem-vindos ao Fórum de ${info.name}!`,
      body: `Compartilhe dúvidas, frases para correção pelos colegas e conquistas em ${info.name}. ${info.tip}`,
      targetSnippet: info.sample,
      likes: ['user-master-silas'],
      replies: [],
      pinned: true,
      createdAt: '2026-11-01',
    },
    {
      id: `starter-${languageCode}-2`,
      languageCode,
      authorId: 'peer-community-guide',
      authorName: 'Comunidade FluentBridge',
      authorAvatarColor: '#2563EB',
      authorRole: 'student',
      level: 'A2',
      category: 'correction',
      title: `Prática diária: escreva 1 frase em ${info.name}`,
      body: `Escreva uma frase sobre sua rotina hoje usando o vocabulário da sua última unidade para receber sugestões da turma (+5 XP por ajuda!).`,
      targetSnippet: info.sample,
      likes: [],
      replies: [],
      createdAt: '2026-11-10',
    },
  ];
}

export interface ModerationResult {
  allowed: boolean;
  reasonPt?: string;
}

const BLOCKED_TERMS_PATTERN =
  /\b(idiota|burro|imbecil|otario|otário|merda|porra|caralho|puta|viado|arrombado|fuck|shit|bitch|asshole|spam|t\.me\/|wa\.me\/|bit\.ly\/|tinyurl\.com)\b/i;

export function moderateCommunityText(text: string): ModerationResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { allowed: false, reasonPt: 'Escreva uma mensagem antes de publicar.' };
  }
  if (/https?:\/\/\S+/i.test(trimmed) || /www\.\S+/i.test(trimmed)) {
    return {
      allowed: false,
      reasonPt: 'Links externos não são permitidos no fórum para segurança da comunidade.',
    };
  }
  if (BLOCKED_TERMS_PATTERN.test(trimmed)) {
    return {
      allowed: false,
      reasonPt: 'Sua mensagem contém termos inadequados ou bloqueados pela moderação.',
    };
  }
  const letters = trimmed.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (letters.length >= 15) {
    const upper = letters.replace(/[^A-ZÀ-Ý]/g, '').length;
    if (upper / letters.length > 0.78) {
      return {
        allowed: false,
        reasonPt: 'Evite escrever quase tudo em MAIÚSCULAS para manter a leitura agradável.',
      };
    }
  }
  if (/(.)\1{6,}/.test(trimmed)) {
    return {
      allowed: false,
      reasonPt: 'Texto identificado como repetição excessiva (anti-spam).',
    };
  }
  return { allowed: true };
}

export interface MonthlyChallenge {
  id: string;
  languageCode: LanguageCode;
  monthKey: string;
  title: string;
  description: string;
  goalXp: number;
  xpReward: number;
  badgeLabel: string;
}

export function getMonthlyChallengeForLanguage(
  languageCode: LanguageCode,
  date = new Date(),
): MonthlyChallenge {
  const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  const titles: Record<LanguageCode, string> = {
    en: 'Sprint de Fluência em Inglês',
    es: 'Maratón de Conversación en Español',
    fr: 'Défi Culture & Dialogue en Français',
    it: 'Sfida Parliamo Italiano',
    de: 'Deutsch im Alltag Challenge',
    ru: 'Челлендж Русского Языка',
    ja: '日本語 毎日チャレンジ',
    zh: '中文口语与汉字挑战',
    ar: 'تحدي اللغة العربية اليومي',
    nl: 'Nederlands Spreek-Sprint',
    af: 'Afrikaans Praat-Uitdaging',
    sv: 'Svenska Samtalsutmaning',
  };
  return {
    id: `challenge-${monthKey}-${languageCode}`,
    languageCode,
    monthKey,
    title: titles[languageCode] ?? `Desafio do Mês (${languageCode.toUpperCase()})`,
    description: 'Acumule 150 XP semanais neste idioma para desbloquear o selo mensal e +80 XP bônus.',
    goalXp: 150,
    xpReward: 80,
    badgeLabel: `Embaixador ${languageCode.toUpperCase()} ${monthKey}`,
  };
}
