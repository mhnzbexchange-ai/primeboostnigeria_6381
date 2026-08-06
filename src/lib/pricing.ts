/**
 * CENTRALIZED PRICING CONFIGURATION
 * All service prices are defined here. To update pricing, edit ONLY this file.
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
  category: 'followers' | 'likes' | 'views' | 'comments' | 'shares' | 'subscribers' | 'members';
  description: string;
  pricePerUnit: number; // in ₦ (Naira)
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
    description: 'Real-looking TikTok followers. Gradual delivery to avoid flags. High retention rate.',
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
    description: 'TikTok video likes from active accounts. Boosts your video in the algorithm.',
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
    description: 'Increase your TikTok video view count. Fast delivery, great for trending.',
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
    description: 'Premium Instagram followers. Low drop rate, high quality. No password needed.',
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
    description: 'High-retention Instagram likes from active accounts. Instant start.',
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
    description: 'Instagram Reel views to boost your content visibility and reach.',
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
    description: 'X followers to boost your social proof and credibility on the platform.',
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
    description: 'X post likes to increase engagement and post visibility.',
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
    description: 'X post views to increase reach and visibility on the platform.',
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
    description: 'Snapchat followers/friends to grow your audience and increase story reach.',
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
    description: 'Amplify your Snapchat story views for better reach and engagement.',
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
    description: 'Grow your Telegram channel fast with targeted Nigerian members.',
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
    description: 'Add members to your Telegram group. Active-looking accounts.',
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
    description: 'Increase your Telegram channel subscriber count with real-looking accounts.',
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
    description: 'YouTube video likes to boost engagement signals and algorithm ranking.',
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
    description: 'YouTube video views to increase watch count and improve discoverability.',
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
    description: 'Grow your YouTube channel with real-looking subscribers. Boost credibility fast.',
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
export const SERVICES_BY_PLATFORM: Record<string, ServiceDefinition[]> = ALL_SERVICES.reduce(
  (acc, svc) => {
    if (!acc[svc.platform]) acc[svc.platform] = [];
    acc[svc.platform].push(svc);
    return acc;
  },
  {} as Record<string, ServiceDefinition[]>
);

/** All platform names in display order */
export const PLATFORMS = ['TikTok', 'Instagram', 'X (Twitter)', 'Snapchat', 'Telegram', 'YouTube'];

/** Calculate total price */
export function calcTotal(pricePerUnit: number, quantity: number): number {
  return Math.round(pricePerUnit * quantity);
}

/** Get a service by its ID */
export function getServiceById(id: string): ServiceDefinition | undefined {
  return ALL_SERVICES.find((s) => s.id === id);
}
