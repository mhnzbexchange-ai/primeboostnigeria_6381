import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  title: 'PrimeBoost Nigeria — Nigeria\'s Trusted Digital Promotion Platform',
  description:
    'Buy real followers, likes, views, and engagement for TikTok, Instagram, Telegram, Snapchat, and X. Fast delivery, Naira payments, trusted by thousands of Nigerians.',
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8244011032789060"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

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

        <script
          type="module"
          async
          src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fprimeboost7331back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20"
        />

        <script
          type="module"
          defer
          src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
        />
      </body>
    </html>
  );
}