'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

const faqs = [
  {
    id: 'faq-001',
    question: 'What type of services does PrimeBoost provide?',
    answer:
      'PrimeBoost provides social media promotion services for supported platforms. Available services and their current pricing are shown in the service catalog before you place an order.',
  },
  {
    id: 'faq-002',
    question: 'Are the followers, likes and views organic?',
    answer:
      'Our promotion services should not be considered a replacement for organic audience growth. Results can vary by service and platform. We recommend reviewing the service description and requirements before placing an order.',
  },
  {
    id: 'faq-003',
    question: 'How do I pay for my order?',
    answer:
      'Prices on PrimeBoost are displayed in Nigerian Naira (₦). Available payment methods are shown during the payment or wallet-funding process. Please review the payment details carefully before confirming a transaction.',
  },
  {
    id: 'faq-004',
    question: 'How long does an order take?',
    answer:
      'Delivery or start times can vary depending on the service, order quantity and current provider availability. The estimated timing for a service is displayed before you place your order.',
  },
  {
    id: 'faq-005',
    question: 'Do I need to give PrimeBoost my social media password?',
    answer:
      'No. You should never provide your social media password when placing a standard promotion order. Only provide the information specifically requested by the order form.',
  },
  {
    id: 'faq-006',
    question: 'What happens if my order has a problem?',
    answer:
      'If you experience a problem with an order, contact PrimeBoost support and provide your order details. Our team can review the order status and advise you on the available resolution.',
  },
  {
    id: 'faq-007',
    question: 'Can I see the available services and prices before ordering?',
    answer:
      'Yes. You can visit the service catalog to review the available services, pricing, minimum order quantities and other relevant information before placing an order.',
  },
  {
    id: 'faq-008',
    question: 'How can I contact PrimeBoost support?',
    answer:
      'You can contact PrimeBoost through the support options provided on the website. You can also email primeboostnigeria@gmail.com for assistance with questions or orders.',
  },
];

export default function HomepageFAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-001');

  return (
    <section className="bg-background py-24" id="faq">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="section-label mb-3">
            COMMON QUESTIONS
          </p>

          <h2 className="text-hero-md mb-4 font-bold">
            Frequently Asked{' '}
            <span className="gold-gradient-text">
              Questions
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            Find answers to common questions about PrimeBoost,
            ordering, services and customer support.
          </p>
        </div>

        {/* FAQ list */}
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`card-base card-gradient-bg cursor-pointer transition-all duration-200 ${
                  isOpen
                    ? 'border-primary/40 glow-gold-sm'
                    : 'hover:border-border/80'
                }`}
                onClick={() =>
                  setOpenId(isOpen ? null : faq.id)
                }
              >

                {/* Question */}
                <div className="flex items-center justify-between gap-4">

                  <h3 className="text-sm font-semibold leading-snug">
                    {faq.question}
                  </h3>

                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <ChevronUp
                        size={16}
                        className="text-primary"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>

                </div>

                {/* Answer */}
                {isOpen && (
                  <div className="mt-3 border-t border-border pt-3 animate-slide-down">
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
            <MessageCircle size={16} />
            Contact Support
          </a>

        </div>

      </div>
    </section>
  );
}