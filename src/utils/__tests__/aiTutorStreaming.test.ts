/**
 * @file src/utils/__tests__/aiTutorStreaming.test.ts
 * @description Testes unitários para parsing SSE do Gemini, extração progressiva de replyEn no streaming e fallback gracioso do AITutor.
 * @exports aiTutorStreamingTests
 */
import { describe, expect, it } from 'vitest';
import {
  extractPartialReplyEnFromJsonStream,
  parseSseGeminiChunk,
} from '../aiTutorEngine';

describe('AITutor SSE Streaming Helpers', () => {
  it('parses valid Gemini SSE data lines and ignores empty/[DONE] lines', () => {
    expect(parseSseGeminiChunk('')).toBe('');
    expect(parseSseGeminiChunk('data: [DONE]')).toBe('');
    expect(parseSseGeminiChunk('event: message')).toBe('');
    const line =
      'data: {"candidates":[{"content":{"parts":[{"text":"{\\"replyEn\\":\\"Hello"}]}}]}';
    expect(parseSseGeminiChunk(line)).toBe('{"replyEn":"Hello');
  });

  it('extracts partial replyEn progressively from incomplete JSON buffers with escapes', () => {
    expect(extractPartialReplyEnFromJsonStream('{')).toBeNull();
    expect(extractPartialReplyEnFromJsonStream('{"replyEn":"')).toBeNull();
    expect(extractPartialReplyEnFromJsonStream('{"replyEn":"Good morning')).toBe(
      'Good morning',
    );
    expect(
      extractPartialReplyEnFromJsonStream(
        '{"replyEn":"She said \\"Hi!\\"\\nHow are you?',
      ),
    ).toBe('She said "Hi!"\nHow are you?');
    expect(
      extractPartialReplyEnFromJsonStream(
        '{"replyEn":"Done!","replyPt":"Pronto!"}',
      ),
    ).toBe('Done!');
  });
});
