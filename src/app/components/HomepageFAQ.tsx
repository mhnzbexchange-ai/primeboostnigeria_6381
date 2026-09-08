'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    question: 'What type of services does PrimeBoost provide?',
    answer:
      'PrimeBoost Nigeria provides social media promotion services for supported platforms including TikTok, Instagram, Facebook, YouTube, Telegram, Snapchat and X. Available services, pricing, minimum quantities and other requirements are displayed in the service catalog.',
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
      className="relative overflow-hidden bg-background py-24 sm:py-28"
      id="faq"
      aria-labelledby="faq-heading"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <HelpCircle
              size={14}
              className="text-primary"
              aria-hidden="true"
            />

            <span className="text-xs font-bold tracking-widest text-primary">
              SUPPORT CENTER
            </span>
          </div>

          <h2
            id="faq-heading"
            className="text-hero-md font-bold tracking-tight"
          >
            Frequently Asked{' '}
            <span className="gold-gradient-text">
              Questions
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Everything you need to know about PrimeBoost services, ordering,
            payments, delivery estimates, and account support.
          </p>

        </div>

        {/* FAQ list */}
        <div className="mx-auto max-w-3xl space-y-3">

          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`group relative overflow-hidden rounded-2xl border bg-card/60 p-5 backdrop-blur transition-all duration-300 ${
                  isOpen
                    ? 'border-primary/40 shadow-lg'
                    : 'border-border hover:border-primary/20'
                }`}
              >

                {/* Active accent */}
                <div
                  className={`absolute left-0 top-0 h-full w-0.5 bg-primary transition-opacity ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Question button */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`${faq.id}-answer`}
                >
                  <span
                    className={`text-sm font-bold leading-relaxed transition-colors ${
                      isOpen
                        ? 'text-foreground'
                        : 'text-foreground/90'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isOpen
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    {isOpen ? (
                      <ChevronUp
                        size={16}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
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
                    className="mt-4 border-t border-border/70 pt-4 animate-slide-down"
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

        {/* Trust panel */}
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-7 shadow-lg backdrop-blur sm:p-8">

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">

            <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 sm:mb-0 sm:mr-5">
              <ShieldCheck
                size={22}
                className="text-primary"
                aria-hidden="true"
              />
            </div>

            <div>
              <h3 className="mb-2 text-base font-bold">
                Clear information. Simple decisions.
              </h3>

              <p className="text-sm leading-7 text-muted-foreground">
                We provide service information and pricing before you place an
                order so you can make an informed decision. Service availability
                and delivery estimates may vary by platform and service.
              </p>
            </div>

          </div>

        </div>

        {/* Support CTA */}
        <div className="mt-12 text-center">

          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Still have a question?
          </p>

          <a
            href="mailto:primeboostnigeria@gmail.com"
            className="btn-outline-gold inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <MessageCircle
              size={16}
              aria-hidden="true"
            />

            Contact Support

            <span aria-hidden="true">→</span>
          </a>

        </div>

      </div>
    </section>
  );
}