'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from './ui/AppLogo';
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  History,
  Users,
  Gift,
  HeadphonesIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  BarChart3,
  CreditCard,
  Bell,
  Shield,
  Tag,
  FileText,
  LogOut,
  ArrowDownToLine,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isAdmin?: boolean;
}

const userNavItems = [
  { href: '/user-dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/service-catalog', icon: Package, label: 'Services', badge: null },
  { href: '/order-form', icon: ShoppingCart, label: 'New Order', badge: null },
  { href: '/user-dashboard', icon: History, label: 'Order History', badge: null },
  { href: '/user-dashboard', icon: Wallet, label: 'Wallet', badge: null },
  { href: '/referrals', icon: Gift, label: 'Referrals', badge: null },
  { href: '/payouts', icon: ArrowDownToLine, label: 'Payouts', badge: null },
  { href: '/support-center', icon: HeadphonesIcon, label: 'Support', badge: null },
  { href: '/profile-settings', icon: Settings, label: 'Settings', badge: null },
];

const adminNavItems = [
  { href: '/admin-dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
  { href: '/admin-dashboard', icon: Users, label: 'Users', badge: null },
  { href: '/admin-dashboard', icon: Package, label: 'Services', badge: null },
  { href: '/admin-dashboard', icon: ShoppingCart, label: 'Orders', badge: null },
  { href: '/admin-dashboard', icon: CreditCard, label: 'Payments', badge: null },
  { href: '/admin-dashboard', icon: Wallet, label: 'Wallets', badge: null },
  { href: '/admin-dashboard', icon: BarChart3, label: 'Analytics', badge: null },
  { href: '/admin-dashboard', icon: Tag, label: 'Promo Codes', badge: null },
  { href: '/admin-dashboard', icon: Gift, label: 'Referrals', badge: null },
  { href: '/admin-dashboard', icon: Bell, label: 'Broadcast', badge: null },
  { href: '/admin-dashboard', icon: HeadphonesIcon, label: 'Support', badge: null },
  { href: '/admin-dashboard', icon: FileText, label: 'Reports', badge: null },
  { href: '/admin-dashboard', icon: Shield, label: 'Site Settings', badge: null },
];

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const { user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'User';

  const displayEmail = user?.email || '';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase())
    .join('') || 'U';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // signOut navigates away regardless
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const UserProfile = ({ showEmail = true }: { showEmail?: boolean }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
      <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
        {initials}
      </div>
      {showEmail && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
        </div>
      )}
      {showEmail && (
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="p-1 rounded hover:bg-red-400/10 transition-colors"
        >
          <LogOut size={14} className="text-muted-foreground hover:text-red-400" />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col sidebar-transition border-r border-border bg-card
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <AppLogo size={32} />
              <span className="font-bold text-sm gold-gradient-text tracking-wide">PrimeBoost</span>
            </div>
          )}
          {collapsed && <AppLogo size={28} />}
          <button
            onClick={onCollapse}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <span className={`badge-base text-xs ${isAdmin ? 'status-failed' : 'status-completed'}`}>
              {isAdmin ? '⚡ Admin Panel' : '👤 User Account'}
            </span>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-gold">
          <div className="space-y-0.5 px-2">
            {!collapsed && !isAdmin && (
              <p className="section-label px-3 mb-2">MAIN MENU</p>
            )}
            {!collapsed && isAdmin && (
              <p className="section-label px-3 mb-2">ADMIN PANEL</p>
            )}
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                    ${active
                      ? 'nav-link-active' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={18} className={active ? 'text-primary' : ''} />
                  {!collapsed && (
                    <span className="flex-1">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile */}
        <div className={`border-t border-border p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <UserProfile showEmail={true} />
          ) : (
            <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
              {initials}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col
          sidebar-transition lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-bold text-sm gold-gradient-text tracking-wide">PrimeBoost</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto scrollbar-gold">
          <div className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${active ? 'nav-link-active' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                  `}
                >
                  <item.icon size={18} className={active ? 'text-primary' : ''} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <UserProfile showEmail={true} />
        </div>
      </aside>
    </>
  );
}