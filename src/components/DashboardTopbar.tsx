'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


interface DashboardTopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  isAdmin?: boolean;
}

const notifications = [
  { id: 'notif-001', title: 'Order #ORD-7821 completed', time: '2 mins ago', read: false, type: 'success' },
  { id: 'notif-002', title: 'Wallet funded — ₦5,000 added', time: '1 hr ago', read: false, type: 'wallet' },
  { id: 'notif-003', title: 'Referral bonus — ₦500 earned', time: '3 hrs ago', read: false, type: 'referral' },
  { id: 'notif-004', title: 'Order #ORD-7819 is processing', time: '5 hrs ago', read: true, type: 'info' },
  { id: 'notif-005', title: 'New promo: 20% off Instagram services', time: '1 day ago', read: true, type: 'promo' },
];

export default function DashboardTopbar({ onMenuClick, isAdmin = false }: DashboardTopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const displayName = isAdmin
    ? 'Admin User'
    : (user?.user_metadata?.full_name ||
       [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(' ') ||
       user?.email?.split('@')[0] ||
       'User');

  const initials = isAdmin
    ? 'AD'
    : displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0]?.toUpperCase())
        .join('') || 'U';

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0 relative z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-64">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search orders, services..."
            className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-card animate-slide-down z-50">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="badge-base status-pending">{unreadCount} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-gold">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex gap-3 p-3 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-primary' : 'bg-muted'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="text-xs text-primary hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-tight">{displayName}</p>
              <p className="text-xs text-muted-foreground leading-tight">{isAdmin ? 'Administrator' : 'Member'}</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-card animate-slide-down z-50">
              <div className="p-2 space-y-0.5">
                <Link href="/user-dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors">
                  <User size={14} className="text-muted-foreground" />
                  Profile
                </Link>
                <Link href="/user-dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors">
                  <Settings size={14} className="text-muted-foreground" />
                  Settings
                </Link>
                {!isAdmin && (
                  <Link href="/admin-dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-primary">
                    <Shield size={14} />
                    Admin Panel
                  </Link>
                )}
                <hr className="border-border my-1" />
                <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-red-400">
                  <LogOut size={14} />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}