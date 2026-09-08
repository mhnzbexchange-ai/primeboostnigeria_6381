/**
 * CENTRALIZED PRICING CONFIGURATION
 *
 * All service prices are defined here.
 * Formula: Total Price = Quantity × pricePerUnit
 *
 * Delivery times are estimates and may vary depending on
 * the service, platform, and order conditions.
 */

export const MINIMUM_ORDER_QTY = 500;

export const FACEBOOK_MINIMUM_ORDER_QTY = 1000;

export const MINIMUM_ORDER_MESSAGE =
  'Minimum order is 500 units. Please review the service requirements before placing an order.';

export const FACEBOOK_MINIMUM_ORDER_MESSAGE =
  'Minimum order for Facebook services is 1,000 units. Please review the service requirements before placing an order.';

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
    | 'members'
    | 'advertising';
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
      'TikTok follower promotion service for creators and businesses looking to expand their social media presence.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: 'Usually starts within 1 hour',
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
      'TikTok likes promotion service for supported videos and content.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: 'Usually starts within 15 minutes',
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
      'TikTok video views promotion service for supported public videos.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 10 minutes',
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
      'Instagram follower promotion service for supported public profiles. No password required.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: 'Usually starts within 2 hours',
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
    delivery: 'Usually starts within 30 minutes',
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
      'Instagram Reel views promotion service for supported public content.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 20 minutes',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 5000000,
    popular: false,
    quality: 'Standard',
  },

  // ─── Facebook ─────────────────────────────────────────────────────────────
  {
    id: 'svc-fb-followers',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Followers',
    category: 'followers',
    description:
      'Facebook follower promotion service for supported public profiles and creator pages.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: 'Usually starts within 2 hours',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-page-likes',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Page Likes',
    category: 'likes',
    description:
      'Facebook Page likes promotion service for supported public Facebook Pages.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: 'Usually starts within 2 hours',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-post-likes',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Post Likes',
    category: 'likes',
    description:
      'Facebook post likes promotion service for supported public posts.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: 'Usually starts within 30 minutes',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 500000,
    popular: true,
    quality: 'High',
  },

  {
    id: 'svc-fb-reels-likes',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Reels Likes',
    category: 'likes',
    description:
      'Facebook Reels likes promotion service for supported public Reels.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: 'Usually starts within 30 minutes',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 500000,
    popular: true,
    quality: 'High',
  },

  {
    id: 'svc-fb-reels-views',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Reels Views',
    category: 'views',
    description:
      'Facebook Reels views promotion service for supported public Reels.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 15 minutes',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 10000000,
    popular: true,
    quality: 'Standard',
  },

  {
    id: 'svc-fb-video-views',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Video Views',
    category: 'views',
    description:
      'Facebook video views promotion service for supported public videos.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 15 minutes',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 10000000,
    popular: false,
    quality: 'Standard',
  },

  {
    id: 'svc-fb-comments',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Comments',
    category: 'comments',
    description:
      'Facebook comment promotion service for supported public posts and videos.',
    pricePerUnit: 15,
    unit: 'per comment',
    delivery: 'Usually starts within 1 hour',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 50000,
    popular: false,
    quality: 'High',
  },

  {
    id: 'svc-fb-shares',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Post Shares',
    category: 'shares',
    description:
      'Facebook post sharing promotion service for supported public content.',
    pricePerUnit: 15,
    unit: 'per share',
    delivery: 'Usually starts within 1 hour',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: false,
    quality: 'High',
  },

  {
    id: 'svc-fb-live-views',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Live Video Views',
    category: 'views',
    description:
      'Facebook Live video views promotion service for supported public broadcasts.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 15 minutes',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 5000000,
    popular: false,
    quality: 'Standard',
  },

  {
    id: 'svc-fb-page-promotion',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Page Promotion',
    category: 'advertising',
    description:
      'Facebook Page promotion service designed to increase visibility and reach for eligible public Pages.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-post-promotion',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Post Promotion',
    category: 'advertising',
    description:
      'Facebook promotional service for increasing the reach of eligible public posts.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 100000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-traffic-campaign',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Website Traffic',
    category: 'advertising',
    description:
      'Facebook advertising service designed to drive targeted traffic to an eligible website or landing page.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 1000000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-engagement-campaign',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Engagement Campaign',
    category: 'advertising',
    description:
      'Facebook advertising service designed to increase engagement with eligible content.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 1000000,
    popular: false,
    quality: 'High',
  },

  {
    id: 'svc-fb-leads-campaign',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Lead Generation',
    category: 'advertising',
    description:
      'Facebook advertising service designed to help eligible businesses generate leads from targeted audiences.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 1000000,
    popular: true,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-messages-campaign',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Messages Campaign',
    category: 'advertising',
    description:
      'Facebook advertising service designed to encourage customers to start conversations with an eligible business.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 1000000,
    popular: false,
    quality: 'Premium',
  },

  {
    id: 'svc-fb-sales-campaign',
    platform: 'Facebook',
    emoji: '📘',
    platformColor: 'text-blue-500',
    platformBg: 'bg-blue-500/10',
    service: 'Sales & Conversion',
    category: 'advertising',
    description:
      'Facebook advertising service designed to promote eligible products or services and support conversion goals.',
    pricePerUnit: 10,
    unit: 'per unit',
    delivery: 'Usually starts within 1 business day',
    minQty: FACEBOOK_MINIMUM_ORDER_QTY,
    maxQty: 1000000,
    popular: true,
    quality: 'Premium',
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
      'X follower promotion service for supported public profiles.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: 'Usually starts within 1 hour',
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
      'X post likes promotion service for supported public posts.',
    pricePerUnit: 10,
    unit: 'per like',
    delivery: 'Usually starts within 30 minutes',
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
      'X post views promotion service for supported public posts.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 20 minutes',
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
      'Snapchat follower promotion service for supported public profiles.',
    pricePerUnit: 10,
    unit: 'per follower',
    delivery: 'Usually starts within 4 hours',
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
      'Snapchat story views promotion service for supported public stories.',
    pricePerUnit: 10,
    unit: 'per view',
    delivery: 'Usually starts within 15 minutes',
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
      'Telegram channel member promotion service for supported public channels.',
    pricePerUnit: 10,
    unit: 'per member',
    delivery: 'Usually starts within 2 hours',
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
      'Telegram group member promotion service for supported groups.',
    pricePerUnit: 10,
    unit: 'per member',
    delivery: 'Usually starts within 3 hours',
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
      'Telegram channel subscriber promotion service for supported public channels.',
    pricePerUnit: 10,
    unit: 'per subscriber',
    delivery: 'Usually starts within 2 hours',
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
      'YouTube video likes promotion service for supported public videos.',
    pricePerUnit: 15,
    unit: 'per like',
    delivery: 'Usually starts within 1 hour',
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
      'YouTube video views promotion service for supported public videos.',
    pricePerUnit: 20,
    unit: 'per view',
    delivery: 'Usually starts within 2 hours',
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
      'YouTube subscriber promotion service for supported public channels.',
    pricePerUnit: 50,
    unit: 'per subscriber',
    delivery: 'Usually starts within 4 hours',
    minQty: MINIMUM_ORDER_QTY,
    maxQty: 50000,
    popular: true,
    quality: 'Premium',
  },
];

/**
 * Group services by platform for the order form.
 */
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

/**
 * All platform names in display order.
 */
export const PLATFORMS = [
  'TikTok',
  'Instagram',
  'Facebook',
  'X (Twitter)',
  'Snapchat',
  'Telegram',
  'YouTube',
];

/**
 * Calculate total price.
 */
export function calcTotal(
  pricePerUnit: number,
  quantity: number
): number {
  return Math.round(pricePerUnit * quantity);
}

/**
 * Get a service by its ID.
 */
export function getServiceById(
  id: string
): ServiceDefinition | undefined {
  return ALL_SERVICES.find((s) => s.id === id);
}

/**
 * Get the minimum quantity for a service.
 */
export function getMinimumQuantity(
  service: ServiceDefinition
): number {
  return service.minQty;
}

/**
 * Get the appropriate minimum-order message.
 */
export function getMinimumOrderMessage(
  service: ServiceDefinition
): string {
  if (service.platform === 'Facebook') {
    return FACEBOOK_MINIMUM_ORDER_MESSAGE;
  }

  return MINIMUM_ORDER_MESSAGE;
}