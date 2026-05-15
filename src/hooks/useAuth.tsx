import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      // Eski dinleyiciyi temizle
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        unsubscribeProfile = onSnapshot(
          userDoc,
          async (snapshot) => {
            const email = currentUser.email;
            const role: UserRole = 'admin';

            if (snapshot.exists()) {
              const data = snapshot.data();
              if (data.role !== 'admin') {
                await setDoc(userDoc, { ...data, role: 'admin' }, { merge: true });
              }
              setProfile({
                uid: currentUser.uid,
                email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role,
              });
            } else {
              await setDoc(userDoc, {
                uid: currentUser.uid,
                email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role,
              });
              setProfile({
                uid: currentUser.uid,
                email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role,
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error('Profile snapshot error:', error);
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {loading ? (
        <div className="min-h-screen bg-[#071a33] flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 border-4 border-amber/20 border-t-amber rounded-full animate-spin"></div>
          <div className="mt-6 font-medium tracking-widest text-xs uppercase text-amber/60">MK Hukuk Güvenlik Kontrolü</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
