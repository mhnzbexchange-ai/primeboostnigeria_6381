'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  X,
  Mail,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLogo from '@/components/ui/AppLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  terms: boolean;
};

type ForgotForm = {
  email: string;
};

export default function AuthScreen() {
  const [tab, setTab] =
    useState<'login' | 'register'>('login');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [showForgotModal, setShowForgotModal] =
    useState(false);

  const [forgotLoading, setForgotLoading] =
    useState(false);

  const [forgotSent, setForgotSent] =
    useState(false);

  const [registeredEmail, setRegisteredEmail] =
    useState<string | null>(null);

  const [unverifiedEmail, setUnverifiedEmail] =
    useState<string | null>(null);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendSent, setResendSent] =
    useState(false);

  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    resendVerificationEmail,
    getCurrentUser,
  } = useAuth();

  const router = useRouter();

  const loginForm =
    useForm<LoginForm>({
      defaultValues: {
        remember: false,
      },
    });

  const registerForm =
    useForm<RegisterForm>();

  const forgotForm =
    useForm<ForgotForm>();

  // ========================================
  // GOOGLE
  // ========================================

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error(
        'Google authentication error:',
        error
      );

      toast.error(
        error?.message ||
          'Unable to continue with Google. Please try again.'
      );

      setGoogleLoading(false);
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  const onLoginSubmit = async (
    data: LoginForm
  ) => {
    setLoading(true);
    setUnverifiedEmail(null);
    setResendSent(false);

    try {
      await signIn(
        data.email,
        data.password
      );

      toast.success(
        'Welcome back! Redirecting...'
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      const currentUser =
        await getCurrentUser();

      if (!currentUser) {
        throw new Error(
          'Login succeeded, but your session could not be established. Please try again.'
        );
      }

      router.replace('/user-dashboard');

    } catch (error: any) {
      console.error(
        'Login error:',
        error
      );

      if (
        error?.message ===
        'EMAIL_NOT_VERIFIED'
      ) {
        setUnverifiedEmail(
          data.email
        );
      } else {
        toast.error(
          error?.message ||
            'Invalid credentials. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // REGISTER
  // ========================================

  const onRegisterSubmit = async (
    data: RegisterForm
  ) => {
    if (
      data.password !==
      data.confirmPassword
    ) {
      toast.error(
        'Passwords do not match'
      );
      return;
    }

    setLoading(true);

    try {
      await signUp(
        data.email,
        data.password,
        {
          firstName:
            data.firstName,

          lastName:
            data.lastName,

          referralCode:
            data.referralCode ||
            undefined,
        }
      );

      setRegisteredEmail(
        data.email
      );

      toast.success(
        'Account created! Please check your email to verify your account.'
      );

    } catch (error: any) {
      console.error(
        'Registration error:',
        error
      );

      toast.error(
        error?.message ||
          'Registration failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FORGOT PASSWORD
  // ========================================

  const onForgotSubmit = async (
    data: ForgotForm
  ) => {
    setForgotLoading(true);

    try {
      await resetPassword(
        data.email
      );

      setForgotSent(true);

    } catch (error: any) {
      toast.error(
        error?.message ||
          'Failed to send reset email. Please try again.'
      );

    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotSent(false);
    forgotForm.reset();
  };

  // ========================================
  // RESEND VERIFICATION
  // ========================================

  const handleResendVerification =
    async () => {
      if (!unverifiedEmail) {
        return;
      }

      setResendLoading(true);

      try {
        await resendVerificationEmail(
          unverifiedEmail
        );

        setResendSent(true);

        toast.success(
          'Verification email sent! Check your inbox.'
        );

      } catch (error: any) {
        toast.error(
          error?.message ||
            'Failed to resend. Please try again.'
        );

      } finally {
        setResendLoading(false);
      }
    };

  // ========================================
  // GOOGLE BUTTON
  // ========================================

  const GoogleButton = () => (
    <div className="mt-5">

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />

        <span className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
          Or continue with
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={
          googleLoading ||
          loading
        }
        className="group w-full min-h-[50px] rounded-xl border border-border bg-background/80 hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 flex items-center justify-center gap-3 text-sm font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >

        {googleLoading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Connecting to Google...
          </>
        ) : (
          <>
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.92c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.92z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 14c-.2-.58-.31-1.2-.31-1.83s.11-1.25.31-1.83V7.81H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.19L6.54 14z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.16 14.63 2.08 12 2.08a9.75 9.75 0 0 0-8.71 5.73L6.54 10.34C7.31 8.03 9.46 6.14 12 6.14z"
                />
              </svg>
            </span>

            <span>
              Continue with Google
            </span>
          </>
        )}

      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">

      {/* ======================================
          PREMIUM BRAND PANEL
      ====================================== */}

      <aside className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden border-r border-border bg-card">

        {/* Background effects */}

        <div className="absolute inset-0 hero-glow opacity-80" />

        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background:
              'var(--primary)',
          }}
        />

        <div
          className="absolute bottom-[-120px] right-[-100px] w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background:
              'var(--primary)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-3 mb-16">

              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />

                <div className="relative">
                  <AppLogo size={44} />
                </div>
              </div>

              <div>
                <div className="font-extrabold text-lg tracking-tight gold-gradient-text">
                  PrimeBoost
                </div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Nigeria
                </div>
              </div>

            </div>

            {/* HEADLINE */}

            <div className="max-w-lg">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">

                <Sparkles size={13} />

                Built for modern creators

              </div>

              <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.08] mb-6">

                Turn your social presence into

                <span className="block gold-gradient-text mt-1">
                  real opportunities.
                </span>

              </h2>

              <p className="text-muted-foreground leading-7 max-w-md text-sm xl:text-base">
                A powerful platform for creators,
                brands and businesses to grow their
                social media presence with confidence.
              </p>

            </div>

            {/* FEATURE CARDS */}

            <div className="grid grid-cols-2 gap-3 mt-10 max-w-md">

              <div className="group rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-all">

                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles
                    size={17}
                    className="text-primary"
                  />
                </div>

                <div className="font-bold text-sm mb-1">
                  Powerful Growth
                </div>

                <div className="text-xs text-muted-foreground leading-5">
                  Tools designed to help your social presence grow.
                </div>

              </div>

              <div className="group rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-all">

                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <ShieldCheck
                    size={17}
                    className="text-primary"
                  />
                </div>

                <div className="font-bold text-sm mb-1">
                  Secure Platform
                </div>

                <div className="text-xs text-muted-foreground leading-5">
                  Your account and payments are protected.
                </div>

              </div>

            </div>

          </div>

          {/* BOTTOM TRUST */}

          <div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground mb-5">

              <span className="flex items-center gap-1.5">
                <CheckCircle
                  size={13}
                  className="text-primary"
                />
                Secure authentication
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle
                  size={13}
                  className="text-primary"
                />
                Naira payments
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle
                  size={13}
                  className="text-primary"
                />
                24/7 support
              </span>

            </div>

            <p className="text-[11px] text-muted-foreground">
              🇳🇬 Proudly built for Nigeria
            </p>

          </div>

        </div>

      </aside>

      {/* ======================================
          FORM AREA
      ====================================== */}

      <main className="flex-1 flex items-center justify-center p-5 sm:p-8 overflow-y-auto">

        <div className="w-full max-w-[460px] py-5">

          {/* MOBILE BRAND */}

          <div className="lg:hidden flex justify-center mb-8">

            <div className="flex items-center gap-3">

              <AppLogo size={40} />

              <div>
                <div className="font-extrabold text-base gold-gradient-text">
                  PrimeBoost
                </div>

                <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Nigeria
                </div>
              </div>

            </div>

          </div>

          {/* FORM HEADER */}

          <div className="text-center mb-7">

            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 mb-4">

              {tab === 'login' ? (
                <Lock
                  size={19}
                  className="text-primary"
                />
              ) : (
                <Sparkles
                  size={19}
                  className="text-primary"
                />
              )}

            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">

              {tab === 'login'
                ? 'Welcome back'
                : 'Create your account'}

            </h1>

            <p className="text-sm text-muted-foreground">

              {tab === 'login'
                ? 'Sign in to continue to your PrimeBoost dashboard.'
                : 'Join PrimeBoost and start building your social presence.'}

            </p>

          </div>

          {/* TABS */}

          <div className="p-1 rounded-2xl bg-muted/50 border border-border mb-7">

            <div className="grid grid-cols-2 gap-1">

              {(
                ['login', 'register'] as const
              ).map((t) => (

                <button
                  key={`tab-${t}`}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setRegisteredEmail(null);
                    setUnverifiedEmail(null);
                    setResendSent(false);
                  }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    tab === t
                      ? 'gold-gradient-bg text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >

                  {t === 'login'
                    ? 'Sign In'
                    : 'Create Account'}

                </button>

              ))}

            </div>

          </div>

          {/* ======================================
              EMAIL VERIFICATION
          ====================================== */}

          {registeredEmail &&
            tab === 'register' && (

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center shadow-sm">

                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                  <CheckCircle
                    size={30}
                    className="text-primary"
                  />

                </div>

                <h3 className="font-extrabold text-lg mb-2">
                  Check your email
                </h3>

                <p className="text-sm text-muted-foreground mb-2">
                  We sent a verification link to
                </p>

                <p className="text-sm font-bold text-primary break-all mb-4">
                  {registeredEmail}
                </p>

                <p className="text-xs text-muted-foreground leading-5">
                  Open the email and click the verification link to activate your account.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setRegisteredEmail(null);
                    setTab('login');
                  }}
                  className="mt-5 text-sm font-semibold text-primary hover:underline"
                >
                  Continue to Sign In →
                </button>

              </div>
            )}

          {/* ======================================
              LOGIN
          ====================================== */}

          {tab === 'login' && (

            <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-xl p-5 sm:p-7">

              {unverifiedEmail && (

                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-5">

                  <div className="flex items-start gap-3">

                    <AlertTriangle
                      size={18}
                      className="text-yellow-400 flex-shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-bold text-yellow-400 mb-1">
                        Email not verified
                      </p>

                      <p className="text-xs text-muted-foreground leading-5 mb-3">
                        Please verify{' '}
                        <span className="font-semibold text-foreground">
                          {unverifiedEmail}
                        </span>{' '}
                        before signing in.
                      </p>

                      {resendSent ? (

                        <p className="text-xs text-green-400 flex items-center gap-1.5">
                          <CheckCircle size={13} />
                          Verification email sent.
                        </p>

                      ) : (

                        <button
                          type="button"
                          onClick={
                            handleResendVerification
                          }
                          disabled={
                            resendLoading
                          }
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 disabled:opacity-60"
                        >

                          {resendLoading && (
                            <Loader2
                              size={12}
                              className="animate-spin"
                            />
                          )}

                          Resend verification email

                        </button>

                      )}

                    </div>

                  </div>

                </div>
              )}

              <form
                onSubmit={loginForm.handleSubmit(
                  onLoginSubmit
                )}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Email address
                  </label>

                  <input
                    type="email"
                    className="input-field w-full rounded-xl"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...loginForm.register(
                      'email',
                      {
                        required:
                          'Email is required',

                        pattern: {
                          value:
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message:
                            'Enter a valid email',
                        },
                      }
                    )}
                  />

                  {loginForm.formState
                    .errors.email && (

                    <p className="text-red-400 text-xs mt-1.5">
                      {
                        loginForm.formState
                          .errors.email.message
                      }
                    </p>

                  )}

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-xs font-bold uppercase tracking-wide">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowForgotModal(true)
                      }
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      className="input-field w-full rounded-xl pr-11"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...loginForm.register(
                        'password',
                        {
                          required:
                            'Password is required',

                          minLength: {
                            value: 6,
                            message:
                              'Min 6 characters',
                          },
                        }
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                    >

                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}

                    </button>

                  </div>

                  {loginForm.formState
                    .errors.password && (

                    <p className="text-red-400 text-xs mt-1.5">
                      {
                        loginForm.formState
                          .errors.password.message
                      }
                    </p>

                  )}

                </div>

                {/* REMEMBER */}

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border accent-primary"
                    {...loginForm.register(
                      'remember'
                    )}
                  />

                  <span className="text-xs text-muted-foreground">
                    Keep me signed in
                  </span>

                </label>

                {/* SIGN IN */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="btn-primary w-full min-h-[50px] rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={17} />
                    </>
                  )}

                </button>

                <GoogleButton />

                {/* TRUST */}

                <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-muted-foreground">

                  <ShieldCheck size={13} />

                  Secure sign-in powered by PrimeBoost

                </div>

              </form>

            </div>
          )}

          {/* ======================================
              REGISTER
          ====================================== */}

          {tab === 'register' &&
            !registeredEmail && (

              <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-xl p-5 sm:p-7">

                <form
                  onSubmit={registerForm.handleSubmit(
                    onRegisterSubmit
                  )}
                  className="space-y-4"
                >

                  {/* NAME */}

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                        First name
                      </label>

                      <input
                        type="text"
                        className="input-field w-full rounded-xl"
                        placeholder="Adaeze"
                        autoComplete="given-name"
                        {...registerForm.register(
                          'firstName',
                          {
                            required:
                              'First name is required',

                            minLength: {
                              value: 2,
                              message:
                                'Too short',
                            },
                          }
                        )}
                      />

                      {registerForm.formState
                        .errors.firstName && (

                        <p className="text-red-400 text-xs mt-1.5">
                          {
                            registerForm.formState
                              .errors.firstName.message
                          }
                        </p>

                      )}

                    </div>

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                        Last name
                      </label>

                      <input
                        type="text"
                        className="input-field w-full rounded-xl"
                        placeholder="Chukwu"
                        autoComplete="family-name"
                        {...registerForm.register(
                          'lastName',
                          {
                            required:
                              'Last name is required',

                            minLength: {
                              value: 2,
                              message:
                                'Too short',
                            },
                          }
                        )}
                      />

                      {registerForm.formState
                        .errors.lastName && (

                        <p className="text-red-400 text-xs mt-1.5">
                          {
                            registerForm.formState
                              .errors.lastName.message
                          }
                        </p>

                      )}

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                      Email address
                    </label>

                    <input
                      type="email"
                      className="input-field w-full rounded-xl"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...registerForm.register(
                        'email',
                        {
                          required:
                            'Email is required',

                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              'Enter a valid email',
                          },
                        }
                      )}
                    />

                    {registerForm.formState
                      .errors.email && (

                      <p className="text-red-400 text-xs mt-1.5">
                        {
                          registerForm.formState
                            .errors.email.message
                        }
                      </p>

                    )}

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        className="input-field w-full rounded-xl pr-11"
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        {...registerForm.register(
                          'password',
                          {
                            required:
                              'Password is required',

                            minLength: {
                              value: 8,
                              message:
                                'Min 8 characters',
                            },
                          }
                        )}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                      >

                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                      </button>

                    </div>

                    {registerForm.formState
                      .errors.password && (

                      <p className="text-red-400 text-xs mt-1.5">
                        {
                          registerForm.formState
                            .errors.password.message
                        }
                      </p>

                    )}

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                      Confirm password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        className="input-field w-full rounded-xl pr-11"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        {...registerForm.register(
                          'confirmPassword',
                          {
                            required:
                              'Please confirm your password',
                          }
                        )}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                      >

                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                      </button>

                    </div>

                    {registerForm.formState
                      .errors.confirmPassword && (

                      <p className="text-red-400 text-xs mt-1.5">
                        {
                          registerForm.formState
                            .errors.confirmPassword.message
                        }
                      </p>

                    )}

                  </div>

                  {/* REFERRAL */}

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                      Referral code{' '}
                      <span className="normal-case tracking-normal text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      className="input-field w-full rounded-xl"
                      placeholder="PRIME-XXXXX"
                      {...registerForm.register(
                        'referralCode'
                      )}
                    />

                  </div>

                  {/* TERMS */}

                  <div>

                    <label className="flex items-start gap-2.5 cursor-pointer">

                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border mt-0.5 accent-primary flex-shrink-0"
                        {...registerForm.register(
                          'terms',
                          {
                            required:
                              'You must accept the terms',
                          }
                        )}
                      />

                      <span className="text-xs text-muted-foreground leading-5">

                        I agree to the{' '}

                        <a
                          href="/terms"
                          className="text-primary font-semibold hover:underline"
                        >
                          Terms of Service
                        </a>{' '}

                        and{' '}

                        <a
                          href="/privacy"
                          className="text-primary font-semibold hover:underline"
                        >
                          Privacy Policy
                        </a>

                      </span>

                    </label>

                    {registerForm.formState
                      .errors.terms && (

                      <p className="text-red-400 text-xs mt-1.5">
                        {
                          registerForm.formState
                            .errors.terms.message
                        }
                      </p>

                    )}

                  </div>

                  {/* CREATE ACCOUNT */}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      googleLoading
                    }
                    className="btn-primary w-full min-h-[50px] rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                  >

                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={17} />
                      </>
                    )}

                  </button>

                  <GoogleButton />

                  <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-muted-foreground">

                    <ShieldCheck size={13} />

                    Your information is protected

                  </div>

                </form>

              </div>
            )}

          {/* FOOTER */}

          <p className="text-center text-[11px] text-muted-foreground mt-6">
            By continuing, you agree to PrimeBoost Nigeria's
            terms and privacy policy.
          </p>

        </div>

      </main>

      {/* ======================================
          FORGOT PASSWORD MODAL
      ====================================== */}

      {showForgotModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-5">

              <div>

                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                  Account recovery
                </p>

                <h2 className="text-xl font-black">
                  Reset password
                </h2>

              </div>

              <button
                type="button"
                onClick={closeForgotModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted"
              >
                <X size={18} />
              </button>

            </div>

            {forgotSent ? (

              <div className="text-center py-5">

                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">

                  <Mail
                    size={28}
                    className="text-primary"
                  />

                </div>

                <h3 className="font-black text-lg mb-2">
                  Check your inbox
                </h3>

                <p className="text-sm text-muted-foreground leading-6 mb-4">
                  We sent a password reset link to your email address.
                </p>

                <p className="text-xs text-muted-foreground mb-6">
                  If you don't see it, check your spam or junk folder.
                </p>

                <button
                  type="button"
                  onClick={
                    closeForgotModal
                  }
                  className="btn-primary w-full min-h-[46px] rounded-xl text-sm font-bold"
                >
                  Done
                </button>

              </div>

            ) : (

              <>

                <p className="text-sm text-muted-foreground leading-6 mb-5">
                  Enter the email connected to your PrimeBoost account and we'll send you a secure password reset link.
                </p>

                <form
                  onSubmit={forgotForm.handleSubmit(
                    onForgotSubmit
                  )}
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                      Email address
                    </label>

                    <input
                      type="email"
                      className="input-field w-full rounded-xl"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...forgotForm.register(
                        'email',
                        {
                          required:
                            'Email is required',

                          pattern: {
                            value:
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              'Enter a valid email',
                          },
                        }
                      )}
                    />

                    {forgotForm.formState
                      .errors.email && (

                      <p className="text-red-400 text-xs mt-1.5">
                        {
                          forgotForm.formState
                            .errors.email.message
                        }
                      </p>

                    )}

                  </div>

                  <button
                    type="submit"
                    disabled={
                      forgotLoading
                    }
                    className="btn-primary w-full min-h-[48px] rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                  >

                    {forgotLoading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={17} />
                      </>
                    )}

                  </button>

                </form>

              </>

            )}

          </div>

        </div>
      )}

    </div>
  );
}