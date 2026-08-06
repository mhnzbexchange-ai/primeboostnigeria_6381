'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    question: 'Are the followers and likes real?',
    answer: 'We provide high-quality accounts that look realistic. While they may not be 100% organic users, they have profile pictures, posts, and activity that make them indistinguishable from real accounts. Our services are designed to boost your social proof and help your content get discovered.',
  },
  {
    id: 'faq-002',
    question: 'How do I pay? Do you accept Nigerian payment methods?',
    answer: 'Yes! We accept all major Nigerian payment methods including Paystack, Flutterwave, Bank Transfer, Opay, PalmPay, and Moniepoint. All prices are in Nigerian Naira (₦). You fund your wallet first, then use your balance to place orders instantly.',
  },
  {
    id: 'faq-003',
    question: 'How fast will my order be delivered?',
    answer: 'Most orders start within 30 minutes of placement. Simple services like likes and views often complete in under 15 minutes. Follower orders typically complete within 1–24 hours depending on quantity. You can track your order status in real-time from your dashboard.',
  },
  {
    id: 'faq-004',
    question: 'Is my account safe? Will I get banned?',
    answer: 'Our services are designed to be safe. We use gradual delivery to avoid triggering platform spam filters. We never ask for your password. However, all social media platforms have Terms of Service — we recommend keeping orders within reasonable limits. We have served 47,000+ Nigerians safely.',
  },
  {
    id: 'faq-005',
    question: 'What happens if my order doesn\'t complete?',
    answer: 'If your order fails to complete for any reason, your wallet balance will be fully refunded within 24 hours. You can also open a support ticket and our team will resolve it within 2 hours. We have a 99.2% order completion rate.',
  },
  {
    id: 'faq-006',
    question: 'How does the referral program work?',
    answer: 'You get a unique referral link when you sign up. When someone registers through your link and places their first order, you earn 5% commission on every order they place — forever. You can withdraw your referral earnings to your bank account once you reach ₦2,000.',
  },
  {
    id: 'faq-007',
    question: 'Can I use PrimeBoost for my business clients?',
    answer: 'Absolutely. Many Nigerian digital marketing agencies use PrimeBoost for their clients. We offer bulk order discounts and a reseller API for agencies. Contact our support team to discuss agency pricing and white-label options.',
  },
  {
    id: 'faq-008',
    question: 'How do I contact support if I have an issue?',
    answer: 'We offer multiple support channels: live chat on the website (available 8am–10pm WAT), WhatsApp support at +234 708 265 3790, support tickets from your dashboard, and email at primeboostnigeria@gmail.com. Typical response time is under 30 minutes.',
  },
];

export default function HomepageFAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-001');

  return (
    <section className="py-24 bg-background" id="faq">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">COMMON QUESTIONS</p>
          <h2 className="text-hero-md font-bold mb-4">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Everything you need to know about PrimeBoost Nigeria. Can&apos;t find your answer? Contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs?.map((faq) => {
            const isOpen = openId === faq?.id;
            return (
              <div
                key={faq?.id}
                className={`card-base card-gradient-bg transition-all duration-200 cursor-pointer ${isOpen ? 'border-primary/40 glow-gold-sm' : 'hover:border-border/80'}`}
                onClick={() => setOpenId(isOpen ? null : faq?.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-sm leading-snug">{faq?.question}</h3>
                  <div className="flex-shrink-0">
                    {isOpen
                      ? <ChevronUp size={16} className="text-primary" />
                      : <ChevronDown size={16} className="text-muted-foreground" />
                    }
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-border animate-slide-down">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq?.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">Still have questions?</p>
          <a
            href="https://wa.me/2347082653790"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          >
            <span>💬</span>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}