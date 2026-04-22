'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

export default function ContactClient() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const Field = ({
    name, label, type = 'text', placeholder, required = false, children
  }: {
    name: string; label: string; type?: string; placeholder?: string; required?: boolean; children?: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium tracking-widest uppercase text-neutral-400">{label}</label>
      {children || (
        <input
          name={name}
          type={type}
          value={(formData as any)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused('')}
          className={`w-full bg-neutral-50 border-2 rounded-2xl px-6 py-4 text-base text-neutral-800 placeholder:text-neutral-300 outline-none transition-all duration-300 ${
            focused === name ? 'border-[#C9A96E] bg-white shadow-[0_0_0_4px_rgba(201,169,110,0.08)]' : 'border-neutral-100 hover:border-neutral-200'
          }`}
        />
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        .contact-page * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; }
        .contact-hero-title { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif; letter-spacing: -0.04em; }

        .pill-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3);
          border-radius: 999px; padding: 6px 16px;
          color: #C9A96E; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
        }

        .info-card {
          background: #FAFAFA; border: 1px solid #F0EDE8; border-radius: 20px;
          padding: 28px; display: flex; flex-direction: column; gap: 10px;
          transition: all 0.3s ease;
        }
        .info-card:hover { background: #fff; border-color: #E8DDD0; box-shadow: 0 8px 30px rgba(0,0,0,0.04); transform: translateY(-2px); }

        .info-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #C9A96E15, #C9A96E28);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; margin-bottom: 4px;
        }

        .textarea-field {
          width: 100%; background: #FAFAFA; border: 2px solid #F0EDE8; border-radius: 20px;
          padding: 20px 24px; font-size: 16px; color: #1A1A1A;
          outline: none; resize: none; transition: all 0.3s ease;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .textarea-field:hover { border-color: #E8DDD0; }
        .textarea-field:focus { border-color: #C9A96E; background: white; box-shadow: 0 0 0 4px rgba(201,169,110,0.08); }
        .textarea-field::placeholder { color: #C4BDBA; }

        .select-field {
          width: 100%; background: #FAFAFA; border: 2px solid #F0EDE8; border-radius: 20px;
          padding: 16px 24px; font-size: 16px; color: #1A1A1A;
          outline: none; transition: all 0.3s ease; appearance: none; cursor: pointer;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .select-field:hover { border-color: #E8DDD0; }
        .select-field:focus { border-color: #C9A96E; background: white; box-shadow: 0 0 0 4px rgba(201,169,110,0.08); }

        .submit-btn {
          background: #1A1A1A; color: white; border: none;
          border-radius: 999px; padding: 18px 48px;
          font-size: 15px; font-weight: 500; letter-spacing: 0.01em;
          cursor: pointer; transition: all 0.3s ease;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .submit-btn:hover { background: #C9A96E; transform: scale(1.02); }
        .submit-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="contact-page bg-white min-h-screen">
        <AnimatePresence>
          {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
        </AnimatePresence>

        <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-neutral-100">
          <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
        </div>

        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <CartDrawer />
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main className="pt-28 pb-32">

          {/* ── HERO ── */}
          <section className="text-center px-6 pt-20 pb-24 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="pill-chip mb-8 inline-flex">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
                Rahmani Perfumery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="contact-hero-title text-6xl md:text-8xl font-semibold text-[#1A1A1A] mt-6 mb-8 leading-[1.05]"
            >
              Let&apos;s start<br/>a conversation.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-neutral-500 font-light leading-relaxed max-w-2xl mx-auto"
            >
              Whether you&apos;re curious about our collections, want a custom attar blend, or just want to say hello — we&apos;d love to hear from you.
            </motion.p>
          </section>

          {/* ── CONTACT INFO CARDS + FORM ── */}
          <section className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">

            {/* Info Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24"
            >
              {[
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: 'Address', title: 'Kankarbagh Main Road', sub: 'Patna, Bihar 800020'
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.1 19.79 19.79 0 0 1 1.06 3.47A2 2 0 0 1 3.04 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>,
                  label: 'Phone', title: '+91 83409 44998', sub: 'Mon–Sat, 10AM–9PM'
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  label: 'Email', title: 'rahmaniperfumery', sub: 'patna@gmail.com'
                },
                {
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'Hours', title: 'Mon – Sat 10AM–9PM', sub: 'Sunday 11AM–7PM'
                },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="info-card"
                >
                  <div className="info-icon">{card.icon}</div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-semibold">{card.label}</p>
                  <p className="text-[15px] font-medium text-[#1A1A1A] leading-snug">{card.title}</p>
                  <p className="text-[13px] text-neutral-400 font-light">{card.sub}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#FAFAF9] border border-[#F0EDE8] rounded-[40px] p-8 md:p-14 lg:p-20"
            >
              <div className="max-w-[900px]">
                <p className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold mb-4">Send a Message</p>
                <h2 className="contact-hero-title text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-4 leading-tight">
                  We&apos;d love to help.
                </h2>
                <p className="text-neutral-400 text-base mb-14 font-light">
                  Fill in the form and our team will get back to you within 24 hours.
                </p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-24 flex flex-col items-start gap-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div>
                        <h3 className="contact-hero-title text-4xl font-semibold text-[#1A1A1A] mb-3">Message sent.</h3>
                        <p className="text-neutral-400 text-lg font-light">Our team will reach out shortly. Thank you for choosing Rahmani Perfumery.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field name="name" label="Full Name" placeholder="Your full name" />
                        <Field name="email" label="Email Address" type="email" placeholder="you@example.com" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field name="phone" label="Phone Number" type="tel" placeholder="+91 00000 00000" />
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-medium tracking-widest uppercase text-neutral-400">Topic</label>
                          <div className="relative">
                            <select
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                              className="select-field"
                            >
                              <option value="" disabled>Choose a topic</option>
                              <option value="general">General Inquiry</option>
                              <option value="custom">Custom Attar Blend</option>
                              <option value="order">Order Related</option>
                              <option value="bulk">Bulk / Wholesale</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium tracking-widest uppercase text-neutral-400">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                          required
                          rows={6}
                          className="textarea-field"
                        />
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-6 pt-2">
                        <p className="text-sm text-neutral-400 font-light">
                          Custom attar blends are also available — just let us know in your message.
                        </p>
                        <button type="submit" className="submit-btn">
                          Send Message
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>

          {/* ── MAP ── */}
          <section className="px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold mb-3">Find Us</p>
                <h2 className="contact-hero-title text-4xl font-semibold text-[#1A1A1A]">Visit our store</h2>
              </div>
              <a
                href="https://maps.google.com/?q=Rahmani+Perfumery+Patna"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#C9A96E] font-medium flex items-center gap-2 hover:gap-3 transition-all"
              >
                Directions
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
            <div className="w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden border border-neutral-100 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.9!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM1JzM4LjgiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rahmani Perfumery Location"
              />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
