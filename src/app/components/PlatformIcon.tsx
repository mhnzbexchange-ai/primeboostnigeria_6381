import React from 'react';

export interface PlatformMeta {
  key: string;
  label: string;
  catalogName: string;
  description: string;
  color: string;
}

export const PLATFORM_META: PlatformMeta[] = [
  {
    key: 'tiktok',
    label: 'TikTok',
    catalogName: 'TikTok',
    description: 'Followers, likes and views for short-form video profiles.',
    color: '#0B1F4B',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    catalogName: 'Instagram',
    description: 'Followers, likes and views for posts, reels and profiles.',
    color: '#C13584',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    catalogName: 'Facebook',
    description: 'Page, post and video promotion plus advertising services.',
    color: '#1877F2',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    catalogName: 'YouTube',
    description: 'Subscribers and views for channels and videos.',
    color: '#DC2626',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    catalogName: 'Telegram',
    description: 'Channel and group member promotion.',
    color: '#229ED9',
  },
  {
    key: 'x',
    label: 'X',
    catalogName: 'X (Twitter)',
    description: 'Followers, likes and views for X profiles and posts.',
    color: '#0F172A',
  },
  {
    key: 'snapchat',
    label: 'Snapchat',
    catalogName: 'Snapchat',
    description: 'Follower promotion for Snapchat profiles.',
    color: '#B45309',
  },
];

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export default function PlatformIcon({ platform, size = 22, className }: PlatformIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true as const,
    focusable: false as const,
    className,
  };

  switch (platform) {
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.6V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V13h2.7v8h3.2Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg {...common}>
          <path d="M21.4 4.6 2.9 11.7c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.4ZM8.5 13.9l9.6-6c.4-.3.9-.1.5.2l-8 7.2-.3 3.4-1.8-4.8Z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.2 4.7H5.4l11.3 14.5Z" />
        </svg>
      );
    case 'snapchat':
      return (
        <svg {...common}>
          <path d="M12 2.5c2.6 0 4.6 1.9 4.6 4.6v2.2c.3.2.8.3 1.2.3.5 0 .9.3.9.7 0 .5-.6.8-1.4 1.1-.5.2-.6.4-.5.7.9 1.7 2 2.5 3.1 2.9.4.1.5.5.2.8-.4.4-1.3.6-2 .8-.2.1-.3.3-.4.6-.1.4-.3.6-.7.6-.5 0-1.1-.2-1.9-.2-1.2 0-1.9 1.9-4.1 1.9s-2.9-1.9-4.1-1.9c-.8 0-1.4.2-1.9.2-.4 0-.6-.2-.7-.6-.1-.3-.2-.5-.4-.6-.7-.2-1.6-.4-2-.8-.3-.3-.2-.7.2-.8 1.1-.4 2.2-1.2 3.1-2.9.1-.3 0-.5-.5-.7-.8-.3-1.4-.6-1.4-1.1 0-.4.4-.7.9-.7.4 0 .9-.1 1.2-.3V7.1C7.4 4.4 9.4 2.5 12 2.5Z" />
        </svg>
      );
    default:
      return null;
  }
}
