import { describe, expect, it } from 'vitest';
import { getTeacherDisplayName } from '../teacherDisplay';
import { analyzePhoneticFeedback } from '../phoneticFeedback';
import {
  getMonthlyChallengeForLanguage,
  moderateCommunityText,
} from '../communityEngine';
import { acceptCorrectionReply, togglePostReaction } from '../communityActions';
import type { CommunityPost, LanguageCode } from '../../types/learning';

describe('v8.4.0 Features', () => {
  it('resolves teacher display name with TeacherStudio override and signup fallback', () => {
    expect(
      getTeacherDisplayName(
        { name: 'Silas', teacherDisplayName: 'Silas Wagner', isMasterAdmin: true },
        'Prof. Silas',
      ),
    ).toBe('Silas Wagner');

    expect(
      getTeacherDisplayName(
        { name: 'Silas', isMasterAdmin: true },
        'Silas Wagner (Master)',
      ),
    ).toBe('Silas Wagner (Master)');

    expect(
      getTeacherDisplayName({ name: 'Maria Oliveira', isMasterAdmin: false }, 'Escola'),
    ).toBe('Maria Oliveira');
  });

  it('produces phonemeBreakdown chips in analyzePhoneticFeedback across languages', () => {
    const enRes = analyzePhoneticFeedback(
      'I think these three things work',
      'I tink dese tree tings work',
      'en',
    );
    expect(enRes.phonemeBreakdown.length).toBeGreaterThan(0);
    expect(enRes.phonemeBreakdown[0]).toHaveProperty('symbol');
    expect(enRes.phonemeBreakdown[0]).toHaveProperty('status');

    const jaRes = analyzePhoneticFeedback('おはようございます', 'おはよう', 'ja');
    expect(jaRes.phonemeBreakdown.length).toBeGreaterThan(0);
  });

  it('moderates profanity, spam links and excessive caps in CommunityHub', () => {
    expect(moderateCommunityText('Olá turma, alguém quer praticar?').allowed).toBe(true);
    expect(moderateCommunityText('Acesse https://spam.example.com agora').allowed).toBe(false);
    expect(moderateCommunityText('Você é um idiota').allowed).toBe(false);
    expect(moderateCommunityText('AAAAAAAAAAAAAAAAAAAA').allowed).toBe(false);
  });

  it('generates monthly challenges for all 12 languages and mutates reactions/corrections', () => {
    const langs: LanguageCode[] = [
      'en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh', 'ar', 'nl', 'af', 'sv',
    ];
    for (const lang of langs) {
      const ch = getMonthlyChallengeForLanguage(lang);
      expect(ch.xpReward).toBe(80);
      expect(ch.goalXp).toBe(150);
      expect(ch.id).toContain(lang);
    }

    const posts: CommunityPost[] = [
      {
        id: 'p1',
        languageCode: 'en',
        authorId: 'u1',
        authorName: 'Ana',
        authorAvatarColor: '#116DFF',
        authorRole: 'student',
        level: 'A2',
        category: 'correction',
        title: 'Ajuda com frase',
        body: 'Está certo?',
        targetSnippet: 'I go to school yesterday.',
        likes: [],
        replies: [
          {
            id: 'r1',
            authorId: 'u2',
            authorName: 'Carlos',
            authorAvatarColor: '#10B981',
            authorRole: 'student',
            content: 'Use o passado!',
            correctionSuggestion: 'I went to school yesterday.',
            likes: [],
            createdAt: '2026-11-26',
          },
        ],
        createdAt: '2026-11-26',
      },
    ];

    const reacted = togglePostReaction(posts, 'p1', '🔥', 'u2');
    expect(reacted[0].reactions?.['🔥']).toEqual(['u2']);
    const unreacted = togglePostReaction(reacted, 'p1', '🔥', 'u2');
    expect(unreacted[0].reactions?.['🔥']).toBeUndefined();

    const accepted = acceptCorrectionReply(reacted, 'p1', 'r1');
    expect(accepted[0].acceptedReplyId).toBe('r1');
  });
});
