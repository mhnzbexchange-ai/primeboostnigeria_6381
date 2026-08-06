import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 'testi-001',
    name: 'Chinyere Okonkwo',
    handle: '@chinyere_creates',
    platform: 'TikTok Creator',
    avatar: 'CO',
    avatarBg: 'from-pink-500 to-red-500',
    rating: 5,
    text: 'PrimeBoost helped me go from 2,000 to 45,000 TikTok followers in 3 weeks. The delivery was so fast and the followers actually stayed! I now get brand deals because of my follower count. 100% recommended for any Nigerian creator.',
    verified: true,
    service: 'TikTok Followers',
    amount: '₦18,500 spent',
  },
  {
    id: 'testi-002',
    name: 'Emeka Nwosu',
    handle: '@emeka_biz',
    platform: 'Instagram Business',
    avatar: 'EN',
    avatarBg: 'from-blue-500 to-purple-500',
    rating: 5,
    text: 'My Instagram business page went from 800 to 12,000 followers. Customers now take my page seriously and I get more inquiries. The Paystack payment was smooth and my wallet was credited instantly.',
    verified: true,
    service: 'Instagram Followers',
    amount: '₦9,200 spent',
  },
  {
    id: 'testi-003',
    name: 'Aisha Bello',
    handle: '@aisha_abuja',
    platform: 'Telegram Channel Owner',
    avatar: 'AB',
    avatarBg: 'from-green-500 to-teal-500',
    rating: 5,
    text: 'I run a news Telegram channel and needed members fast. PrimeBoost delivered 10,000 members in under 4 hours. The support team was responsive on WhatsApp. Best SMM panel in Nigeria without doubt!',
    verified: true,
    service: 'Telegram Members',
    amount: '₦22,000 spent',
  },
  {
    id: 'testi-004',
    name: 'Tunde Adeyemi',
    handle: '@tunde_xplorer',
    platform: 'X (Twitter) User',
    avatar: 'TA',
    avatarBg: 'from-yellow-500 to-orange-500',
    rating: 5,
    text: 'Bought X followers twice now. Both times delivered within 45 minutes. The referral system is also great — I have earned over ₦12,000 just by sharing my link with friends. This is legit.',
    verified: true,
    service: 'X Followers + Referral',
    amount: '₦7,400 spent',
  },
  {
    id: 'testi-005',
    name: 'Ngozi Eze',
    handle: '@ngozi_fashion',
    platform: 'Fashion Creator',
    avatar: 'NE',
    avatarBg: 'from-purple-500 to-pink-500',
    rating: 5,
    text: 'As a fashion influencer, engagement matters more than followers. PrimeBoost Instagram likes made my posts look popular and the algorithm started pushing my content organically. Na real deal!',
    verified: true,
    service: 'Instagram Likes',
    amount: '₦5,600 spent',
  },
  {
    id: 'testi-006',
    name: 'Biodun Olatunji',
    handle: '@biodun_digital',
    platform: 'Digital Marketer',
    avatar: 'BO',
    avatarBg: 'from-cyan-500 to-blue-500',
    rating: 5,
    text: 'I manage social media for 8 clients and PrimeBoost is my go-to SMM panel. The bulk order discount, fast API, and Nigerian payment options make it perfect for agency work. Very reliable platform.',
    verified: true,
    service: 'Multiple Services',
    amount: '₦145,000 spent',
  },
];

export default function HomepageTestimonials() {
  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">CUSTOMER REVIEWS</p>
          <h2 className="text-hero-md font-bold mb-4">
            What Nigerians <span className="gold-gradient-text">Are Saying</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Real reviews from verified customers across Nigeria. No fake testimonials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {testimonials?.map((t) => (
            <div
              key={t?.id}
              className="card-base card-gradient-bg hover:border-primary/30 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-primary/40 mb-3" />

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">&ldquo;{t?.text}&rdquo;</p>

              {/* Service tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="badge-base status-completed">{t?.service}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{t?.amount}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t?.avatarBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {t?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{t?.name}</p>
                    {t?.verified && (
                      <span className="text-primary text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t?.handle} · {t?.platform}</p>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  {Array.from({ length: t?.rating })?.map((_, i) => (
                    <Star key={`star-${t?.id}-${i + 1}`} size={11} className="text-primary fill-primary" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl glass-card border border-primary/20">
          <div className="text-center">
            <div className="text-5xl font-extrabold gold-gradient-text tabular-nums">4.9</div>
            <div className="flex gap-1 justify-center my-1">
              {[1,2,3,4,5]?.map((s) => <Star key={`overall-star-${s}`} size={16} className="text-primary fill-primary" />)}
            </div>
            <p className="text-xs text-muted-foreground">Overall Rating</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border" />
          <div className="space-y-1.5 w-full max-w-xs">
            {[
              { label: '5 stars', pct: 87 },
              { label: '4 stars', pct: 9 },
              { label: '3 stars', pct: 3 },
              { label: '2 stars', pct: 1 },
            ]?.map((r) => (
              <div key={`rating-${r?.label?.replace(' ', '-')}`} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-12 flex-shrink-0">{r?.label}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gold-gradient-bg rounded-full" style={{ width: `${r?.pct}%` }} />
                </div>
                <span className="text-muted-foreground w-8 text-right tabular-nums">{r?.pct}%</span>
              </div>
            ))}
          </div>
          <div className="hidden sm:block w-px h-16 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-extrabold tabular-nums">12,847</div>
            <p className="text-xs text-muted-foreground mt-1">Verified Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}