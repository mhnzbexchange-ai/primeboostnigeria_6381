'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext<any>({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/Password Sign Up
  const signUp = async (email: string, password: string, metadata: any = {}) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const fullName = [metadata?.firstName, metadata?.lastName].filter(Boolean).join(' ') || metadata?.fullName || '';

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
        emailRedirectTo: `${siteUrl}/auth/callback`
      }
    });

    // Log the response so we can diagnose why emails may not be delivered
    // (This will appear in the browser console for client-side calls)
    // eslint-disable-next-line no-console
    console.log('supabase.signUp response', { data, error });

    if (error) {
      // surface the server message for easier debugging
      throw new Error(error.message || 'Sign up failed');
    }

    // Immediately sign out so the user is NOT auto-logged in before email verification.
    await supabase.auth.signOut();

    // Send branded welcome email via Resend (non-blocking, supplementary)
    // The real verification link comes from Supabase's own email above.
    if (data?.user) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({
            type: 'email_verification',
            to: email,
            name: fullName,
            // Pass the site URL so the email directs them to check their inbox
            link: `${siteUrl}/sign-up-login-screen`,
          }),
        });
      } catch (err) {
        // Non-blocking: Supabase's own verification email is still sent
        // eslint-disable-next-line no-console
        console.warn('branded send-email failed (non-blocking)', err);
      }
    }

    return data;
  };

  // Email/Password Sign In
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Provide a clear message for unverified email
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      throw error;
    }

    // Block login if email is not verified
    if (data?.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    return data;
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    // eslint-disable-next-line no-console
    console.log('supabase.resend response', { data, error });

    if (error) throw new Error(error.message || 'Failed to resend verification email');
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Password Reset — sends branded email via Resend edge function
  const resetPassword = async (email: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Trigger Supabase password reset (generates the secure token)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    // eslint-disable-next-line no-console
    console.log('supabase.resetPasswordForEmail response', { error });

    if (error) throw error;

    // 2. Also send our branded Resend email (best-effort)
    try {
      const resetLink = `${siteUrl}/auth/callback?next=/reset-password`;
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          type: 'password_reset',
          to: email,
          name: '',
          link: resetLink,
        }),
      });
    } catch (err) {
      // Non-blocking: Supabase's own reset email is still sent
      // eslint-disable-next-line no-console
      console.warn('branded reset send-email failed (non-blocking)', err);
    }
  };

  // Get Current User
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  // Check if Email is Verified
  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  // Get User Profile from Database
  const getUserProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const value = {
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
    getUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
