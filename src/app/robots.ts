import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin-dashboard',
          '/user-dashboard',
          '/order-form',
          '/api/',
          '/auth/',
          '/payment/',
          '/profile-settings',
          '/payouts',
          '/referrals',
        ],
      },
    ],
    sitemap: 'https://primeboostnigeria.com/sitemap.xml',
  };
}
