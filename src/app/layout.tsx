import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import '../styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PrimeBoost Nigeria — Nigeria's Trusted Digital Promotion Platform",
  description:
    'PrimeBoost Nigeria provides social media promotion services for TikTok, Instagram, YouTube, Telegram, Snapchat, and X. View services, pricing, and place orders online.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        {/* Google AdSense site verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-8244011032789060"
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fprimeboost7331back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>

      <body className={dmSans.className}>
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #2A2A2A',
              color: '#F5F5F0',
            },
          }}
        />

        {/* Rocket */}
      </body>
    </html>
  );
}