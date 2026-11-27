/**
 * @file src/utils/__tests__/deltaSyncAndOffline.test.ts
 * @description Testes unitários Vitest para Delta Sync (computePlatformStateDelta, applyPlatformStateDelta, resolveConflictByUpdatedAt) e pacotes offline (offlineUnitPack).
 * @exports
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlatformState, Topic, VocabCard } from '../../types/learning';
import {
  applyPlatformStateDelta,
  clearEntityDirtyTimestamps,
  computePlatformStateDelta,
  getEntityDirtyTimestamps,
  recordEntityDirtyTimestamp,
  resolveConflictByUpdatedAt,
} from '../deltaSyncEngine';
import {
  OFFLINE_PACK_CACHE_NAME,
  clearOfflinePackCache,
  downloadCefrLevelOfflinePack,
  downloadNextUnitsOffline,
  getCachedOfflineUnits,
  getConceptImageUrl,
  getOfflinePackStats,
} from '../offlineUnitPack';

function makeBaseState(): PlatformState {
  return {
    schoolName: 'FluentBridge',
    teacherName: 'Prof. Ana',
    currentUserId: 'u-1',
    classes: [
      {
        id: 'c-1',
        name: 'Turma A1',
        code: 'A1-01',
        level: 'A1',
        schedule: 'Seg 19h',
        description: 'Turma inicial',
        createdAt: '2026-11-01T10:00:00.000Z',
      },
    ],
    users: [
      {
        id: 'u-1',
        name: 'Maria',
        email: 'maria@example.com',
        password: 'secret',
        role: 'student',
        avatarColor: '#116DFF',
        activeLanguage: 'en',
        dialectByLanguage: { en: 'en-US' },
        accent: 'en-US',
        dailyGoalMinutes: 15,
        todayMinutes: 5,
        xp: 120,
        streakDays: 3,
        completedTopicIds: ['t-1'],
        skillScores: { listening: 60, reading: 70, speaking: 55, writing: 65 },
        vocab: [],
        issuedCertificates: [],
        dailyQuests: {
          lessonsCompletedToday: 1,
          vocabReviewedToday: 2,
          tutorSessionsToday: 0,
          claimedQuestIds: [],
        },
        createdAt: '2026-11-01T10:00:00.000Z',
      },
    ],
    customTopics: [],
    submissions: [
      {
        id: 's-1',
        studentId: 'u-1',
        studentName: 'Maria',
        topicId: 't-1',
        topicTitle: 'Greetings',
        type: 'writing',
        promptPt: 'Introduce yourself',
        responseText: 'Hello, I am Maria.',
        createdAt: '02/11 10:00',
        status: 'pending',
      },
    ],
    assignments: [],
    communityPosts: [],
    liveSessions: [],
    cloudConfig: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      geminiApiKey: '',
    },
  };
}

describe('deltaSyncEngine', () => {
  beforeEach(() => {
    clearEntityDirtyTimestamps();
  });

  it('computes incremental entity deltas and applies them without mutating base', () => {
    const prev = makeBaseState();
    const next: PlatformState = {
      ...prev,
      schoolName: 'FluentBridge Pro',
      users: [
        { ...prev.users[0], xp: 250 },
        { ...prev.users[0], id: 'u-2', name: 'João', email: 'joao@example.com' },
      ],
      classes: [],
      assignments: [
        {
          id: 'a-1',
          title: 'Listening A1',
          description: 'Complete unit 1',
          languageCode: 'en',
          dueDate: '2026-12-01',
          createdAt: '2026-11-26T12:00:00.000Z',
          createdBy: 'teacher',
        },
      ],
    };

    const delta = computePlatformStateDelta(prev, next);
    expect(delta.scalarChanges?.schoolName).toBe('FluentBridge Pro');
    expect(delta.entities.users?.upserted.map((u) => u.id)).toEqual(['u-1', 'u-2']);
    expect(delta.entities.classes?.deletedIds).toEqual(['c-1']);
    expect(delta.entities.assignments?.upserted.map((a) => a.id)).toEqual(['a-1']);
    expect(delta.entities.submissions).toBeUndefined();

    const applied = applyPlatformStateDelta(prev, delta);
    expect(prev.users).toHaveLength(1);
    expect(applied.schoolName).toBe('FluentBridge Pro');
    expect(applied.users).toHaveLength(2);
    expect(applied.users.find((u) => u.id === 'u-1')?.xp).toBe(250);
    expect(applied.classes).toHaveLength(0);
    expect(applied.deletedClassIds).toContain('c-1');
    expect(applied.assignments).toHaveLength(1);
  });

  it('resolves conflicts by updatedAt LWW and tracks dirty timestamps', () => {
    const older = { id: 'p-1', title: 'Old', updatedAt: '2026-11-25T10:00:00.000Z' };
    const newer = { id: 'p-1', title: 'New', updatedAt: '2026-11-26T10:00:00.000Z' };

    expect(resolveConflictByUpdatedAt(older, newer)?.title).toBe('New');
    expect(resolveConflictByUpdatedAt(newer, older)?.title).toBe('New');

    const ts = recordEntityDirtyTimestamp('users', 'u-1', '2026-11-26T15:00:00.000Z');
    expect(ts).toBe('2026-11-26T15:00:00.000Z');
    expect(getEntityDirtyTimestamps('users')).toEqual({
      'u-1': '2026-11-26T15:00:00.000Z',
    });

    clearEntityDirtyTimestamps();
    expect(getEntityDirtyTimestamps('users')).toEqual({});
  });
});

describe('offlineUnitPack', () => {
  const store = new Map<string, string>();
  const cacheEntries = new Map<string, Response>();

  beforeEach(() => {
    store.clear();
    cacheEntries.clear();

    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });

    vi.stubGlobal('caches', {
      open: vi.fn(async (name: string) => {
        expect(name).toBe(OFFLINE_PACK_CACHE_NAME);
        return {
          put: vi.fn(async (req: string, res: Response) => {
            cacheEntries.set(req, res);
          }),
          keys: vi.fn(async () =>
            Array.from(cacheEntries.keys()).map((url) => ({ url }) as Request),
          ),
          match: vi.fn(async (req: Request | string) => {
            const key = typeof req === 'string' ? req : req.url;
            return cacheEntries.get(key);
          }),
        };
      }),
      delete: vi.fn(async () => {
        cacheEntries.clear();
        return true;
      }),
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string | URL | Request) => {
        const u = String(url);
        if (u.includes('/concepts/') || u.endsWith('.svg')) {
          return new Response('<svg></svg>', {
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml', 'Content-Length': '2048' },
          });
        }
        return new Response(new Uint8Array([1, 2, 3, 4]), {
          status: 200,
          headers: { 'Content-Type': 'audio/mpeg' },
        });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const sampleTopics: Topic[] = [
    {
      id: 't-a1-1',
      titlePt: 'Saudações',
      titleEn: 'Greetings',
      subtitle: 'Basics',
      level: 'A1',
      estimatedMinutes: 5,
      icon: '👋',
      color: '#116DFF',
      coverConceptId: 'hello-wave',
      topicTipsSummary: [],
      steps: [
        {
          id: 'st-1',
          type: 'listening',
          audioText: 'Good morning!',
          speakerLabel: 'Ana',
          contextPt: 'Manhã',
          question: 'What did she say?',
          options: ['Good morning', 'Good night'],
          correctIndex: 0,
          explanation: 'Morning greeting',
          hintTip: 'Listen closely',
        },
        {
          id: 'st-2',
          type: 'picture_choice',
          promptPt: 'Escolha café',
          audioText: 'Coffee please',
          targetWord: 'Coffee',
          options: [
            { conceptId: 'coffee-cup', label: 'Coffee', translationPt: 'Café' },
          ],
          correctIndex: 0,
          explanationPt: 'Coffee',
        },
      ],
    },
    {
      id: 't-b1-1',
      titlePt: 'Entrevista',
      titleEn: 'Interview',
      subtitle: 'Career',
      level: 'B1',
      estimatedMinutes: 8,
      icon: '💼',
      color: '#0F172A',
      coverImageUrl: 'https://cdn.example.com/interview.png',
      topicTipsSummary: [],
      steps: [],
    },
  ];

  const sampleVocab: VocabCard[] = [
    {
      id: 'v-1',
      topicId: 't-a1-1',
      word: 'Hello',
      translation: 'Olá',
      ipa: '/həˈloʊ/',
      exampleEn: 'Hello there!',
      examplePt: 'Olá!',
      category: 'greetings',
      strength: 'medium',
      reviewCount: 1,
      visualConceptId: 'wave-hand',
    },
  ];

  it('resolves concept image URLs and caches units + CEFR levels + stats', async () => {
    expect(getConceptImageUrl('coffee-cup')).toBe('/concepts/coffee-cup.svg');
    expect(getConceptImageUrl('x', 'https://cdn.example.com/a.png')).toBe(
      'https://cdn.example.com/a.png',
    );
    expect(getConceptImageUrl()).toBeNull();

    const nextRes = await downloadNextUnitsOffline(
      sampleTopics,
      sampleVocab,
      [],
      'en-US',
      1,
    );
    expect(nextRes.cachedTopicIds).toEqual(['t-a1-1']);
    expect(nextRes.imageCount).toBe(3);
    expect(cacheEntries.has('/concepts/hello-wave.svg')).toBe(true);
    expect(cacheEntries.has('/concepts/wave-hand.svg')).toBe(true);
    expect(cacheEntries.has('/concepts/coffee-cup.svg')).toBe(true);

    const levelRes = await downloadCefrLevelOfflinePack(
      sampleTopics,
      sampleVocab,
      'B1',
      'en-US',
    );
    expect(levelRes.cachedTopicIds).toEqual(['t-b1-1']);
    expect(getCachedOfflineUnits()).toEqual(['t-a1-1', 't-b1-1']);

    const stats = await getOfflinePackStats();
    expect(stats.cachedUnits).toBe(2);
    expect(stats.estimatedKb).toBeGreaterThan(0);

    await clearOfflinePackCache();
    expect(getCachedOfflineUnits()).toEqual([]);
    expect(cacheEntries.size).toBe(0);
  });
});
