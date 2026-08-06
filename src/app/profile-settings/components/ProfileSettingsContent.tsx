'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, Shield, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, KeyRound, Clock, MonitorSmartphone,  } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FormState {
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
  field: 'email' | 'phone' | 'password' | null;
}

export default function ProfileSettingsContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState({
    email: false,
    phone: false,
    password: false,
  });

  const [alert, setAlert] = useState<AlertState>({ type: null, message: '', field: null });
  const [passwordConfirmOpen, setPasswordConfirmOpen] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [lastPasswordChange, setLastPasswordChange] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || user.user_metadata?.phone || '',
      }));
      // Approximate last password change from updated_at
      if (user.updated_at) {
        const date = new Date(user.updated_at);
        setLastPasswordChange(
          date.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
        );
      }
    }
  }, [user]);

  const showAlert = (type: 'success' | 'error', message: string, field: AlertState['field']) => {
    setAlert({ type, message, field });
    setTimeout(() => setAlert({ type: null, message: '', field: null }), 5000);
  };

  const handleUpdateEmail = async () => {
    if (!form.email || form.email === user?.email) return;
    setLoading((l) => ({ ...l, email: true }));
    try {
      const { error } = await supabase.auth.updateUser({ email: form.email });
      if (error) throw error;
      showAlert('success', 'Verification email sent. Check your inbox to confirm the new address.', 'email');
    } catch (err: any) {
      showAlert('error', err.message || 'Failed to update email.', 'email');
    } finally {
      setLoading((l) => ({ ...l, email: false }));
    }
  };

  const handleUpdatePhone = async () => {
    if (!form.phone) return;
    setLoading((l) => ({ ...l, phone: true }));
    try {
      const { error } = await supabase.auth.updateUser({ phone: form.phone });
      if (error) throw error;
      // Also update user_profiles table
      if (user?.id) {
        await supabase.from('user_profiles').update({ phone: form.phone }).eq('id', user.id);
      }
      showAlert('success', 'Phone number updated successfully.', 'phone');
    } catch (err: any) {
      showAlert('error', err.message || 'Failed to update phone number.', 'phone');
    } finally {
      setLoading((l) => ({ ...l, phone: false }));
    }
  };

  const handleUpdatePassword = async () => {
    if (!form.newPassword || !form.confirmPassword) return;
    if (form.newPassword !== form.confirmPassword) {
      showAlert('error', 'New passwords do not match.', 'password');
      return;
    }
    if (form.newPassword.length < 8) {
      showAlert('error', 'Password must be at least 8 characters.', 'password');
      return;
    }
    setPasswordConfirmOpen(true);
  };

  const confirmPasswordChange = async () => {
    setPasswordConfirmOpen(false);
    setLoading((l) => ({ ...l, password: true }));
    try {
      const { error } = await supabase.auth.updateUser({ password: form.newPassword });
      if (error) throw error;
      setPasswordChanged(true);
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setLastPasswordChange(new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }));
      showAlert('success', 'Password changed successfully. You may need to sign in again on other devices.', 'password');
    } catch (err: any) {
      showAlert('error', err.message || 'Failed to update password.', 'password');
    } finally {
      setLoading((l) => ({ ...l, password: false }));
    }
  };

  const passwordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: '', color: '', width: 'w-0' };
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (pwd.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    return { label: 'Good', color: 'bg-primary', width: 'w-3/4' };
  };

  const strength = passwordStrength(form.newPassword);

  const AlertBanner = ({ field }: { field: AlertState['field'] }) => {
    if (alert.field !== field || !alert.type) return null;
    return (
      <div
        className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm mt-3 ${
          alert.type === 'success' ?'bg-green-500/10 border border-green-500/30 text-green-400' :'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}
      >
        {alert.type === 'success' ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
        <span>{alert.message}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account details and security preferences.</p>
      </div>

      {/* Email Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Email Address</h2>
            <p className="text-xs text-muted-foreground">Update your login email. A verification link will be sent.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <AlertBanner field="email" />

        <button
          onClick={handleUpdateEmail}
          disabled={loading.email || !form.email || form.email === user?.email}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading.email ? <Loader2 size={14} className="animate-spin" /> : null}
          Update Email
        </button>
      </div>

      {/* Phone Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Phone size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Phone Number</h2>
            <p className="text-xs text-muted-foreground">Used for account recovery and notifications.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="+234 800 000 0000"
          />
        </div>

        <AlertBanner field="phone" />

        <button
          onClick={handleUpdatePhone}
          disabled={loading.phone || !form.phone}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading.phone ? <Loader2 size={14} className="animate-spin" /> : null}
          Update Phone
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lock size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Change Password</h2>
            <p className="text-xs text-muted-foreground">Use a strong password with letters, numbers, and symbols.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={form.newPassword}
                onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Strength bar */}
            {form.newPassword && (
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs text-muted-foreground">Strength: <span className="text-foreground font-medium">{strength.label}</span></p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> Passwords do not match</p>
            )}
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Passwords match</p>
            )}
          </div>
        </div>

        <AlertBanner field="password" />

        <button
          onClick={handleUpdatePassword}
          disabled={loading.password || !form.newPassword || !form.confirmPassword}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading.password ? <Loader2 size={14} className="animate-spin" /> : null}
          Change Password
        </button>
      </div>

      {/* Account Security Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Account Security</h2>
            <p className="text-xs text-muted-foreground">Overview of your account security status.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Email verified */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Verification</p>
                <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
              </div>
            </div>
            <span className={`badge-base text-xs ${user?.email_confirmed_at ? 'status-completed' : 'status-pending'}`}>
              {user?.email_confirmed_at ? '✓ Verified' : 'Pending'}
            </span>
          </div>

          {/* Last password change */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <KeyRound size={15} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Password Change</p>
                <p className="text-xs text-muted-foreground">
                  {passwordChanged ? 'Just now' : lastPasswordChange || 'Not available'}
                </p>
              </div>
            </div>
            {passwordChanged && (
              <span className="badge-base text-xs status-completed">Updated</span>
            )}
          </div>

          {/* Account created */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-xs text-muted-foreground">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Active sessions */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <MonitorSmartphone size={15} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Active Session</p>
                <p className="text-xs text-muted-foreground">Current device</p>
              </div>
            </div>
            <span className="badge-base text-xs status-completed">Active</span>
          </div>
        </div>
      </div>

      {/* Password Change Confirmation Modal */}
      {passwordConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 modal-backdrop px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Confirm Password Change</h3>
                <p className="text-xs text-muted-foreground">This action will update your password immediately.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to change your password? You may be signed out on other devices after this change.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setPasswordConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordChange}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Yes, Change It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
