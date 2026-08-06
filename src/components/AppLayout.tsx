'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';

interface AppLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function AppLayout({ children, isAdmin = false }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden modal-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        isAdmin={isAdmin}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardTopbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          isAdmin={isAdmin}
        />
        <main className="flex-1 overflow-y-auto scrollbar-gold">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}