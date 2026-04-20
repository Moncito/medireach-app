"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { ensureUserDocument } from "@/lib/firebase/user";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Create / update user document in Firestore (non-blocking)
      if (firebaseUser && !firebaseUser.isAnonymous) {
        ensureUserDocument(firebaseUser).catch(() => {
          // Non-critical: profile sync failure doesn't affect auth
        });
      }
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isGuest: !!user?.isAnonymous,
    isAuthenticated: !!user && !user.isAnonymous,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
