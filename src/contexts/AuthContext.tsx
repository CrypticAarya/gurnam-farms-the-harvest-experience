import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { getSession, onAuthStateChange, getProfile, Profile, signOutAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch (error) {
      logger.error("[AuthContext] Error fetching profile", { err: String(error) });
      setProfile(null);
    }
  };

  const handleSession = async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    
    if (currentSession?.user) {
      await fetchProfile(currentSession.user.id);
    } else {
      setProfile(null);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const currentSession = await getSession();
        if (mounted) {
          await handleSession(currentSession);
        }
      } catch (error) {
        logger.error("[AuthContext] Failed to get initial session", { err: String(error) });
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const unsubscribe = onAuthStateChange(async (event, currentSession) => {
      logger.info("[AuthContext] Auth state changed", { event });
      if (mounted) {
        // Only set loading to true if we're actually transitioning states significantly
        // This prevents flicker on normal operations
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setIsLoading(true);
        }
        await handleSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutAdmin(); // Maps to supabase.auth.signOut() internally
    } catch (error) {
      logger.error("[AuthContext] Error signing out", { err: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
