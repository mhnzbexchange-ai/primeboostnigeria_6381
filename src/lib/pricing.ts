/**
 * CENTRALIZED PRICING CONFIGURATION
 * All service prices are defined here.
 * Formula: Total Price = Quantity × pricePerUnit
 */

export const MINIMUM_ORDER_QTY = 500;
export const MINIMUM_ORDER_MESSAGE = 'Minimum order is 500.';

export interface ServiceDefinition {
  id: string;
  platform: string;
  emoji: string;
  platformColor: string;
  platformBg: string;
  service: string;
  category:
    | 'followers'
    | 'likes'
    | 'views'
    | 'comments'
    | 'shares'
    | 'subscribers'
    | 'members';
  description: string;
  pricePerUnit: number;
  unit: string;
  delivery: string;
  minQty: number;
  maxQty: number;
  popular: boolean;
  quality: 'Premium' | 'High' | 'Standard';
}

export const ALL_SERVICES: ServiceDefinition[] = [

  // ─── TikTok ───────────────────────────────────────────────────────────────
  {
    id: 'svc-tt-followers',
    platform: 'TikTok',
    emoji: '🎵',
    platformColor: 'text-red-400',
    platformBg: 'bg-red-400/10',
    service: 'Followers',
    category: 'followers',
    description:
      'TikTok follower promotion service for creators and businesses.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: '< 1 hour',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-tt-likes',
    platform: 'TikTok',
    emoji: '🎵',
    platformColor: 'text-red-400',
    platformBg: 'bg-red-400/10',
    service: 'Likes',
    category: 'likes',
    description:
      'TikTok likes promotion service for supported videos.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: '< 15 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 500000,
    popular: true,
    quality: 'High',
  },

  {
    id: 'svc-tt-views',
    platform: 'TikTok',
    emoji: '🎵',
    platformColor: 'text-red-400',
    platformBg: 'bg-red-400/10',
    service: 'Views',
    category: 'views',
    description:
      'TikTok video views promotion service.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: '< 10 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 10000000,
    popular: false,
    quality: 'Standard',
  },

  // ─── Instagram ────────────────────────────────────────────────────────────
  {
    id: 'svc-ig-followers',
    platform: 'Instagram',
    emoji: '📸',
    platformColor: 'text-pink-400',
    platformBg: 'bg-pink-400/10',
    service: 'Followers',
    category: 'followers',
    description:
      'Instagram follower promotion service. No password required.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: '< 2 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-ig-likes',
    platform: 'Instagram',
    emoji: '📸',
    platformColor: 'text-pink-400',
    platformBg: 'bg-pink-400/10',
    service: 'Likes',
    category: 'likes',
    description:
      'Instagram likes promotion service for supported posts and content.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: '< 30 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 50000,
    popular: true,
    quality: 'High',
  },

  {
    id: 'svc-ig-views',
    platform: 'Instagram',
    emoji: '📸',
    platformColor: 'text-pink-400',
    platformBg: 'bg-pink-400/10',
    service: 'Reel Views',
    category: 'views',
    description:
      'Instagram Reel views promotion service.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: '< 20 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 5000000,
    popular: false,
    quality: 'Standard',
  },

  // ─── X (Twitter) ──────────────────────────────────────────────────────────
  {
    id: 'svc-x-followers',
    platform: 'X (Twitter)',
    emoji: '𝕏',
    platformColor: 'text-sky-400',
    platformBg: 'bg-sky-400/10',
    service: 'Followers',
    category: 'followers',
    description:
      'X follower promotion service for supported profiles.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: '< 1 hour',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 75000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-x-likes',
    platform: 'X (Twitter)',
    emoji: '𝕏',
    platformColor: 'text-sky-400',
    platformBg: 'bg-sky-400/10',
    service: 'Likes',
    category: 'likes',
    description:
      'X post likes promotion service.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: '< 30 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: false,
    quality: 'High',
  },

  {
    id: 'svc-x-views',
    platform: 'X (Twitter)',
    emoji: '𝕏',
    platformColor: 'text-sky-400',
    platformBg: 'bg-sky-400/10',
    service: 'Views',
    category: 'views',
    description:
      'X post views promotion service.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: '< 20 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 5000000,
    popular: false,
    quality: 'Standard',
  },

  // ─── Snapchat ─────────────────────────────────────────────────────────────
  {
    id: 'svc-sc-followers',
    platform: 'Snapchat',
    emoji: '👻',
    platformColor: 'text-yellow-400',
    platformBg: 'bg-yellow-400/10',
    service: 'Followers',
    category: 'followers',
    description:
      'Snapchat follower promotion service.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: '< 4 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 50000,
    popular: false,
    quality: 'Standard',
  },

  {
    id: 'svc-sc-views',
    platform: 'Snapchat',
    emoji: '👻',
    platformColor: 'text-yellow-400',
    platformBg: 'bg-yellow-400/10',
    service: 'Story Views',
    category: 'views',
    description:
      'Snapchat story views promotion service.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: '< 15 min',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 500000,
    popular: true,
    quality: 'High',
  },

  // ─── Telegram ─────────────────────────────────────────────────────────────
  {
    id: 'svc-tg-channel',
    platform: 'Telegram',
    emoji: '✈️',
    platformColor: 'text-blue-400',
    platformBg: 'bg-blue-400/10',
    service: 'Channel Members',
    category: 'members',
    description:
      'Telegram channel member promotion service.',
    pricePerUnit: 10,
    unit: 'per member',
    delivery: '< 2 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 200000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-tg-group',
    platform: 'Telegram',
    emoji: '✈️',
    platformColor: 'text-blue-400',
    platformBg: 'bg-blue-400/10',
    service: 'Group Members',
    category: 'members',
    description:
      'Telegram group member promotion service.',
    pricePerUnit: 10,
    unit: 'per member',
    delivery: '< 3 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: false,
    quality: 'High',
  },

  {
    id: 'svc-tg-subscribers',
    platform: 'Telegram',
    emoji: '✈️',
    platformColor: 'text-blue-400',
    platformBg: 'bg-blue-400/10',
    service: 'Channel Subscribers',
    category: 'subscribers',
    description:
      'Telegram channel subscriber promotion service.',
    pricePerUnit: 10,
    unit: 'per subscriber',
    delivery: '< 2 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 200000,
    popular: false,
    quality: 'Standard',
  },

  // ─── YouTube ──────────────────────────────────────────────────────────────
  {
    id: 'svc-yt-likes',
    platform: 'YouTube',
    emoji: '▶️',
    platformColor: 'text-red-500',
    platformBg: 'bg-red-500/10',
    service: 'Likes',
    category: 'likes',
    description:
      'YouTube video likes promotion service.',
    pricePerUnit: 15,
    unit: 'per like',
    delivery: '< 1 hour',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'High',
  },

  {
    id: 'svc-yt-views',
    platform: 'YouTube',
    emoji: '▶️',
    platformColor: 'text-red-500',
    platformBg: 'bg-red-500/10',
    service: 'Views',
    category: 'views',
    description:
      'YouTube video views promotion service.',
    pricePerUnit: 20,
    unit: 'per view',
    delivery: '< 2 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 10000000,
    popular: true,
    quality: 'Standard',
  },

  {
    id: 'svc-yt-subscribers',
    platform: 'YouTube',
    emoji: '▶️',
    platformColor: 'text-red-500',
    platformBg: 'bg-red-500/10',
    service: 'Subscribers',
    category: 'subscribers',
    description:
      'YouTube subscriber promotion service.',
    pricePerUnit: 50,
    unit: 'per subscriber',
    delivery: '< 4 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 50000,
    popular: true,
    quality: 'Premium',
  },
];

/** Group services by platform for the order form */
export const SERVICES_BY_PLATFORM: Record<
  string,
  ServiceDefinition[]
> = ALL_SERVICES.reduce(
  (acc, svc) => {
    if (!acc[svc.platform]) {
      acc[svc.platform] = [];
    }

    acc[svc.platform].push(svc);

    return acc;
  },
  {} as Record<string, ServiceDefinition[]>
);

/** All platform names in display order */
export const PLATFORMS = [
  'TikTok',
  'Instagram',
  'X (Twitter)',
  'Snapchat',
  'Telegram',
  'YouTube',
];

/** Calculate total price */
export function calcTotal(
  pricePerUnit: number,
  quantity: number
): number {
  return Math.round(pricePerUnit * quantity);
}

/** Get a service by its ID */
export function getServiceById(
  id: string
): ServiceDefinition | undefined {
  return ALL_SERVICES.find((s) => s.id === id);
}