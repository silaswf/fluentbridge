/**
 * @file src/utils/offlineUnitPack.ts
 * @description Download e cache local das próximas unidades da trilha para estudo offline.
 * @exports getCachedOfflineUnits, markUnitsOffline, downloadNextUnitsOffline
 */
import type { Topic, VocabCard } from '../types/learning';
import { fetchNeuralTtsBlob } from './speech';

const OFFLINE_UNITS_KEY = 'fb_offline_units_v1';

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

export async function downloadNextUnitsOffline(
  topics: Topic[],
  vocab: VocabCard[],
  completedTopicIds: string[],
  dialectCode: string,
  count = 3,
  onProgress?: (done: number, total: number, currentTitle: string) => void,
): Promise<{ cachedTopicIds: string[]; audioCount: number }> {
  const completedSet = new Set(completedTopicIds);
  const nextUnits = topics.filter((t) => !completedSet.has(t.id)).slice(0, count);

  const items: Array<{ text: string; topicTitle: string }> = [];
  for (const unit of nextUnits) {
    const unitVocab = vocab.filter((v) => v.topicId === unit.id).slice(0, 6);
    for (const card of unitVocab) {
      items.push({ text: card.word, topicTitle: unit.titlePt });
      items.push({ text: card.exampleEn, topicTitle: unit.titlePt });
    }
    for (const step of unit.steps) {
      if (step.type === 'listening') {
        items.push({ text: step.audioText, topicTitle: unit.titlePt });
      } else if (step.type === 'speaking') {
        items.push({ text: step.targetSentence, topicTitle: unit.titlePt });
      }
    }
  }

  let done = 0;
  let audioCount = 0;
  const total = items.length;
  const concurrency = 2;

  for (let i = 0; i < items.length; i += concurrency) {
    const slice = items.slice(i, i + concurrency);
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

  const cachedIds = nextUnits.map((u) => u.id);
  markUnitsOffline(cachedIds);
  return { cachedTopicIds: cachedIds, audioCount };
}
