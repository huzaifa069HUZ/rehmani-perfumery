'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', comment: '' });
  };

  return (
    <div
      className="bg-white min-h-screen flex flex-col"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-100">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* PAGE BODY */}
      <main className="flex-1 flex flex-col pt-44 pb-32">
        {/* Centred container */}
        <div className="w-full max-w-2xl mx-auto px-6">

          {/* Title */}
          <h1
            className="text-5xl font-normal text-neutral-900 mb-16"
            style={{ letterSpacing: '-0.01em' }}
          >
            Contact
          </h1>

          {submitted ? (
            <p className="text-lg text-neutral-600">Thank you — we&apos;ll be in touch soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Row: Name + Email */}
              <div className="flex gap-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  className="flex-1 border border-neutral-300 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:border-neutral-600 transition-colors bg-white"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  className="flex-1 border border-neutral-300 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:border-neutral-600 transition-colors bg-white"
                />
              </div>

              {/* Phone */}
              <input
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:border-neutral-600 transition-colors bg-white"
              />

              {/* Comment */}
              <textarea
                name="comment"
                placeholder="Comment"
                value={formData.comment}
                onChange={handleChange}
                rows={6}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-500 outline-none focus:border-neutral-600 transition-colors bg-white resize-none"
              />

              {/* Send Button */}
              <div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#8B7355',
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                  className="px-10 py-3 text-sm text-white tracking-wide hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>

            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
