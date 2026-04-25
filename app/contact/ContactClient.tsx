'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';
import Image from 'next/image';

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

  const FloatingInput = ({
    name, label, type = 'text', required = false, isTextarea = false
  }: {
    name: string; label: string; type?: string; required?: boolean; isTextarea?: boolean;
  }) => {
    const isFocused = focused === name;
    const hasValue = (formData as any)[name].length > 0;
    const active = isFocused || hasValue;

    return (
      <div className="relative w-full mb-8">
        <label
          className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium ${
            active ? '-top-5 text-xs text-[#C9A96E] tracking-widest uppercase' : 'top-3 text-base text-neutral-400'
          }`}
        >
          {label} {required && '*'}
        </label>
        
        {isTextarea ? (
          <textarea
            name={name}
            required={required}
            value={(formData as any)[name]}
            onChange={handleChange}
            onFocus={() => setFocused(name)}
            onBlur={() => setFocused('')}
            rows={4}
            className="w-full bg-transparent border-b border-neutral-300 py-3 text-lg text-neutral-900 outline-none transition-colors duration-300 focus:border-[#C9A96E] resize-none"
          />
        ) : (
          <input
            name={name}
            type={type}
            required={required}
            value={(formData as any)[name]}
            onChange={handleChange}
            onFocus={() => setFocused(name)}
            onBlur={() => setFocused('')}
            className="w-full bg-transparent border-b border-neutral-300 py-3 text-lg text-neutral-900 outline-none transition-colors duration-300 focus:border-[#C9A96E]"
          />
        )}
        {/* Animated bottom border */}
        <div className={`absolute bottom-0 left-0 h-[1px] bg-[#C9A96E] transition-all duration-500 ease-out ${isFocused ? 'w-full' : 'w-0'}`} />
      </div>
    );
  };

  return (
    <>
      <style>{`
        .contact-heading { font-family: "Georgia", "Times New Roman", serif; }
        .contact-body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>

      <div className="contact-body bg-[#FAFAF9] min-h-screen text-[#1A1A1A]">
        <AnimatePresence>
          {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
        </AnimatePresence>

        <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 transition-all duration-300">
          <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
        </div>

        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <CartDrawer />
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main className="flex flex-col lg:flex-row min-h-screen w-full">
          
          {/* ── LEFT PANE: STICKY IMAGE ── */}
          <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden">
            <Image
              src="/assets/SMELL THAT DEFINES YOU.png"
              alt="Rahmani Perfumery Brand"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Elegant overlay to ensure brand text readability if any */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#FAFAF9]/10" />
            
            {/* Optional overlay brand text (can be removed if image speaks for itself) */}
            <div className="absolute bottom-12 left-8 lg:left-12 lg:bottom-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
                className="contact-heading text-4xl lg:text-5xl text-white drop-shadow-lg"
              >
                The Essence of <br /> Elegance
              </motion.h2>
            </div>
          </div>

          {/* ── RIGHT PANE: SCROLLING CONTENT ── */}
          <div className="w-full lg:w-1/2 px-8 py-20 md:px-16 lg:px-24 lg:py-36 xl:px-32 flex flex-col justify-center bg-[#FAFAF9]">
            
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#C9A96E] mb-4">Concierge Services</p>
              <h1 className="contact-heading text-5xl md:text-6xl text-[#1A1A1A] mb-8 leading-tight">
                Get in touch.
              </h1>
              <p className="text-neutral-500 font-light text-lg md:text-xl leading-relaxed max-w-lg mb-16">
                Whether you desire a bespoke attar blend, have inquiries about our curated collections, or require private viewing appointments, our concierge is at your service.
              </p>
            </motion.div>

            {/* ── CONTACT GRID ── */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
            >
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-2">
                  <MapPin strokeWidth={1.5} size={18} />
                </div>
                <h3 className="contact-heading text-2xl text-[#1A1A1A]">Our Boutique</h3>
                <p className="text-neutral-500 font-light leading-relaxed mt-1">
                  Kankarbagh Main Road<br />
                  Patna, Bihar 800020
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-2">
                  <Clock strokeWidth={1.5} size={18} />
                </div>
                <h3 className="contact-heading text-2xl text-[#1A1A1A]">Opening Hours</h3>
                <p className="text-neutral-500 font-light leading-relaxed mt-1">
                  Mon – Sat: 10:00 AM – 9:00 PM<br />
                  Sunday: 11:00 AM – 7:00 PM
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-2">
                  <Phone strokeWidth={1.5} size={18} />
                </div>
                <h3 className="contact-heading text-2xl text-[#1A1A1A]">Direct Line</h3>
                <p className="text-neutral-500 font-light leading-relaxed mt-1">
                  +91 83409 44998
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#1A1A1A] mb-2">
                  <Mail strokeWidth={1.5} size={18} />
                </div>
                <h3 className="contact-heading text-2xl text-[#1A1A1A]">Digital Inquiries</h3>
                <p className="text-neutral-500 font-light leading-relaxed mt-1">
                  rahmaniperfumery@gmail.com
                </p>
              </div>
            </motion.div>

            {/* ── DIVIDER ── */}
            <div className="w-full h-[1px] bg-neutral-200 mb-16" />

            {/* ── LUXURY FORM ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <h2 className="contact-heading text-3xl text-[#1A1A1A] mb-10">Send a Message</h2>
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-start gap-6 border border-neutral-200 p-10 bg-white"
                  >
                    <div className="w-12 h-12 rounded-full border border-[#C9A96E] flex items-center justify-center text-[#C9A96E]">
                      <Check size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="contact-heading text-3xl mb-3">Inquiry Received</h3>
                      <p className="text-neutral-500 font-light max-w-sm">
                        Thank you for reaching out. Our concierge team will review your message and contact you shortly.
                      </p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-xs font-semibold tracking-widest uppercase text-[#C9A96E] hover:text-[#1A1A1A] transition-colors"
                    >
                      Return to Form
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <FloatingInput name="name" label="Full Name" required />
                      <FloatingInput name="email" label="Email Address" type="email" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <FloatingInput name="phone" label="Phone Number" type="tel" />
                      
                      <div className="relative w-full mb-8">
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium ${
                          focused === 'subject' || formData.subject ? '-top-5 text-xs text-[#C9A96E] tracking-widest uppercase' : 'top-3 text-base text-neutral-400'
                        }`}>
                          Inquiry Type *
                        </label>
                        <select
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocused('subject')}
                          onBlur={() => setFocused('')}
                          className="w-full bg-transparent border-b border-neutral-300 py-3 text-lg text-neutral-900 outline-none transition-colors duration-300 focus:border-[#C9A96E] appearance-none cursor-pointer"
                          style={{ color: formData.subject ? '#1A1A1A' : 'transparent' }}
                        >
                          <option value="" disabled hidden></option>
                          <option value="general" className="text-black">General Inquiry</option>
                          <option value="custom" className="text-black">Custom Fragrance</option>
                          <option value="appointment" className="text-black">Private Appointment</option>
                          <option value="wholesale" className="text-black">Wholesale & Bulk</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        <div className={`absolute bottom-0 left-0 h-[1px] bg-[#C9A96E] transition-all duration-500 ease-out ${focused === 'subject' ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>

                    <FloatingInput name="message" label="Your Message" required isTextarea />

                    <div className="pt-6">
                      <button 
                        type="submit" 
                        className="group relative overflow-hidden bg-[#1A1A1A] text-white py-5 px-10 text-sm font-semibold tracking-widest uppercase transition-all duration-500 hover:bg-[#C9A96E]"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          Send Inquiry
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
