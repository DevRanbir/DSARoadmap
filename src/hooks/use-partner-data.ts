'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useFirebaseBinds } from './use-firebase-binds';

export interface PartnerProfile {
  username: string;
  uid: string;
  photoURL: string | null;
  displayName: string | null;
  progress: Record<string, boolean>;
  loading: boolean;
}

// Singleton cache so all components share the same data
const cache: Record<string, PartnerProfile> = {};
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

function loadPartner(username: string, uid: string) {
  if (cache[username] && !cache[username].loading) return;

  cache[username] = { username, uid, photoURL: null, displayName: null, progress: {}, loading: true };
  notify();

  // Real-time progress listener
  const progressRef = ref(database, `progress/${uid}`);
  const userRef = ref(database, `users/${uid}`);

  let profileLoaded = false;
  let progressLoaded = false;

  const checkDone = () => {
    if (profileLoaded && progressLoaded) {
      cache[username] = { ...cache[username], loading: false };
      notify();
    }
  };

  onValue(progressRef, (snap) => {
    cache[username] = {
      ...cache[username],
      progress: snap.exists() ? snap.val() : {},
    };
    progressLoaded = true;
    checkDone();
    notify();
  });

  onValue(userRef, (snap) => {
    if (snap.exists()) {
      const profile = snap.val();
      cache[username] = {
        ...cache[username],
        photoURL: profile.photoURL || null,
        displayName: profile.displayName || null,
      };
    }
    profileLoaded = true;
    checkDone();
    notify();
  });
}

export function usePartnerData() {
  const { binds } = useFirebaseBinds();
  const [, forceUpdate] = useState(0);

  const acceptedBinds = binds.filter(b => b.status === 'accepted');

  // Register listener for re-renders
  useEffect(() => {
    const fn = () => forceUpdate(n => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  // Start loading any new partners
  useEffect(() => {
    for (const bind of acceptedBinds) {
      loadPartner(bind.username, bind.uid);
    }
  }, [acceptedBinds.map(b => b.uid).join(',')]);

  const partnerProgressMap: Record<string, Record<string, boolean>> = {};
  const partnerPhotoMap: Record<string, string | null> = {};

  for (const bind of acceptedBinds) {
    const p = cache[bind.username];
    partnerProgressMap[bind.username] = p?.progress || {};
    partnerPhotoMap[bind.username] = p?.photoURL ?? null;
  }

  return { partnerProgressMap, partnerPhotoMap, cache };
}
