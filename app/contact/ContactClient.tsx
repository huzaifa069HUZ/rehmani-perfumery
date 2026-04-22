'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function ContactClient() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', comment: '' });
  };

  // Ultra-minimalist sharp input style exactly like the screenshot
  const inputClass = "w-full bg-white border border-[#D1CCC5] rounded-none py-3 px-4 text-[#3E322C] text-sm font-light placeholder:text-[#88817A] focus:outline-none focus:border-[#8A6D4B] transition-colors duration-300";

  return (
    <div className={`bg-white min-h-screen text-[#3E322C] selection:bg-[#8A6D4B] selection:text-white ${inter.className} relative`}>
      
      {/* Dark banner for header legibility */}
      <div className="fixed top-0 w-full z-50 bg-[#3E322C]">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
      </div>

      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="relative z-20 w-full pt-32 pb-32">

        <section className="w-full px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto mt-16 flex flex-col lg:flex-row gap-20">
          
          {/* Left Column - Contact Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3 flex flex-col gap-12"
          >
            <div>
              <p className="uppercase tracking-[0.2em] text-[#8A6D4B] text-xs font-semibold mb-3">Get in Touch</p>
              <h1 className={`${playfair.className} text-4xl text-[#3E322C] mb-6`}>Our Information</h1>
              <p className="font-light text-[#736357] text-sm leading-relaxed mb-10">
                We would love to hear from you! Ask any query or just drop your doubt. Whether it's about our signature collections or our exclusive custom blend of attars available, our experts are here to guide you.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Clean minimalist icons using SVG */}
              <div className="flex items-start gap-5">
                <div className="mt-1 text-[#8A6D4B]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h4 className="text-[#3E322C] font-medium text-sm mb-1 uppercase tracking-widest">Visit Us</h4>
                  <p className="text-[#736357] text-sm font-light leading-relaxed">Kankarbagh Main Road,<br/>Patna, Bihar 800020</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="mt-1 text-[#8A6D4B]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4 className="text-[#3E322C] font-medium text-sm mb-1 uppercase tracking-widest">Call Us</h4>
                  <p className="text-[#736357] text-sm font-light leading-relaxed">+91 83409 44998</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="mt-1 text-[#8A6D4B]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-[#3E322C] font-medium text-sm mb-1 uppercase tracking-widest">Email</h4>
                  <p className="text-[#736357] text-sm font-light leading-relaxed">rahmaniperfumerypatna<br/>@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form strictly matching the screenshot */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-2/3"
          >
            <h2 className={`${playfair.className} text-[2.75rem] text-[#111111] mb-12`}>Contact</h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20"
                >
                  <h3 className={`${playfair.className} text-3xl mb-4 text-[#3E322C]`}>Thank You</h3>
                  <p className="text-[#736357] text-base font-light">Your message has been sent successfully. We will get back to you soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 max-w-3xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Name" 
                      className={inputClass} 
                    />
                    <input 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="Email *" 
                      required 
                      className={inputClass} 
                    />
                  </div>
                  
                  <input 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone number" 
                    className={inputClass} 
                  />
                  
                  <textarea
                    name="comment" 
                    value={formData.comment} 
                    onChange={handleChange}
                    placeholder="Comment" 
                    rows={6}
                    className={`${inputClass} resize-none`}
                  />
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#947754] text-white font-normal text-[15px] tracking-wide px-12 py-3.5 hover:bg-[#7D6446] transition-colors rounded-none"
                    >
                      Send
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
