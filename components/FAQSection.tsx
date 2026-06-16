'use client';

import { useState } from 'react';

const FAQ_DATA = [
  {
    question: 'Are your attars and perfumes 100% authentic?',
    answer: 'Absolutely. Every product at Rahmani Perfumery is sourced directly from trusted Arabian distilleries and verified suppliers. We guarantee 100% authenticity with pure, natural ingredients — no synthetic fillers or dilutions.',
  },
  {
    question: 'How long do your fragrances last?',
    answer: 'Our concentrated attars typically last 8–12 hours on skin and even longer on fabric. Spray perfumes last 6–10 hours depending on the concentration. For maximum longevity, apply on pulse points — wrists, neck, and behind ears.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes! We offer Cash on Delivery across India. You can also pay securely online via UPI, debit/credit cards, or net banking through Razorpay at checkout.',
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We accept returns within 7 days of delivery for unopened, sealed products in their original packaging. If you receive a damaged or incorrect item, we will send a replacement at no extra cost. Please contact us via WhatsApp or email to initiate a return.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders are dispatched within 24–48 hours. Standard delivery takes 4–7 business days across India. Metro cities typically receive orders within 3–5 days. You will receive a tracking link via SMS and email once shipped.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship across India only. We are working on expanding to international shipping soon. Follow us on social media for updates on international availability.',
  },
  {
    question: 'Can I get a custom blend or gift set?',
    answer: 'Yes! We offer custom blending services and curated gift sets for special occasions like weddings, Eid, and corporate gifting. Reach out to us on WhatsApp or visit our store in Patna to discuss your preferences.',
  },
  {
    question: 'Is there free shipping?',
    answer: 'Yes — all orders above ₹999 qualify for free shipping across India. Orders below ₹999 have a flat shipping fee of ₹60.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq-section" id="faq">
      <style>{`
        .faq-section {
          padding: 80px 0 64px;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }

        .faq-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af3766, transparent);
        }

        .faq-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 40px);
        }

        .faq-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-eyebrow {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 14px;
        }

        .faq-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .faq-subtitle {
          font-size: 0.92rem;
          color: #888;
          margin: 0;
          line-height: 1.6;
          letter-spacing: 0.01em;
        }

        .faq-title-line {
          width: 60px;
          height: 2.5px;
          background: linear-gradient(90deg, #d4af37, #c8963e);
          margin: 16px auto 0;
          border-radius: 2px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .faq-item {
          border-bottom: 1px solid #e8e8e8;
        }

        .faq-item:first-child {
          border-top: 1px solid #e8e8e8;
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 22px 4px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
        }

        .faq-question:hover {
          color: #d4af37;
        }

        .faq-question-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: inherit;
          line-height: 1.5;
          letter-spacing: 0.015em;
        }

        .faq-item.active .faq-question-text {
          color: #d4af37;
        }

        .faq-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }

        .faq-item.active .faq-icon {
          background: #d4af37;
          border-color: #d4af37;
          transform: rotate(45deg);
        }

        .faq-icon-line {
          display: block;
          position: relative;
          width: 12px;
          height: 1.5px;
          background: #999;
          transition: background 0.3s;
        }

        .faq-icon-line::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          width: 12px;
          height: 1.5px;
          background: inherit;
          transition: opacity 0.3s;
        }

        .faq-item.active .faq-icon-line {
          background: #fff;
        }

        .faq-answer-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item.active .faq-answer-wrapper {
          grid-template-rows: 1fr;
        }

        .faq-answer-inner {
          overflow: hidden;
        }

        .faq-answer {
          padding: 0 4px 22px;
          font-size: 0.88rem;
          color: #666;
          line-height: 1.75;
          letter-spacing: 0.01em;
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 56px 0 48px;
          }
          .faq-header {
            margin-bottom: 36px;
          }
          .faq-question {
            padding: 18px 2px;
          }
          .faq-question-text {
            font-size: 0.88rem;
          }
          .faq-answer {
            font-size: 0.84rem;
            padding-bottom: 18px;
          }
          .faq-icon {
            width: 24px;
            height: 24px;
          }
          .faq-icon-line {
            width: 10px;
          }
          .faq-icon-line::after {
            width: 10px;
          }
        }
      `}</style>

      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-eyebrow">Got Questions?</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Everything you need to know about our fragrances, shipping, and more.</p>
          <div className="faq-title-line" />
        </div>

        <div className="faq-list">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)} aria-expanded={openIndex === i}>
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-icon">
                  <span className="faq-icon-line" />
                </span>
              </button>
              <div className="faq-answer-wrapper">
                <div className="faq-answer-inner">
                  <div className="faq-answer">{item.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
