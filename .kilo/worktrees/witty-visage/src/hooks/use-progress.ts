'use client';

import { useSyncExternalStore, useCallback, useRef } from 'react';

const STORAGE_KEY = 'dsa-plan-progress-v2';

// Cached snapshots to avoid infinite loops with useSyncExternalStore
let cachedSnapshot: Record<string, boolean> | null = null;
let cachedSnapshotJSON: string = '';

const emptyObject: Record<string, boolean> = {};

function getSnapshot(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const json = stored || '';
    if (json === cachedSnapshotJSON && cachedSnapshot !== null) {
      return cachedSnapshot;
    }
    cachedSnapshotJSON = json;
    cachedSnapshot = json ? JSON.parse(json) : emptyObject;
    return cachedSnapshot;
  } catch {
    return cachedSnapshot || emptyObject;
  }
}

function getServerSnapshot(): Record<string, boolean> {
  return emptyObject;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  window.addEventListener('dsa-progress-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('dsa-progress-change', callback);
  };
}

function saveToStorage(data: Record<string, boolean>) {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    // Invalidate cache so next getSnapshot reads fresh data
    cachedSnapshotJSON = '';
    cachedSnapshot = null;
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('dsa-progress-change'));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const completedTopics = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTopic = useCallback((key: string) => {
    const current = getSnapshot();
    const updated = { ...current, [key]: !current[key] };
    saveToStorage(updated);
  }, []);

  const resetProgress = useCallback(() => {
    saveToStorage({});
  }, []);

  return { completedTopics, toggleTopic, resetProgress };
}
