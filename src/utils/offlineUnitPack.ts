/**
 * @file src/utils/offlineUnitPack.ts
 * @description Download e cache local das próximas unidades e níveis CEFR completos (áudios TTS + ilustrações de conceitos em Cache API) para estudo offline.
 * @exports OFFLINE_PACK_CACHE_NAME, getConceptImageUrl, getCachedOfflineUnits, markUnitsOffline, downloadNextUnitsOffline, downloadCefrLevelOfflinePack, getOfflinePackStats, clearOfflinePackCache
 */
import type { CEFRLevel, Topic, VocabCard } from '../types/learning';
import { fetchNeuralTtsBlob } from './speech';

const OFFLINE_UNITS_KEY = 'fb_offline_units_v1';
export const OFFLINE_PACK_CACHE_NAME = 'fb-offline-packs-v1';

export function getConceptImageUrl(
  conceptId?: string,
  explicitUrl?: string,
): string | null {
  if (typeof explicitUrl === 'string' && explicitUrl.trim()) {
    return explicitUrl.trim();
  }
  if (typeof conceptId === 'string' && conceptId.trim()) {
    const clean = conceptId.trim();
    if (
      clean.startsWith('http://') ||
      clean.startsWith('https://') ||
      clean.startsWith('/')
    ) {
      return clean;
    }
    return `/concepts/${encodeURIComponent(clean)}.svg`;
  }
  return null;
}

export function getCachedOfflineUnits(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(OFFLINE_UNITS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function markUnitsOffline(topicIds: string[]): string[] {
  const merged = Array.from(new Set([...getCachedOfflineUnits(), ...topicIds]));
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(OFFLINE_UNITS_KEY, JSON.stringify(merged));
    } catch {
      // Ignore storage quota errors
    }
  }
  return merged;
}

async function downloadUnitsBatchOffline(
  units: Topic[],
  vocab: VocabCard[],
  dialectCode: string,
  onProgress?: (done: number, total: number, currentTitle: string) => void,
): Promise<{ cachedTopicIds: string[]; audioCount: number; imageCount: number }> {
  const audioItems: Array<{ text: string; topicTitle: string }> = [];
  const seenTexts = new Set<string>();
  const imageItems: Array<{ url: string; topicTitle: string }> = [];
  const seenImages = new Set<string>();

  const pushAudio = (text: string | undefined, topicTitle: string) => {
    const clean = text?.trim();
    if (!clean || seenTexts.has(clean)) return;
    seenTexts.add(clean);
    audioItems.push({ text: clean, topicTitle });
  };

  const pushImage = (url: string | null, topicTitle: string) => {
    if (!url || seenImages.has(url)) return;
    seenImages.add(url);
    imageItems.push({ url, topicTitle });
  };

  for (const unit of units) {
    pushImage(getConceptImageUrl(unit.coverConceptId, unit.coverImageUrl), unit.titlePt);

    const unitVocab = vocab.filter((v) => v.topicId === unit.id).slice(0, 6);
    for (const card of unitVocab) {
      pushAudio(card.word, unit.titlePt);
      pushAudio(card.exampleEn, unit.titlePt);
      pushImage(getConceptImageUrl(card.visualConceptId, card.imageUrl), unit.titlePt);
    }
    for (const step of unit.steps) {
      if (step.type === 'listening') {
        pushAudio(step.audioText, unit.titlePt);
      } else if (step.type === 'speaking') {
        pushAudio(step.targetSentence, unit.titlePt);
      } else if (step.type === 'picture_choice') {
        pushAudio(step.audioText, unit.titlePt);
        for (const opt of step.options) {
          pushImage(getConceptImageUrl(opt.conceptId, opt.imageUrl), unit.titlePt);
        }
      }
    }
  }

  let done = 0;
  let audioCount = 0;
  let imageCount = 0;
  const total = audioItems.length + imageItems.length;
  const concurrency = 2;

  for (let i = 0; i < audioItems.length; i += concurrency) {
    const slice = audioItems.slice(i, i + concurrency);
    await Promise.all(
      slice.map(async (item) => {
        try {
          const blob = await fetchNeuralTtsBlob(item.text, dialectCode);
          if (blob) audioCount += 1;
        } catch {
          // Best-effort offline prefetch
        } finally {
          done += 1;
          onProgress?.(done, total, item.topicTitle);
        }
      }),
    );
  }

  const cacheApi = typeof caches !== 'undefined' ? await caches.open(OFFLINE_PACK_CACHE_NAME).catch(() => null) : null;
  for (let i = 0; i < imageItems.length; i += concurrency) {
    const slice = imageItems.slice(i, i + concurrency);
    await Promise.all(
      slice.map(async (item) => {
        try {
          if (cacheApi && typeof fetch !== 'undefined') {
            const res = await fetch(item.url);
            if (res.ok) {
              await cacheApi.put(item.url, res);
              imageCount += 1;
            }
          }
        } catch {
          // Best-effort concept illustration prefetch
        } finally {
          done += 1;
          onProgress?.(done, total, item.topicTitle);
        }
      }),
    );
  }

  const cachedIds = units.map((u) => u.id);
  markUnitsOffline(cachedIds);
  return { cachedTopicIds: cachedIds, audioCount, imageCount };
}

export async function downloadNextUnitsOffline(
  topics: Topic[],
  vocab: VocabCard[],
  completedTopicIds: string[],
  dialectCode: string,
  count = 3,
  onProgress?: (done: number, total: number, currentTitle: string) => void,
): Promise<{ cachedTopicIds: string[]; audioCount: number; imageCount: number }> {
  const completedSet = new Set(completedTopicIds);
  const nextUnits = topics.filter((t) => !completedSet.has(t.id)).slice(0, count);
  return downloadUnitsBatchOffline(nextUnits, vocab, dialectCode, onProgress);
}

export async function downloadCefrLevelOfflinePack(
  topics: Topic[],
  vocab: VocabCard[],
  level: CEFRLevel,
  dialectCode: string,
  onProgress?: (done: number, total: number, currentTitle: string) => void,
): Promise<{ cachedTopicIds: string[]; audioCount: number; imageCount: number }> {
  const levelUnits = topics.filter((t) => t.level === level);
  return downloadUnitsBatchOffline(levelUnits, vocab, dialectCode, onProgress);
}

export async function getOfflinePackStats(): Promise<{
  cachedUnits: number;
  estimatedKb: number;
}> {
  const cachedUnits = getCachedOfflineUnits().length;
  let cacheBytes = 0;

  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(OFFLINE_PACK_CACHE_NAME);
      const keys = await cache.keys();
      for (const req of keys) {
        const res = await cache.match(req);
        if (!res) continue;
        const cl = Number(res.headers.get('Content-Length') || 0);
        if (cl > 0) {
          cacheBytes += cl;
        } else {
          const buf = await res.clone().arrayBuffer().catch(() => null);
          cacheBytes += buf ? buf.byteLength : 8192;
        }
      }
    } catch {
      // Ignore Cache API read errors
    }
  }

  const estimatedKb = Math.round(cacheBytes / 1024) + cachedUnits * 24;
  return { cachedUnits, estimatedKb };
}

export async function clearOfflinePackCache(): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(OFFLINE_UNITS_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  if (typeof caches !== 'undefined') {
    try {
      await caches.delete(OFFLINE_PACK_CACHE_NAME);
    } catch {
      // Ignore Cache API errors
    }
  }
}
