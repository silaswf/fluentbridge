import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_STATE } from '../../data/lessons';
import {
  hashPassword,
  normalizePlatformState,
  verifyPassword,
} from '../storage';

describe('storage password hashing & normalization', () => {
  it('hashes plaintext passwords deterministically with fbh1 prefix', () => {
    const h1 = hashPassword('minhaSenha123');
    const h2 = hashPassword('minhaSenha123');
    expect(h1).toMatch(/^fbh1:[0-9a-f]{16}$/);
    expect(h1).toBe(h2);
    expect(hashPassword(h1)).toBe(h1);
  });

  it('verifies both hashed and legacy plaintext passwords accurately', () => {
    const hashed = hashPassword('secreta2026');
    expect(verifyPassword('secreta2026', hashed)).toBe(true);
    expect(verifyPassword('errada', hashed)).toBe(false);
    expect(verifyPassword('legacy', 'legacy')).toBe(true);
    expect(verifyPassword('', hashed)).toBe(false);
  });

  it('always preserves Master Admin silaswf@gmail.com and hashes passwords on normalize', () => {
    const normalized = normalizePlatformState(
      { users: [] },
      DEFAULT_PLATFORM_STATE,
      [],
    );
    const master = normalized.users.find(
      (u) => u.email.toLowerCase() === 'silaswf@gmail.com',
    );
    expect(master).toBeDefined();
    expect(master?.role).toBe('teacher');
    expect(master?.isMasterAdmin).toBe(true);
    expect(master?.password.startsWith('fbh1:')).toBe(true);
    expect(verifyPassword('admin123', master?.password ?? '')).toBe(true);
  });
});
