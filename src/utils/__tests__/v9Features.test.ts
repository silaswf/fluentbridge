/**
 * @file src/utils/__tests__/v9Features.test.ts
 * @description Suíte de testes unitários Vitest validando v9Features.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { isRtlLanguage } from '../platform';
import { stripHebrewNiqqud } from '../hebrewNiqqud';
import {
  buildOfflineYouTubeStudyPack,
  extractYouTubeVideoId,
  fetchYouTubeStudyPack,
  parseManualTranscript,
} from '../youtubeStudy';
import { ALL_BUILTIN_TOPICS } from '../../data/lessons';
import { loadLanguageCourseData } from '../../data/courseLoader';
import { HEBREW_ALEFBET, NORDIC_SPECIAL_LETTERS, TURKISH_SPECIAL_LETTERS } from '../../data/scriptTrainerData';
import { getImmersionStrings } from '../immersion';
import { buildOfflineTranslation, getTranslatorLanguagePair, translateCourseText } from '../courseTranslator';
import { PORTUGUESE_TOPICS } from '../../data/curriculum/portugueseCourse';
import { detectPreferredBrowserLocale, tUi } from '../i18n';
import { fetchAdminQuotas } from '../telemetry';
import { DEFAULT_BILLING_CONFIG, resolveUserEntitlements } from '../subscriptionEngine';
import type { LanguageCode, UserProfile } from '../../types/learning';

describe('v9.0.0 Features — 16 Languages, 150 Units & YouTube Study Lab', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('supports RTL for both Arabic and Hebrew and strips Hebrew Niqqud cleanly', () => {
    expect(isRtlLanguage('ar')).toBe(true);
    expect(isRtlLanguage('he')).toBe(true);
    expect(isRtlLanguage('tr')).toBe(false);
    expect(isRtlLanguage('nb')).toBe(false);
    expect(isRtlLanguage('da')).toBe(false);

    expect(stripHebrewNiqqud('שָׁלוֹם')).toBe('שלום');
    expect(stripHebrewNiqqud('תּוֹדָה רַבָּה')).toBe('תודה רבה');
  });

  it('includes complete Hebrew Alefbet + Turkish/Nordic special letters in Script Trainer', () => {
    expect(HEBREW_ALEFBET.length).toBeGreaterThanOrEqual(27);
    expect(TURKISH_SPECIAL_LETTERS.length).toBeGreaterThanOrEqual(7);
    expect(NORDIC_SPECIAL_LETTERS.length).toBeGreaterThanOrEqual(3);
  });

  it('parses YouTube URLs, SRT/VTT transcripts and builds offline study packs', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtu.be/M7lc1UVf-VE?t=12')).toBe('M7lc1UVf-VE');
    expect(extractYouTubeVideoId('https://youtube.com/shorts/abcDEF12345')).toBe('abcDEF12345');
    expect(extractYouTubeVideoId('not-a-valid-youtube-url')).toBeNull();

    const parsed = parseManualTranscript('0:00 Hello world\n0:08 We use connectors naturally.');
    expect(parsed.length).toBe(2);
    expect(parsed[0].startSec).toBe(0);
    expect(parsed[1].startSec).toBe(8);

    const pack = buildOfflineYouTubeStudyPack(
      'dQw4w9WgXcQ',
      'tr',
      'B1',
      '0:00 İstanbul çok güzel bir şehir.',
    );
    expect(pack.subtitles.length).toBe(1);
    expect(pack.grammarInsights.length).toBeGreaterThan(0);
    expect(pack.checkpoints.length).toBeGreaterThan(0);
  });

  it('guarantees zero duplicate titlePt within any of the 17 languages (150 units each)', () => {
    const langs: LanguageCode[] = [
      'en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh',
      'ar', 'nl', 'af', 'sv', 'tr', 'he', 'nb', 'da', 'pt',
    ];
    for (const lang of langs) {
      const topics = ALL_BUILTIN_TOPICS.filter((t) => (t.languageCode ?? 'en') === lang);
      expect(topics.length).toBe(150);
      const uniqueTitles = new Set(topics.map((t) => t.titlePt.trim().toLowerCase()));
      expect(uniqueTitles.size, `Duplicate titlePt in ${lang}`).toBe(150);
    }
  });

  it('injects Hebrew Alefbet script_phonics steps in A1 Hebrew units (P1)', async () => {
    const bundle = await loadLanguageCourseData('he');
    const withScript = bundle.topics.filter((t) =>
      t.steps.some((s) => s.type === 'script_phonics'),
    );
    expect(withScript.length).toBeGreaterThanOrEqual(10);
  });

  it('fetchYouTubeStudyPack uses /api/youtube-study when ok and falls back offline on failure (P1)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            ok: true,
            title: 'Real Video',
            author: 'Channel',
            source: 'youtube-captions',
            subtitles: [
              {
                id: 's1',
                startSec: 0,
                textTarget: 'Shalom haverim',
                textPt: 'Olá amigos',
                tokens: [],
              },
            ],
            grammarInsights: [],
            checkpoints: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    const online = await fetchYouTubeStudyPack({
      url: 'https://youtu.be/M7lc1UVf-VE',
      languageCode: 'he',
      level: 'A1',
    });
    expect(online.title).toBe('Real Video');
    expect(online.subtitles[0].textTarget).toBe('Shalom haverim');

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('Server error', { status: 500 })),
    );
    const offline = await fetchYouTubeStudyPack({
      url: 'https://youtu.be/M7lc1UVf-VE',
      languageCode: 'tr',
      level: 'B1',
      manualTranscript: '0:00 Merhaba dünya',
    });
    expect(offline.source).toBe('manual-transcript');
    expect(offline.subtitles[0].textTarget).toBe('Merhaba dünya');
  });

  it('modular Cloudflare Worker exports valid routes, HTTP 206 Range & v11.6.0 contract (P1)', () => {
    const workerSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/worker.js'),
      'utf8',
    );
    const ytRouteSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/routes/youtubeStudy.js'),
      'utf8',
    );
    const translateRouteSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/routes/translate.js'),
      'utf8',
    );
    const adminQuotasSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/routes/adminQuotas.js'),
      'utf8',
    );
    const mediaRouteSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/routes/media.js'),
      'utf8',
    );
    const billingRouteSrc = fs.readFileSync(
      path.resolve(process.cwd(), 'cloudflare-worker/routes/billing.js'),
      'utf8',
    );
    expect(workerSrc).toContain("version: '11.6.0'");
    expect(workerSrc).toContain("from './routes/youtubeStudy.js'");
    expect(workerSrc).toContain("from './routes/translate.js'");
    expect(workerSrc).toContain("from './routes/adminQuotas.js'");
    expect(workerSrc).toContain("from './routes/media.js'");
    expect(workerSrc).toContain("from './routes/billing.js'");
    expect(workerSrc).toContain('/api/youtube-study');
    expect(workerSrc).toContain('/api/translate');
    expect(workerSrc).toContain('/api/admin/quotas');
    expect(workerSrc).toContain('/api/billing/');
    expect(workerSrc).toContain('/api/media/');
    expect(mediaRouteSrc).toContain('206');
    expect(ytRouteSrc).toContain('handleYouTubeStudyRequest');
    expect(translateRouteSrc).toContain('handleTranslateRequest');
    expect(adminQuotasSrc).toContain('handleAdminQuotasRequest');
    expect(billingRouteSrc).toContain('handleBillingRequest');
  });

  it('keeps full free access for all users when billingEnabled is false and protects school_grant', () => {
    const unlinkedStudent = {
      id: 'stu-free-1',
      name: 'Aluno Livre',
      email: 'livre@example.com',
      password: 'x',
      role: 'student',
      avatarColor: '#116DFF',
      activeLanguage: 'en',
      dialectByLanguage: { en: 'en-US' },
      accent: 'en-US',
      dailyGoalMinutes: 15,
      todayMinutes: 0,
      xp: 0,
      streakDays: 1,
      completedTopicIds: [],
      skillScores: { listening: 50, reading: 50, speaking: 50, writing: 50 },
      vocab: [],
      issuedCertificates: [],
      dailyQuests: { lessonsCompletedToday: 0, vocabReviewedToday: 0, tutorSessionsToday: 0, claimedQuestIds: [] },
      createdAt: '2026-11-26',
    } as UserProfile;

    const freeMode = resolveUserEntitlements(unlinkedStudent, DEFAULT_BILLING_CONFIG);
    expect(freeMode.billingActive).toBe(false);
    expect(freeMode.isFullAccess).toBe(true);
    expect(freeMode.canUseAllLanguages).toBe(true);
    expect(freeMode.canUseMockExams).toBe(true);

    const linkedStudent: UserProfile = {
      ...unlinkedStudent,
      id: 'stu-school-1',
      assignedTeacherId: 'teacher-1',
    };
    const schoolWhenBillingOn = resolveUserEntitlements(linkedStudent, {
      billingEnabled: true,
      provider: 'stripe',
    });
    expect(schoolWhenBillingOn.billingActive).toBe(true);
    expect(schoolWhenBillingOn.isFullAccess).toBe(true);
    expect(schoolWhenBillingOn.effectivePlanId).toBe('school_grant');

    const unlinkedWhenBillingOn = resolveUserEntitlements(unlinkedStudent, {
      billingEnabled: true,
      provider: 'stripe',
    });
    expect(unlinkedWhenBillingOn.billingActive).toBe(true);
    expect(unlinkedWhenBillingOn.isFullAccess).toBe(false);
  });

  it('supports i18n parity across pt/en/es for Auth/Gateway & fetches admin quotas cleanly', async () => {
    expect(tUi('en', 'auth.loginTab')).toBe('Sign In');
    expect(tUi('es', 'gateway.continueWeb')).toBe('Continuar en la Versión Web');
    expect(tUi('en', 'ptBanner.cta')).toBe('Switch UI to English');
    expect(['pt', 'en', 'es']).toContain(detectPreferredBrowserLocale());

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            ok: true,
            date: '2026-11-26',
            days: 7,
            r2Connected: true,
            routes: [
              { key: 'stt', label: 'STT', endpoint: '/api/stt', usedToday: 4, limitPerActor: 200, activeActorsToday: 2, sevenDayTotal: 15 },
            ],
            generatedAt: new Date().toISOString(),
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    const snap = await fetchAdminQuotas(7);
    expect(snap?.ok).toBe(true);
    expect(snap?.routes[0].usedToday).toBe(4);
  });

  it('adapts bidirectional translator pair to active course (PT<->Target, EN<->PT for Portuguese)', async () => {
    const enPair = getTranslatorLanguagePair('en');
    expect(enPair.nativeCode).toBe('pt');
    expect(enPair.targetCode).toBe('en');

    const ptPair = getTranslatorLanguagePair('pt');
    expect(ptPair.nativeCode).toBe('en');
    expect(ptPair.targetCode).toBe('pt');
    expect(ptPair.explanationLang).toBe('en');

    const offlinePt = buildOfflineTranslation({
      text: 'Olá',
      sourceLang: 'pt',
      targetLang: 'en',
      courseCode: 'pt',
      courseVocab: [],
    });
    expect(offlinePt.translatedText.toLowerCase()).toContain('hello');

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('Server error', { status: 500 })),
    );
    const fallbackRes = await translateCourseText({
      text: 'Obrigado',
      sourceLang: 'pt',
      targetLang: 'en',
      courseCode: 'pt',
      courseVocab: [],
    });
    expect(fallbackRes.source).toBe('offline-lexicon');
    expect(fallbackRes.translatedText.toLowerCase()).toContain('thank');
  });

  it('enforces reversed immersion on Portuguese course (A1-B1 English scaffolding, B2-C1 Portuguese)', () => {
    const a1Strings = getImmersionStrings('pt', 'A1');
    const b2Strings = getImmersionStrings('pt', 'B2');
    expect(a1Strings.listeningContext).toContain('Listen carefully');
    expect(b2Strings.listeningContext).toContain('Ouça com atenção');

    const a1Sample = PORTUGUESE_TOPICS.find((t) => t.level === 'A1');
    expect(a1Sample).toBeDefined();
    expect(a1Sample!.subtitle).toMatch(/[a-z]{3,}/i);
  });
});
