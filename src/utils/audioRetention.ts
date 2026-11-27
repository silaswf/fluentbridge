/**
 * @file src/utils/audioRetention.ts
 * @description Política de retenção automática de áudios Speaking (60 dias): resumo e limpeza preservando feedbacks escritos.
 * @exports AUDIO_RETENTION_DAYS, AUDIO_RETENTION_MS, AudioRetentionSummary, getSubmissionTimestampMs, hasStoredAudioPayload, isSubmissionAudioExpired, getAudioRetentionSummary, AudioPurgeResult (+1)
 */
import type { CloudConfig, StudentSubmission } from '../types/learning';
import { deleteAudioClip } from './audioDb';
import { deleteSpeakingAudiosFromCloud } from './cloudSync';

export const AUDIO_RETENTION_DAYS = 60;
export const AUDIO_RETENTION_MS = AUDIO_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface AudioRetentionSummary {
  totalSpeaking: number;
  activeAudioCount: number;
  expiringWithin7Days: number;
  expiredPendingCount: number;
  archivedCount: number;
  estimatedInlineKb: number;
}

export function getSubmissionTimestampMs(sub: StudentSubmission): number | null {
  if (sub.createdAtIso) {
    const parsed = Date.parse(sub.createdAtIso);
    if (!Number.isNaN(parsed)) return parsed;
  }

  // Fallback for older submissions: `sub-s-1795467304345` or `sub-w-1795467304345`
  const match = /^sub-[sw]-(\d{13})/.exec(sub.id);
  if (match) {
    const ms = Number(match[1]);
    if (Number.isFinite(ms) && ms > 1_500_000_000_000) {
      return ms;
    }
  }

  return null;
}

export function hasStoredAudioPayload(sub: StudentSubmission): boolean {
  return Boolean(sub.audioPath || sub.audioDataUrl || sub.audioId);
}

export function isSubmissionAudioExpired(
  sub: StudentSubmission,
  nowMs = Date.now(),
  retentionDays = AUDIO_RETENTION_DAYS,
): boolean {
  if (sub.type !== 'speaking') return false;
  if (sub.audioArchived) return false;
  if (!hasStoredAudioPayload(sub)) return false;

  const createdMs = getSubmissionTimestampMs(sub);
  if (createdMs === null) return false;

  return nowMs - createdMs >= retentionDays * ONE_DAY_MS;
}

export function getAudioRetentionSummary(
  submissions: StudentSubmission[],
  nowMs = Date.now(),
  retentionDays = AUDIO_RETENTION_DAYS,
): AudioRetentionSummary {
  const retentionMs = retentionDays * ONE_DAY_MS;
  const sevenDaysMs = 7 * ONE_DAY_MS;

  let totalSpeaking = 0;
  let activeAudioCount = 0;
  let expiringWithin7Days = 0;
  let expiredPendingCount = 0;
  let archivedCount = 0;
  let inlineBytes = 0;

  for (const sub of submissions) {
    if (sub.type !== 'speaking') continue;
    totalSpeaking += 1;

    if (sub.audioArchived) {
      archivedCount += 1;
      continue;
    }

    if (!hasStoredAudioPayload(sub)) continue;
    activeAudioCount += 1;
    if (sub.audioDataUrl) {
      inlineBytes += sub.audioDataUrl.length;
    }

    const ts = getSubmissionTimestampMs(sub);
    if (ts !== null) {
      const age = nowMs - ts;
      if (age >= retentionMs) {
        expiredPendingCount += 1;
      } else if (age >= retentionMs - sevenDaysMs) {
        expiringWithin7Days += 1;
      }
    }
  }

  return {
    totalSpeaking,
    activeAudioCount,
    expiringWithin7Days,
    expiredPendingCount,
    archivedCount,
    estimatedInlineKb: Math.round(inlineBytes / 1024),
  };
}

export interface AudioPurgeResult {
  nextSubmissions: StudentSubmission[];
  purgedCount: number;
  cloudDeletedCount: number;
  localDeletedCount: number;
}

/**
 * Purges expired (> 60 days) Speaking audio files from Supabase Storage (`fb-audio`),
 * local IndexedDB (`fluentbridge_audio_v1`), and inline `audioDataUrl`,
 * while 100% preserving written feedback, transcripts, scores, rubrics, and badges.
 */
export async function purgeExpiredSpeakingAudios(
  submissions: StudentSubmission[],
  cloudConfig?: CloudConfig,
  options?: { nowMs?: number; retentionDays?: number; skipSideEffects?: boolean },
): Promise<AudioPurgeResult> {
  const nowMs = options?.nowMs ?? Date.now();
  const retentionDays = options?.retentionDays ?? AUDIO_RETENTION_DAYS;
  const expired = submissions.filter((s) =>
    isSubmissionAudioExpired(s, nowMs, retentionDays),
  );

  if (expired.length === 0) {
    return {
      nextSubmissions: submissions,
      purgedCount: 0,
      cloudDeletedCount: 0,
      localDeletedCount: 0,
    };
  }

  let cloudDeletedCount = 0;
  let localDeletedCount = 0;

  if (!options?.skipSideEffects) {
    const cloudPaths = expired
      .map((s) => s.audioPath)
      .filter((p): p is string => Boolean(p && p.trim()));

    if (cloudPaths.length > 0) {
      const res = await deleteSpeakingAudiosFromCloud(cloudPaths, cloudConfig);
      if (res.ok) {
        cloudDeletedCount = res.deleted;
      }
    }

    const localIds = expired
      .map((s) => s.audioId)
      .filter((id): id is string => Boolean(id && id.trim()));

    for (const clipId of localIds) {
      try {
        await deleteAudioClip(clipId);
        localDeletedCount += 1;
      } catch {
        // Ignore best-effort IndexedDB cleanup failure
      }
    }
  }

  const expiredIds = new Set(expired.map((s) => s.id));
  const expiredIso = new Date(nowMs).toISOString();

  const nextSubmissions = submissions.map((sub) => {
    if (!expiredIds.has(sub.id)) return sub;
    return {
      ...sub,
      audioId: undefined,
      audioPath: undefined,
      audioDataUrl: undefined,
      audioArchived: true,
      audioExpiredAt: expiredIso,
    };
  });

  return {
    nextSubmissions,
    purgedCount: expired.length,
    cloudDeletedCount,
    localDeletedCount,
  };
}
