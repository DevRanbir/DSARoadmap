'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const emptyObject: Record<string, boolean> = {};

function useFirebaseProgress() {
  const { user } = useAuth();

  // For server-side rendering, return empty object
  const getServerSnapshot = useCallback(() => emptyObject, []);

  // Subscribe to Firebase Realtime Database changes
  const subscribe = useCallback((callback: () => void) => {
    if (!user) {
      return () => {};
    }

    const progressRef = ref(database, `progress/${user.uid}`);
    
    const unsubscribe = onValue(progressRef, (snapshot) => {
      callback();
    });

    // Also listen for custom events (for local updates)
    window.addEventListener('firebase-progress-change', callback);

    return () => {
      off(progressRef);
      window.removeEventListener('firebase-progress-change', callback);
    };
  }, [user]);

  // Get current snapshot from Firebase
  const getSnapshot = useCallback((): Record<string, boolean> => {
    if (typeof window === 'undefined' || !user) {
      return emptyObject;
    }

    // Return cached data if available
    const cached = (window as any).__firebaseProgressCache__;
    if (cached) {
      return cached;
    }
    
    return emptyObject;
  }, [user]);

  const completedTopics = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggleTopic = useCallback(async (key: string) => {
    if (!user) return;

    const progressRef = ref(database, `progress/${user.uid}/${key}`);
    const currentValue = completedTopics[key] || false;
    
    await set(progressRef, !currentValue);
    
    // Update local cache and dispatch event
    const newCache = { ...completedTopics, [key]: !currentValue };
    (window as any).__firebaseProgressCache__ = newCache;
    window.dispatchEvent(new Event('firebase-progress-change'));
  }, [user, completedTopics]);

  const resetProgress = useCallback(async () => {
    if (!user) return;

    const progressRef = ref(database, `progress/${user.uid}`);
    await set(progressRef, null);
    
    // Clear local cache
    (window as any).__firebaseProgressCache__ = {};
    window.dispatchEvent(new Event('firebase-progress-change'));
  }, [user]);

  const setProgress = useCallback(async (data: Record<string, boolean>) => {
    if (!user) return;

    const progressRef = ref(database, `progress/${user.uid}`);
    await set(progressRef, data);
    
    // Update local cache
    (window as any).__firebaseProgressCache__ = data;
    window.dispatchEvent(new Event('firebase-progress-change'));
  }, [user]);

  return { completedTopics, toggleTopic, resetProgress, setProgress };
}

export { useFirebaseProgress };
