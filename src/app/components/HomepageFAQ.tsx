'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    question: 'What type of services does PrimeBoost provide?',
    answer:
      'PrimeBoost Nigeria provides social media promotion services for supported platforms including TikTok, Instagram, YouTube, Telegram, Snapchat and X. Available services, pricing, minimum quantities and other requirements are displayed in the service catalog.',
  },
  {
    id: 'faq-002',
    question: 'Are the followers, likes and views organic?',
    answer:
      'PrimeBoost promotion services should not be considered a replacement for organic audience growth. Promotional results can vary depending on the service, platform and other factors. Customers should review the specific service description and requirements before placing an order.',
  },
  {
    id: 'faq-003',
    question: 'How do I pay for my order?',
    answer:
      'PrimeBoost prices are displayed in Nigerian Naira (₦). Available payment methods are presented during the payment or wallet-funding process. Review the amount and payment information carefully before confirming a transaction.',
  },
  {
    id: 'faq-004',
    question: 'How long does an order take?',
    answer:
      'Estimated delivery or start times vary depending on the service, order quantity and current availability. The estimated timing for each service is displayed before you place an order. Delivery estimates are not guarantees and may occasionally change.',
  },
  {
    id: 'faq-005',
    question: 'Do I need to give PrimeBoost my social media password?',
    answer:
      'No. You should never provide your social media password when placing a standard promotion order. Only provide the information specifically requested by the order form. If an unusual request is made, contact PrimeBoost support before continuing.',
  },
  {
    id: 'faq-006',
    question: 'What happens if my order has a problem?',
    answer:
      'If you experience a problem with an order, contact PrimeBoost support and provide your order details. Our support team can review the order information and explain the available options for resolving the issue.',
  },
  {
    id: 'faq-007',
    question: 'Can I see the available services and prices before ordering?',
    answer:
      'Yes. You can visit the service catalog to review available services, prices, minimum order quantities, estimated delivery times and other relevant information before deciding whether to place an order.',
  },
  {
    id: 'faq-008',
    question: 'How can I contact PrimeBoost support?',
    answer:
      'You can use the support options provided throughout the website. You can also email primeboostnigeria@gmail.com for assistance with questions, payments or orders.',
  },
];

export default function HomepageFAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-001');

  const toggleFAQ = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      className="bg-background py-24"
      id="faq"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="section-label mb-3">
            COMMON QUESTIONS
          </p>

          <h2
            id="faq-heading"
            className="text-hero-md mb-4 font-bold"
          >
            Frequently Asked{' '}
            <span className="gold-gradient-text">
              Questions
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Find answers to common questions about PrimeBoost,
            available services, ordering, payments and customer support.
          </p>
        </div>

        {/* FAQ list */}
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`card-base card-gradient-bg transition-all duration-200 ${
                  isOpen
                    ? 'border-primary/40 glow-gold-sm'
                    : 'hover:border-border/80'
                }`}
              >

                {/* Question button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`${faq.id}-answer`}
                >
                  <span className="text-sm font-semibold leading-snug">
                    {faq.question}
                  </span>

                  <span className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp
                        size={18}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div
                    id={`${faq.id}-answer`}
                    className="mt-3 border-t border-border pt-3 animate-slide-down"
                  >
                    <p className="text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div className="mt-12 text-center">

          <p className="mb-4 text-sm text-muted-foreground">
            Still have a question?
          </p>

          <a
            href="mailto:primeboostnigeria@gmail.com"
            className="btn-outline-gold inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <MessageCircle
              size={16}
              aria-hidden="true"
            />
            Contact Support
          </a>

        </div>

      </div>
    </section>
  );
}