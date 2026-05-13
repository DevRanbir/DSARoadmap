'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, remove, get, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { sendBindInviteEmail, sendBindAcceptedEmail } from '@/lib/email';

export interface BindUser {
  username: string;
  uid: string;
  status: 'pending' | 'accepted' | 'sent';
  createdAt: number;
}

export interface Notification {
  id: string;
  type: 'bind_invite' | 'bind_accepted' | 'mail';
  from: string;
  fromUid: string;
  message: string;
  time: number;
  read: boolean;
}

// ─── Binds ───────────────────────────────────────────────────────────────────

export function useFirebaseBinds() {
  const { user, userProfile } = useAuth();
  const [binds, setBinds] = useState<BindUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBinds([]);
      setLoading(false);
      return;
    }

    const bindsRef = ref(database, `binds/${user.uid}`);
    const unsubscribe = onValue(bindsRef, (snapshot) => {
      if (snapshot.exists()) {
        const bindsData: BindUser[] = [];
        snapshot.forEach((child) => {
          bindsData.push({ ...child.val(), username: child.key });
        });
        setBinds(bindsData);
      } else {
        setBinds([]);
      }
      setLoading(false);
    });

    return () => off(bindsRef);
  }, [user]);

  const sendBindRequest = useCallback(async (targetUsername: string) => {
    if (!user || !userProfile) return;

    // Resolve username → uid
    const usernameSnap = await get(ref(database, `usernames/${targetUsername}`));
    if (!usernameSnap.exists()) {
      throw new Error('User not found');
    }

    const targetUid = usernameSnap.val() as string;

    if (targetUid === user.uid) {
      throw new Error('Cannot bind with yourself');
    }

    // Check if already bound / pending
    const existingSnap = await get(ref(database, `binds/${user.uid}/${targetUsername}`));
    if (existingSnap.exists()) {
      throw new Error('Already bound or request already sent');
    }

    // Create bind entries
    await set(ref(database, `binds/${user.uid}/${targetUsername}`), {
      uid: targetUid,
      status: 'sent',
      createdAt: Date.now(),
    });
    await set(ref(database, `binds/${targetUid}/${userProfile.username}`), {
      uid: user.uid,
      status: 'pending',
      createdAt: Date.now(),
    });

    // In-app notification for target
    const newNotifRef = push(ref(database, `notifications/${targetUid}`));
    await set(newNotifRef, {
      type: 'bind_invite',
      from: userProfile.username,
      fromUid: user.uid,
      message: `${userProfile.username} wants to bind with you`,
      time: Date.now(),
      read: false,
    });

    // Email notification — fetch target's email settings
    const targetSettingsSnap = await get(ref(database, `userSettings/${targetUid}`));
    if (targetSettingsSnap.exists()) {
      const settings = targetSettingsSnap.val();
      if (settings.mailUpdates !== false && settings.emails?.length > 0) {
        await sendBindInviteEmail(
          settings.emails[0],
          targetUsername,
          userProfile.username,
          user.displayName || undefined,
        );
      }
    }
  }, [user, userProfile]);

  const acceptBind = useCallback(async (fromUsername: string, fromUid: string) => {
    if (!user || !userProfile) return;

    // Update both bind statuses
    await set(ref(database, `binds/${user.uid}/${fromUsername}`), {
      uid: fromUid,
      status: 'accepted',
      createdAt: Date.now(),
    });
    await set(ref(database, `binds/${fromUid}/${userProfile.username}`), {
      uid: user.uid,
      status: 'accepted',
      createdAt: Date.now(),
    });

    // In-app notification for the original sender
    const newNotifRef = push(ref(database, `notifications/${fromUid}`));
    await set(newNotifRef, {
      type: 'bind_accepted',
      from: userProfile.username,
      fromUid: user.uid,
      message: `${userProfile.username} accepted your bind request`,
      time: Date.now(),
      read: false,
    });

    // Email notification — fetch sender's email settings
    const senderSettingsSnap = await get(ref(database, `userSettings/${fromUid}`));
    if (senderSettingsSnap.exists()) {
      const settings = senderSettingsSnap.val();
      if (settings.mailUpdates !== false && settings.emails?.length > 0) {
        // Also need the sender's username
        const senderProfileSnap = await get(ref(database, `users/${fromUid}`));
        const senderUsername = senderProfileSnap.exists() ? senderProfileSnap.val().username : fromUsername;
        await sendBindAcceptedEmail(
          settings.emails[0],
          senderUsername,
          userProfile.username,
          user.displayName || undefined,
        );
      }
    }
  }, [user, userProfile]);

  const removeBind = useCallback(async (targetUsername: string, targetUid: string) => {
    if (!user || !userProfile) return;
    await remove(ref(database, `binds/${user.uid}/${targetUsername}`));
    await remove(ref(database, `binds/${targetUid}/${userProfile.username}`));
  }, [user, userProfile]);

  return { binds, loading, sendBindRequest, acceptBind, removeBind };
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useFirebaseNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const notificationsRef = ref(database, `notifications/${user.uid}`);
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const notifsData: Notification[] = [];
        snapshot.forEach((child) => {
          notifsData.push({ id: child.key || '', ...child.val() });
        });
        notifsData.sort((a, b) => b.time - a.time);
        setNotifications(notifsData);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => off(notificationsRef);
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;
    await set(ref(database, `notifications/${user.uid}/${notificationId}/read`), true);
  }, [user]);

  const clearAll = useCallback(async () => {
    if (!user) return;
    await remove(ref(database, `notifications/${user.uid}`));
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, markAsRead, clearAll, unreadCount };
}
