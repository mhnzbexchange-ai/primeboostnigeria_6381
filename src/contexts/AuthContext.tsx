'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: any
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to load Supabase session:', error);

        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // =========================
  // SIGN UP
  // =========================

  const signUp = async (
    email: string,
    password: string,
    metadata: any = {}
  ) => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : '');

    const fullName =
      [metadata?.firstName, metadata?.lastName]
        .filter(Boolean)
        .join(' ') ||
      metadata?.fullName ||
      '';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          full_name: fullName,
          first_name: metadata?.firstName || '',
          last_name: metadata?.lastName || '',
          avatar_url: metadata?.avatarUrl || '',
          referral_code: metadata?.referralCode || '',
        },

        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    console.log('Supabase signUp response:', {
      data,
      error,
    });

    if (error) {
      throw new Error(error.message || 'Sign up failed');
    }

    /*
     * If email verification is enabled,
     * Supabase may return a user without a session.
     *
     * We intentionally do not force a sign-out here.
     */
    if (data?.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return data;
  };

  // =========================
  // SIGN IN
  // =========================

  const signIn = async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      if (
        error.message
          ?.toLowerCase()
          .includes('email not confirmed')
      ) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      throw new Error(
        error.message || 'Unable to sign in'
      );
    }

    if (!data.user || !data.session) {
      throw new Error(
        'Login succeeded but no session was created. Please try again.'
      );
    }

    // Block login if email is not verified.
    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();

      setSession(null);
      setUser(null);

      throw new Error('EMAIL_NOT_VERIFIED');
    }

    /*
     * IMPORTANT:
     * Update the local auth state immediately.
     */
    setSession(data.session);
    setUser(data.user);

    return data;
  };

  // =========================
  // RESEND VERIFICATION
  // =========================

  const resendVerificationEmail = async (
    email: string
  ) => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : '');

    const { data, error } =
      await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),

        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

    console.log(
      'Supabase resend response:',
      { data, error }
    );

    if (error) {
      throw new Error(
        error.message ||
          'Failed to resend verification email'
      );
    }
  };

  // =========================
  // SIGN OUT
  // =========================

  const signOut = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
  };

  // =========================
  // PASSWORD RESET
  // =========================

  const resetPassword = async (
    email: string
  ) => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : '');

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            `${siteUrl}/auth/callback?next=/reset-password`,
        }
      );

    console.log(
      'Supabase password reset response:',
      { error }
    );

    if (error) {
      throw error;
    }
  };

  // =========================
  // CURRENT USER
  // =========================

  const getCurrentUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  };

  // =========================
  // EMAIL VERIFIED
  // =========================

  const isEmailVerified = () => {
    return !!user?.email_confirmed_at;
  };

  // =========================
  // USER PROFILE
  // =========================

  const getUserProfile = async () => {
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendVerificationEmail,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};