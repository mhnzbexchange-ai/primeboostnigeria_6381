'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Loader2,
  X,
  Mail,
  CheckCircle,
  AlertTriangle,
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
  // GOOGLE SIGN IN
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
    <>
      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">
          OR
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
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 border border-border bg-background hover:bg-muted/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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

            Continue with Google
          </>
        )}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">

      {/* LEFT BRAND PANEL */}

      <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-2/5 p-12 relative overflow-hidden bg-card border-r border-border">

        <div className="absolute inset-0 hero-glow" />

        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background:
              'var(--primary)',
          }}
        />

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={40} />

            <span className="font-bold text-lg gold-gradient-text tracking-wide">
              PrimeBoost Nigeria
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Grow Your
            <br />

            <span className="gold-gradient-text">
              Social Media
            </span>

            <br />

            Presence Fast.
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
            Join 47,000+ Nigerians using PrimeBoost to build their audience, increase engagement, and unlock brand opportunities.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">

            {[
              {
                value: '47K+',
                label: 'Active Users',
              },
              {
                value: '380K+',
                label: 'Orders Fulfilled',
              },
              {
                value: '₦2.4B+',
                label: 'Value Delivered',
              },
              {
                value: '4.9/5',
                label: 'Customer Rating',
              },
            ].map((s) => (
              <div
                key={`auth-stat-${s.label.replace(/\s/g, '-')}`}
                className="glass-card p-3 rounded-xl"
              >
                <div className="font-extrabold text-xl gold-gradient-text tabular-nums">
                  {s.value}
                </div>

                <div className="text-xs text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}

          </div>

          <div className="glass-card p-4 rounded-xl border border-primary/20">

            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map(
                (s) => (
                  <Star
                    key={`auth-star-${s}`}
                    size={12}
                    className="text-primary fill-primary"
                  />
                )
              )}
            </div>

            <p className="text-sm text-muted-foreground italic mb-3">
              &ldquo;PrimeBoost took my TikTok from 2K to 45K followers. Now I get paid brand deals!&rdquo;
            </p>

            <p className="text-xs font-semibold">
              Chinyere Okonkwo · TikTok Creator
            </p>

          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            🇳🇬 Proudly Nigerian · Naira Payments · 24/7 Support
          </p>
        </div>

      </div>

      {/* RIGHT FORM PANEL */}

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">

        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <AppLogo size={36} />

            <span className="font-bold text-base gold-gradient-text tracking-wide">
              PrimeBoost Nigeria
            </span>
          </div>

          <div className="text-center mb-8">

            <h1 className="text-2xl font-extrabold mb-2">
              {tab === 'login'
                ? 'Welcome Back'
                : 'Create Account'}
            </h1>

            <p className="text-sm text-muted-foreground">
              {tab === 'login'
                ? 'Sign in to your PrimeBoost account'
                : "Join Nigeria's top promotion platform"}
            </p>

          </div>

          {/* TABS */}

          <div className="flex bg-muted/40 rounded-xl p-1 mb-8">

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
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'gold-gradient-bg text-primary-foreground shadow-gold-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login'
                  ? 'Sign In'
                  : 'Register'}
              </button>

            ))}

          </div>

          {/* EMAIL VERIFICATION */}

          {registeredEmail &&
            tab === 'register' && (

              <div className="glass-card border border-primary/30 rounded-xl p-5 mb-6 text-center">

                <CheckCircle
                  size={36}
                  className="text-primary mx-auto mb-3"
                />

                <h3 className="font-bold text-base mb-2">
                  Check Your Email
                </h3>

                <p className="text-sm text-muted-foreground mb-1">
                  We sent a verification link to
                </p>

                <p className="text-sm font-semibold text-primary mb-3">
                  {registeredEmail}
                </p>

                <p className="text-xs text-muted-foreground">
                  Click the link in the email to verify your account, then sign in.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setRegisteredEmail(null);
                    setTab('login');
                  }}
                  className="mt-4 text-xs text-primary hover:underline"
                >
                  Go to Sign In →
                </button>

              </div>
            )}

          {/* LOGIN */}

          {tab === 'login' && (

            <form
              onSubmit={loginForm.handleSubmit(
                onLoginSubmit
              )}
              className="space-y-5"
            >

              {unverifiedEmail && (

                <div className="glass-card border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-4">

                  <div className="flex items-start gap-3">

                    <AlertTriangle
                      size={18}
                      className="text-yellow-400 flex-shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-semibold text-yellow-400 mb-1">
                        Email not verified
                      </p>

                      <p className="text-xs text-muted-foreground mb-3">
                        Please verify{' '}
                        <span className="text-foreground font-medium">
                          {unverifiedEmail}
                        </span>{' '}
                        before signing in.
                      </p>

                      {resendSent ? (

                        <p className="text-xs text-green-400 flex items-center gap-1.5">
                          <CheckCircle size={13} />
                          Verification email sent — check your inbox.
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
                          className="text-xs text-primary hover:underline flex items-center gap-1.5 disabled:opacity-60"
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

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
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

                  <p className="text-red-400 text-xs mt-1">
                    {
                      loginForm.formState
                        .errors.email.message
                    }
                  </p>

                )}

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium mb-1.5">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    className="input-field pr-10"
                    placeholder="Your password"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

                {loginForm.formState
                  .errors.password && (

                  <p className="text-red-400 text-xs mt-1">
                    {
                      loginForm.formState
                        .errors.password.message
                    }
                  </p>

                )}

              </div>

              {/* REMEMBER / FORGOT */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border"
                    {...loginForm.register(
                      'remember'
                    )}
                  />

                  <span className="text-sm text-muted-foreground">
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowForgotModal(true)
                  }
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              {/* SIGN IN */}

              <button
                type="submit"
                disabled={
                  loading ||
                  googleLoading
                }
                className="btn-primary w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  minHeight: '44px',
                }}
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
                    <ArrowRight size={16} />
                  </>
                )}

              </button>

              <GoogleButton />

            </form>
          )}

          {/* REGISTER */}

          {tab === 'register' &&
            !registeredEmail && (

              <form
                onSubmit={registerForm.handleSubmit(
                  onRegisterSubmit
                )}
                className="space-y-4"
              >

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="block text-sm font-medium mb-1.5">
                      First Name
                    </label>

                    <input
                      type="text"
                      className="input-field"
                      placeholder="Adaeze"
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

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-1.5">
                      Last Name
                    </label>

                    <input
                      type="text"
                      className="input-field"
                      placeholder="Chukwu"
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

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@example.com"
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

                </div>

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      className="input-field pr-10"
                      placeholder="Min 8 characters"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      className="input-field pr-10"
                      placeholder="Repeat password"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-1.5">
                    Referral Code{' '}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="PRIME-XXXXX"
                    {...registerForm.register(
                      'referralCode'
                    )}
                  />

                </div>

                <label className="flex items-start gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border mt-0.5"
                    {...registerForm.register(
                      'terms',
                      {
                        required:
                          'You must accept the terms',
                      }
                    )}
                  />

                  <span className="text-xs text-muted-foreground">
                    I agree to the{' '}

                    <a
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </a>{' '}

                    and{' '}

                    <a
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>

                </label>

                {registerForm.formState
                  .errors.terms && (

                  <p className="text-red-400 text-xs">
                    {
                      registerForm.formState
                        .errors.terms.message
                    }
                  </p>

                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="btn-primary w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    minHeight: '44px',
                  }}
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
                      <ArrowRight size={16} />
                    </>
                  )}

                </button>

                <GoogleButton />

              </form>
            )}

        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}

      {showForgotModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-lg font-bold">
                Reset Password
              </h2>

              <button
                type="button"
                onClick={closeForgotModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <X size={18} />
              </button>

            </div>

            {forgotSent ? (

              <div className="text-center py-4">

                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">

                  <Mail
                    size={28}
                    className="text-primary"
                  />

                </div>

                <h3 className="font-bold text-base mb-2">
                  Email Sent!
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  We sent a password reset link to your email address. Check your inbox and follow the instructions.
                </p>

                <p className="text-xs text-muted-foreground mb-5">
                  Didn&apos;t receive it? Check your spam folder or try again.
                </p>

                <button
                  type="button"
                  onClick={
                    closeForgotModal
                  }
                  className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
                >
                  Done
                </button>

              </div>

            ) : (

              <>

                <p className="text-sm text-muted-foreground mb-5">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form
                  onSubmit={forgotForm.handleSubmit(
                    onForgotSubmit
                  )}
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-sm font-medium mb-1.5">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
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

                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                        <ArrowRight size={16} />
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