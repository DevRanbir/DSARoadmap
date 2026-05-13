'use client';

import { useSyncExternalStore, useCallback, useEffect, useRef, useState } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'dsa-plan-progress-v2';

// Fallback localStorage helpers for offline/unauthenticated use
const emptyObject: Record<string, boolean> = {};

function getLocalStorageSnapshot(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : emptyObject;
  } catch {
    return emptyObject;
  }
}

function saveToLocalStorage(data: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('dsa-progress-change'));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const { user } = useAuth();
  const cacheRef = useRef<Record<string, boolean>>(emptyObject);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Subscribe to Firebase when user is logged in
  useEffect(() => {
    if (!user) {
      cacheRef.current = emptyObject;
      setLoaded(false);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    const progressRef = ref(database, `progress/${user.uid}`);
    
    const unsubscribe = onValue(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        cacheRef.current = snapshot.val();
      } else {
        cacheRef.current = emptyObject;
      }
      setLoaded(true);
      // Trigger re-render
      window.dispatchEvent(new Event('firebase-progress-update'));
    });

    unsubscribeRef.current = () => off(progressRef);
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user]);

  const subscribe = useCallback((callback: () => void) => {
    if (user) {
      window.addEventListener('firebase-progress-update', callback);
      return () => {
        window.removeEventListener('firebase-progress-update', callback);
      };
    } else {
      window.addEventListener('storage', callback);
      window.addEventListener('dsa-progress-change', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('dsa-progress-change', callback);
      };
    }
  }, [user]);

  const getSnapshot = useCallback((): Record<string, boolean> => {
    if (user) {
      return cacheRef.current;
    }
    return getLocalStorageSnapshot();
  }, [user]);

  const getServerSnapshot = useCallback(() => emptyObject, []);

  const completedTopics = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTopic = useCallback(async (key: string) => {
    if (user) {
      // Use Firebase
      const progressRef = ref(database, `progress/${user.uid}/${key}`);
      const currentValue = cacheRef.current[key] || false;
      await set(progressRef, !currentValue);
    } else {
      // Fallback to localStorage
      const current = getLocalStorageSnapshot();
      const updated = { ...current, [key]: !current[key] };
      saveToLocalStorage(updated);
    }
  }, [user]);

  const resetProgress = useCallback(async () => {
    if (user) {
      // Use Firebase
      const progressRef = ref(database, `progress/${user.uid}`);
      await set(progressRef, null);
    } else {
      // Fallback to localStorage
      saveToLocalStorage({});
    }
  }, [user]);

  return { completedTopics, toggleTopic, resetProgress, loaded };
}
