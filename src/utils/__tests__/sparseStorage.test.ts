import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE, ALL_INITIAL_VOCABULARY } from '../../data/lessons';
import {
  compactPlatformStateForStorage,
  normalizePlatformState,
} from '../storage';

describe('Sparse vocabulary storage compaction', () => {
  it('strips untouched vocab cards on save and re-hydrates the full deck on load', () => {
    const base = normalizePlatformState(
      DEFAULT_PLATFORM_STATE,
      DEFAULT_PLATFORM_STATE,
      ALL_INITIAL_VOCABULARY,
    );
    expect(base.users[0].vocab.length).toBe(ALL_INITIAL_VOCABULARY.length);

    // Simulate reviewing 2 cards
    const withProgress = {
      ...base,
      users: base.users.map((u, idx) =>
        idx === 0
          ? {
              ...u,
              vocab: u.vocab.map((c, cIdx) =>
                cIdx < 2
                  ? { ...c, reviewCount: 3, strength: 'medium' as const }
                  : c,
              ),
            }
          : u,
      ),
    };

    const compacted = compactPlatformStateForStorage(withProgress);
    expect(compacted.users[0].vocab.length).toBeLessThan(
      ALL_INITIAL_VOCABULARY.length / 10,
    );
    expect(compacted.users[0].vocab.some((c) => c.reviewCount === 3)).toBe(true);

    const rehydrated = normalizePlatformState(
      compacted,
      DEFAULT_PLATFORM_STATE,
      ALL_INITIAL_VOCABULARY,
    );
    expect(rehydrated.users[0].vocab.length).toBe(ALL_INITIAL_VOCABULARY.length);
    expect(rehydrated.users[0].vocab[0].reviewCount).toBe(3);
  });
});
