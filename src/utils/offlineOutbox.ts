/**
 * @file src/utils/offlineOutbox.ts
 * @description Fila offline persistente (outbox) para lições, revisões SM-2 e checkpoints, com drenagem automática ao reconectar.
 * @exports OutboxKind, OutboxItem, listOutboxItems, getPendingOutboxCount, enqueueOfflineMutation, clearOfflineOutbox, flushOfflineOutbox, flushProgressOutbox
 */
export type OutboxKind =
  | 'lesson_complete'
  | 'srs_review'
  | 'checkpoint'
  | 'telemetry';

export interface OutboxItem {
  id: string;
  kind: OutboxKind;
  payload: Record<string, unknown>;
  createdAt: string;
}

const OUTBOX_STORAGE_KEY = 'fb_offline_outbox_v1';
const DB_NAME = 'fluentbridge_outbox_db';
const STORE_NAME = 'outbox';
let memoryFallback: OutboxItem[] = [];

function readFallbackList(): OutboxItem[] {
  if (typeof localStorage === 'undefined') return [...memoryFallback];
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    if (!raw) return [...memoryFallback];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OutboxItem[]) : [];
  } catch {
    return [...memoryFallback];
  }
}

function writeFallbackList(items: OutboxItem[]): void {
  memoryFallback = [...items];
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

function openOutboxDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function listOutboxItems(): Promise<OutboxItem[]> {
  const db = await openOutboxDb();
  if (!db) return readFallbackList();
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = Array.isArray(req.result) ? (req.result as OutboxItem[]) : [];
        resolve(rows);
      };
      req.onerror = () => resolve(readFallbackList());
    } catch {
      resolve(readFallbackList());
    }
  });
}

export async function getPendingOutboxCount(): Promise<number> {
  const items = await listOutboxItems();
  return items.length;
}

export async function enqueueOfflineMutation(
  kind: OutboxKind,
  payload: Record<string, unknown>,
): Promise<OutboxItem> {
  const item: OutboxItem = {
    id: `ob-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    payload,
    createdAt: new Date().toISOString(),
  };

  const current = readFallbackList();
  writeFallbackList([...current, item].slice(-200));

  const db = await openOutboxDb();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  return item;
}

export async function clearOfflineOutbox(): Promise<void> {
  writeFallbackList([]);
  const db = await openOutboxDb();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export async function flushOfflineOutbox(
  handler: (item: OutboxItem) => Promise<boolean>,
): Promise<{ flushed: number; remaining: number }> {
  const items = await listOutboxItems();
  if (items.length === 0) return { flushed: 0, remaining: 0 };

  const failed: OutboxItem[] = [];
  let flushed = 0;

  for (const item of items) {
    try {
      const ok = await handler(item);
      if (ok) {
        flushed++;
      } else {
        failed.push(item);
      }
    } catch {
      failed.push(item);
    }
  }

  writeFallbackList(failed);
  const db = await openOutboxDb();
  if (db) {
    await new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        for (const rem of failed) {
          store.put(rem);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  return { flushed, remaining: failed.length };
}

export async function flushProgressOutbox(handlers: {
  onTelemetry: (item: OutboxItem) => Promise<boolean>;
  onSyncProgressBatch: (items: OutboxItem[]) => Promise<boolean>;
}): Promise<{ flushed: number; remaining: number }> {
  const items = await listOutboxItems();
  if (items.length === 0) return { flushed: 0, remaining: 0 };

  const progressItems = items.filter((i) => i.kind !== 'telemetry');
  let progressBatchOk = true;
  if (progressItems.length > 0) {
    try {
      progressBatchOk = await handlers.onSyncProgressBatch(progressItems);
    } catch {
      progressBatchOk = false;
    }
  }

  return flushOfflineOutbox(async (item) => {
    if (item.kind === 'telemetry') {
      return handlers.onTelemetry(item);
    }
    return progressBatchOk;
  });
}
