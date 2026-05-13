'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, googleProvider, database } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from database
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          setUserProfile(snapshot.val() as UserProfile);
        } else {
          // Create initial profile
          const initialProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            username: user.email?.split('@')[0] || `user_${Date.now()}`
          };
          await set(userRef, initialProfile);
          setUserProfile(initialProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, if not create it
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        const initialProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          username: user.email?.split('@')[0] || `user_${Date.now()}`
        };
        await set(userRef, initialProfile);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUsername = async (username: string) => {
    if (!user) return;
    
    // Check if username is already taken
    const usernamesRef = ref(database, 'usernames');
    const usernameSnapshot = await get(child(usernamesRef, username));
    
    if (usernameSnapshot.exists() && usernameSnapshot.val() !== user.uid) {
      throw new Error('Username is already taken');
    }
    
    // Update username mapping and user profile
    const oldUsername = userProfile?.username;
    
    // Set new username mapping
    await set(ref(database, `usernames/${username}`), user.uid);
    
    // Remove old username mapping if it existed
    if (oldUsername && oldUsername !== username) {
      await set(ref(database, `usernames/${oldUsername}`), null);
    }
    
    // Update user profile
    const updatedProfile = { ...userProfile, username } as UserProfile;
    await set(ref(database, `users/${user.uid}`), updatedProfile);
    setUserProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signOut,
      updateUsername
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
