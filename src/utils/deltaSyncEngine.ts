/**
 * @file src/utils/deltaSyncEngine.ts
 * @description Motor de sincronização incremental (Delta Sync) por entidade do PlatformState com rastreamento de timestamps sujos e resolução de conflitos LWW por updatedAt.
 * @exports DeltaSyncEntityKey, EntityDelta, PlatformStateDelta, recordEntityDirtyTimestamp, getEntityDirtyTimestamps, clearEntityDirtyTimestamps, resolveConflictByUpdatedAt, computePlatformStateDelta, applyPlatformStateDelta
 */
import type { PlatformState } from '../types/learning';

export type DeltaSyncEntityKey =
  | 'users'
  | 'classes'
  | 'submissions'
  | 'assignments'
  | 'communityPosts'
  | 'liveSessions';

const ENTITY_KEYS: DeltaSyncEntityKey[] = [
  'users',
  'classes',
  'submissions',
  'assignments',
  'communityPosts',
  'liveSessions',
];

const DELETED_ID_FIELD_MAP: Partial<
  Record<
    DeltaSyncEntityKey,
    | 'deletedUserIds'
    | 'deletedClassIds'
    | 'deletedAssignmentIds'
    | 'deletedCommunityPostIds'
    | 'deletedLiveSessionIds'
  >
> = {
  users: 'deletedUserIds',
  classes: 'deletedClassIds',
  assignments: 'deletedAssignmentIds',
  communityPosts: 'deletedCommunityPostIds',
  liveSessions: 'deletedLiveSessionIds',
};

export interface EntityDelta<T extends { id: string } = { id: string }> {
  upserted: T[];
  deletedIds: string[];
}

export interface PlatformStateDelta {
  computedAt: string;
  dirtyTimestamps: Partial<Record<DeltaSyncEntityKey, Record<string, string>>>;
  entities: Partial<Record<DeltaSyncEntityKey, EntityDelta<any>>>;
  scalarChanges?: Partial<
    Pick<
      PlatformState,
      'schoolName' | 'teacherName' | 'teacherAccessCode' | 'currentUserId'
    >
  >;
}

const DIRTY_TIMESTAMPS_KEY = 'fb_delta_dirty_timestamps_v1';
const memoryDirtyTimestamps: Partial<
  Record<DeltaSyncEntityKey, Record<string, string>>
> = {};

function persistDirtyTimestamps(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DIRTY_TIMESTAMPS_KEY,
      JSON.stringify(memoryDirtyTimestamps),
    );
  } catch {
    // Ignore storage quota errors
  }
}

export function recordEntityDirtyTimestamp(
  entity: DeltaSyncEntityKey,
  id: string,
  timestamp = new Date().toISOString(),
): string {
  if (!memoryDirtyTimestamps[entity]) {
    memoryDirtyTimestamps[entity] = {};
  }
  memoryDirtyTimestamps[entity]![id] = timestamp;
  persistDirtyTimestamps();
  return timestamp;
}

export function getEntityDirtyTimestamps(
  entity?: DeltaSyncEntityKey,
): Partial<Record<DeltaSyncEntityKey, Record<string, string>>> | Record<string, string> {
  if (entity) {
    return { ...(memoryDirtyTimestamps[entity] ?? {}) };
  }
  const copy: Partial<Record<DeltaSyncEntityKey, Record<string, string>>> = {};
  for (const key of ENTITY_KEYS) {
    if (memoryDirtyTimestamps[key]) {
      copy[key] = { ...memoryDirtyTimestamps[key] };
    }
  }
  return copy;
}

export function clearEntityDirtyTimestamps(): void {
  for (const key of ENTITY_KEYS) {
    delete memoryDirtyTimestamps[key];
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(DIRTY_TIMESTAMPS_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}

export function resolveConflictByUpdatedAt<
  T extends { id: string; updatedAt?: string; createdAt?: string; submittedAt?: string },
>(existing: T | undefined, incoming: T | undefined): T | undefined {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const existingTs = existing.updatedAt || existing.submittedAt || existing.createdAt || '';
  const incomingTs = incoming.updatedAt || incoming.submittedAt || incoming.createdAt || '';

  if (!existingTs && !incomingTs) {
    return incoming;
  }
  return incomingTs >= existingTs ? incoming : existing;
}

export function computePlatformStateDelta(
  prev: PlatformState,
  next: PlatformState,
): PlatformStateDelta {
  const computedAt = new Date().toISOString();
  const entities: Partial<Record<DeltaSyncEntityKey, EntityDelta<any>>> = {};
  const dirtyTimestamps: Partial<Record<DeltaSyncEntityKey, Record<string, string>>> = {};

  for (const key of ENTITY_KEYS) {
    const prevList = (prev[key] ?? []) as Array<{ id: string; updatedAt?: string }>;
    const nextList = (next[key] ?? []) as Array<{ id: string; updatedAt?: string }>;

    const prevMap = new Map(prevList.map((item) => [item.id, item]));
    const nextMap = new Map(nextList.map((item) => [item.id, item]));

    const upserted: Array<{ id: string }> = [];
    for (const item of nextList) {
      const oldItem = prevMap.get(item.id);
      if (!oldItem || JSON.stringify(oldItem) !== JSON.stringify(item)) {
        upserted.push(item);
        const ts = item.updatedAt || computedAt;
        if (!dirtyTimestamps[key]) dirtyTimestamps[key] = {};
        dirtyTimestamps[key]![item.id] = ts;
      }
    }

    const deletedSet = new Set<string>();
    for (const oldItem of prevList) {
      if (!nextMap.has(oldItem.id)) {
        deletedSet.add(oldItem.id);
      }
    }

    const deletedField = DELETED_ID_FIELD_MAP[key];
    if (deletedField) {
      const prevDeleted = new Set(prev[deletedField] ?? []);
      for (const id of next[deletedField] ?? []) {
        if (!prevDeleted.has(id)) deletedSet.add(id);
      }
    }

    const deletedIds = Array.from(deletedSet);
    if (upserted.length > 0 || deletedIds.length > 0) {
      entities[key] = { upserted, deletedIds };
    }
  }

  const scalarChanges: PlatformStateDelta['scalarChanges'] = {};
  if (prev.schoolName !== next.schoolName) scalarChanges.schoolName = next.schoolName;
  if (prev.teacherName !== next.teacherName) scalarChanges.teacherName = next.teacherName;
  if (prev.teacherAccessCode !== next.teacherAccessCode) {
    scalarChanges.teacherAccessCode = next.teacherAccessCode;
  }
  if (prev.currentUserId !== next.currentUserId) {
    scalarChanges.currentUserId = next.currentUserId;
  }

  return {
    computedAt,
    dirtyTimestamps,
    entities,
    ...(Object.keys(scalarChanges).length > 0 ? { scalarChanges } : {}),
  };
}

export function applyPlatformStateDelta(
  base: PlatformState,
  delta: PlatformStateDelta,
): PlatformState {
  const next: PlatformState = {
    ...base,
    ...(delta.scalarChanges ?? {}),
  };

  for (const key of ENTITY_KEYS) {
    const entityDelta = delta.entities[key];
    if (!entityDelta) continue;

    const currentList = (base[key] ?? []) as Array<{
      id: string;
      updatedAt?: string;
      createdAt?: string;
      submittedAt?: string;
    }>;
    const itemMap = new Map(currentList.map((item) => [item.id, item]));

    for (const delId of entityDelta.deletedIds) {
      itemMap.delete(delId);
    }

    for (const incoming of entityDelta.upserted) {
      const existing = itemMap.get(incoming.id);
      const resolved = resolveConflictByUpdatedAt(existing, incoming);
      if (resolved) {
        itemMap.set(incoming.id, resolved);
      }
    }

    (next as unknown as Record<string, unknown>)[key] = Array.from(itemMap.values());

    const deletedField = DELETED_ID_FIELD_MAP[key];
    if (deletedField && entityDelta.deletedIds.length > 0) {
      const mergedDeleted = Array.from(
        new Set([...(base[deletedField] ?? []), ...entityDelta.deletedIds]),
      );
      next[deletedField] = mergedDeleted;
    }
  }

  return next;
}
