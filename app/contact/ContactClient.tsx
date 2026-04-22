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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handlePreloaderComplete = useCallback(() => setShowPreloader(false), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  // Modern, large clean input style
  const inputClass = "w-full bg-white border border-[#E8DCCB] rounded-2xl py-5 px-8 text-[#5A4A42] text-lg font-light placeholder:text-[#BDB1A6] focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all duration-300 shadow-sm";

  return (
    <div className={`bg-[#FAF6F4] min-h-screen text-[#5A4A42] selection:bg-[#D4AF37] selection:text-white ${inter.className} relative overflow-x-hidden`}>
      
      {/* 
        Header is white by default on the site. We add a dark elegant background strictly behind the header 
        so the navigation links remain visible without breaking the global component. 
      */}
      <div className="fixed top-0 w-full z-50 bg-[#3E322C]">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
      </div>

      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#F4EBE6] blur-[120px] opacity-70" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#FDFBF9] blur-[150px] opacity-90" />
      </div>

      <main className="relative z-20 w-full pt-40 pb-32">

        {/* ── HERO ── */}
        <section className="w-full flex flex-col items-center justify-center text-center px-6 md:px-16 pt-10 pb-20 md:pb-32">
          <div className="max-w-[900px] mx-auto w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
              <span className="uppercase tracking-[0.3em] text-[#D4AF37] text-sm font-semibold">We would love to hear from you</span>
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className={`${playfair.className} text-6xl md:text-8xl lg:text-[7rem] leading-[1.1] text-[#3E322C] mb-10 tracking-tight`}
            >
              Get in <span className="text-[#D4AF37] italic">Touch</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-light text-[#736357] text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
            >
              Ask any query or just drop your doubt. Whether it's about our signature collections or our exclusive <span className="text-[#C8A97E] font-medium border-b border-[#C8A97E]/30 pb-1">custom blend of attars available</span>, our experts are here to guide you.
            </motion.p>
          </div>
        </section>

        {/* ── CONTACT DETAILS + FORM ── */}
        <section className="w-full px-6 md:px-16 mb-32">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col gap-16"
            >
              <div className="space-y-12">
                <h3 className={`${playfair.className} text-4xl text-[#3E322C] border-b border-[#E8DCCB] pb-6`}>
                  Contact Information
                </h3>
                
                {/* Info cards */}
                <div className="flex flex-col gap-10">
                  {[
                    { label: 'Visit Our Store', value: 'Kankarbagh Main Road,\nPatna, Bihar 800020', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                    { label: 'Call Us Directly', value: '+91 83409 44998', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                    { label: 'Email Address', value: 'rahmaniperfumerypatna\n@gmail.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Opening Hours', value: 'Mon – Sat: 10 AM – 9 PM\nSunday: 11 AM – 7 PM', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="flex items-start gap-8 group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#D4AF37] shadow-sm group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500 flex-shrink-0">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-sm uppercase tracking-widest text-[#A6998F] font-semibold mb-2">{item.label}</p>
                        <p className="text-[#3E322C] text-lg whitespace-pre-line leading-relaxed font-medium">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="pt-12 border-t border-[#E8DCCB]">
                <p className="text-sm uppercase tracking-widest text-[#A6998F] mb-8 font-semibold">Connect Digitally</p>
                <div className="flex gap-10">
                  {['Instagram', 'WhatsApp', 'Facebook'].map((s) => (
                    <a key={s} href="#" className="text-base uppercase tracking-widest text-[#3E322C] hover:text-[#D4AF37] transition-all duration-300 font-semibold border-b-2 border-transparent hover:border-[#D4AF37] pb-2">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-10 md:p-16 lg:p-20 rounded-[3rem] shadow-[0_30px_60px_rgba(62,50,44,0.05)] border border-[#E8DCCB]/30 relative">
                
                <h2 className={`${playfair.className} text-4xl md:text-5xl mb-6 text-[#3E322C]`}>
                  Send an <span className="text-[#D4AF37] italic">Inquiry</span>
                </h2>
                <p className="text-[#A6998F] text-base mb-16 font-light">Fill out the form below and our artisans will reach out to you within 24 hours.</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-32 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-28 h-28 rounded-full bg-[#FAF6F4] flex items-center justify-center mb-8"
                      >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <h3 className={`${playfair.className} text-4xl mb-6 text-[#3E322C]`}>Message Received</h3>
                      <p className="text-[#736357] text-xl font-light max-w-md">Thank you. Our team has received your inquiry and will be in touch shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-sm tracking-widest text-[#736357] font-medium pl-2">Your Name <span className="text-[#D4AF37]">*</span></label>
                          <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputClass} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm tracking-widest text-[#736357] font-medium pl-2">Email Address <span className="text-[#D4AF37]">*</span></label>
                          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className={inputClass} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-sm tracking-widest text-[#736357] font-medium pl-2">Phone Number</label>
                          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" className={inputClass} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm tracking-widest text-[#736357] font-medium pl-2">Subject <span className="text-[#D4AF37]">*</span></label>
                          <select name="subject" value={formData.subject} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer bg-no-repeat`} style={{ backgroundPosition: 'right 1.5rem center', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A6998F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '1.2em 1.2em' }}>
                            <option value="" disabled>Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="custom">Custom Attar Blend</option>
                            <option value="order">Order Related</option>
                            <option value="bulk">Bulk / Wholesale</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm tracking-widest text-[#736357] font-medium pl-2">Your Message <span className="text-[#D4AF37]">*</span></label>
                        <textarea
                          name="message" value={formData.message} onChange={handleChange}
                          placeholder="How can we help you today?" required rows={6}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#3E322C] text-white font-medium uppercase text-base tracking-[0.2em] py-6 rounded-2xl hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-4 shadow-xl shadow-[#3E322C]/10 mt-8"
                      >
                        Submit Inquiry
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="w-full px-6 md:px-16 pb-24">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div>
                <p className="uppercase tracking-[0.3em] text-[#D4AF37] text-sm font-bold mb-4">Discover</p>
                <h2 className={`${playfair.className} text-5xl md:text-6xl text-[#3E322C]`}>Our <span className="text-[#D4AF37] italic">Location</span></h2>
              </div>
              <a
                href="https://maps.google.com/?q=Rahmani+Perfumery+Patna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-base uppercase tracking-widest text-[#3E322C] hover:text-[#D4AF37] transition-colors border-b-2 border-[#D4AF37] pb-2 font-semibold"
              >
                Open in Google Maps
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-[500px] md:h-[700px] bg-white p-4 md:p-6 rounded-[3rem] shadow-[0_30px_60px_rgba(62,50,44,0.08)]"
            >
              <div className="w-full h-full overflow-hidden rounded-[2rem]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.9!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM1JzM4LjgiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.2) contrast(1.05) sepia(0.2) hue-rotate(340deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rahmani Perfumery Location"
                />
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
