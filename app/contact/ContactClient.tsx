'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

/* ── Floating Petal / Leaf SVG Components ── */
const Petal = ({ style, className }: { style: React.CSSProperties; className?: string }) => (
  <svg viewBox="0 0 30 50" fill="none" className={className} style={style}>
    <path d="M15 0C15 0 30 15 30 30C30 45 15 50 15 50C15 50 0 45 0 30C0 15 15 0 15 0Z" fill="currentColor" />
  </svg>
);

const Leaf = ({ style, className }: { style: React.CSSProperties; className?: string }) => (
  <svg viewBox="0 0 60 30" fill="none" className={className} style={style}>
    <path d="M0 15C0 15 10 0 30 0C50 0 60 15 60 15C60 15 50 30 30 30C10 30 0 15 0 15Z" fill="currentColor" />
    <path d="M5 15C5 15 15 5 30 5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
  </svg>
);

/* ── Floating Elements Generator ── */
function FloatingElements() {
  const [elements, setElements] = useState<Array<{
    id: number; type: 'petal' | 'leaf'; x: number; y: number;
    size: number; rotation: number; delay: number; duration: number; opacity: number;
  }>>([]);

  useEffect(() => {
    const els = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      type: (i % 3 === 0 ? 'leaf' : 'petal') as 'petal' | 'leaf',
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 20,
      rotation: Math.random() * 360,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 10,
      opacity: 0.06 + Math.random() * 0.1,
    }));
    setElements(els);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ x: `${el.x}vw`, y: '-10vh', rotate: el.rotation, opacity: 0 }}
          animate={{
            y: '110vh',
            rotate: el.rotation + 360,
            opacity: [0, el.opacity, el.opacity, 0],
            x: [`${el.x}vw`, `${el.x + (Math.random() - 0.5) * 20}vw`],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
        >
          {el.type === 'petal' ? (
            <Petal style={{ width: el.size, height: el.size * 1.6, color: '#ccff00' }} />
          ) : (
            <Leaf style={{ width: el.size * 1.8, height: el.size, color: '#7a8a3a' }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

const HF = "font-['Impact',_'Arial_Black',_sans-serif] uppercase tracking-[-0.02em]";

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

  const inputClass = "w-full bg-transparent border-b border-white/20 py-3 px-0 text-white text-sm font-light tracking-wide placeholder:text-white/30 focus:outline-none focus:border-[#ccff00] transition-colors duration-500";

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#ccff00] selection:text-black font-sans">
      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <div className="fixed top-0 w-full z-50">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <FloatingElements />

      <main className="relative z-20 w-full">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[60vh] md:min-h-[70vh] flex flex-col justify-end pb-12 md:pb-20 px-5 md:px-12" style={{ paddingTop: 'calc(var(--announce-h) + var(--header-h) + 4vw)' }}>
          {/* Grid lines */}
          <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 divide-x divide-white/[0.06]">
            <div /><div /><div /><div />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className={`${HF} text-[12vw] md:text-[8vw] leading-[0.85]`}
            >
              CONTACT <span className="text-[#ccff00]">US</span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-gradient-to-r from-[#ccff00] to-transparent mt-8 origin-left"
            />
          </div>
        </section>

        {/* ── CONTACT DETAILS + FORM ── */}
        <section className="relative w-full py-16 md:py-24 px-5 md:px-12">
          <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 divide-x divide-white/[0.06]">
            <div /><div /><div /><div />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ccff00] mb-6">Reach Out</p>
                <p className="text-white/60 text-sm leading-relaxed max-w-md">
                  We&apos;d love to hear from you. Whether you have a question about our attars, need a recommendation, or want to place a bulk order — our team is here to help.
                </p>
              </div>

              {/* Info cards */}
              {[
                { label: 'Visit Us', value: 'Kankarbagh Main Road,\nPatna, Bihar 800020', icon: '📍' },
                { label: 'Call Us', value: '+91 83409 44998', icon: '📞' },
                { label: 'Email', value: 'rahmaniperfumerypatna\n@gmail.com', icon: '✉️' },
                { label: 'Hours', value: 'Mon – Sat: 10 AM – 9 PM\nSunday: 11 AM – 7 PM', icon: '🕐' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <span className="text-lg mt-0.5 grayscale group-hover:grayscale-0 transition-all duration-500">{item.icon}</span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">{item.label}</p>
                    <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">{item.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Social */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {['Instagram', 'WhatsApp', 'Facebook'].map((s) => (
                    <a key={s} href="#" className="text-xs uppercase tracking-widest text-white/40 hover:text-[#ccff00] transition-colors duration-300 border-b border-transparent hover:border-[#ccff00] pb-0.5">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="border border-white/10 p-6 md:p-10 relative overflow-hidden">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#ccff00]/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#ccff00]/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#ccff00]/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#ccff00]/40" />

                <h2 className={`${HF} text-2xl md:text-3xl mb-2`}>
                  SEND A <span className="text-[#ccff00]">MESSAGE</span>
                </h2>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-10">We&apos;ll get back within 24 hours</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-16 h-16 rounded-full border-2 border-[#ccff00] flex items-center justify-center mb-6"
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <h3 className={`${HF} text-xl mb-2`}>MESSAGE SENT</h3>
                      <p className="text-white/50 text-sm">Thank you. We&apos;ll be in touch soon.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="YOUR NAME" required className={inputClass} />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="EMAIL ADDRESS" required className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="PHONE NUMBER" className={inputClass} />
                        <select name="subject" value={formData.subject} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                          <option value="" disabled className="bg-black">SELECT SUBJECT</option>
                          <option value="general" className="bg-black">General Inquiry</option>
                          <option value="order" className="bg-black">Order Related</option>
                          <option value="bulk" className="bg-black">Bulk / Wholesale</option>
                          <option value="feedback" className="bg-black">Feedback</option>
                        </select>
                      </div>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        placeholder="YOUR MESSAGE" required rows={4}
                        className={`${inputClass} resize-none`}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#ccff00] text-black font-bold uppercase text-xs tracking-[0.2em] py-4 hover:bg-[#d8ff4d] transition-colors duration-300 flex items-center justify-center gap-3"
                      >
                        SEND MESSAGE
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[11px]">↗</span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="relative w-full px-5 md:px-12 pb-0">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ccff00] mb-3">Find Us</p>
                <h2 className={`${HF} text-3xl md:text-4xl`}>OUR <span className="text-[#ccff00]">LOCATION</span></h2>
              </div>
              <a
                href="https://maps.google.com/?q=Rahmani+Perfumery+Patna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-[#ccff00] transition-colors border-b border-white/20 hover:border-[#ccff00] pb-1 w-fit"
              >
                Open in Google Maps
                <span className="text-[10px]">↗</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-[350px] md:h-[500px] border border-white/10 overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.9!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM1JzM4LjgiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.7)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rahmani Perfumery Location"
              />
              {/* Map overlay gradient */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* ── BOTTOM CTA STRIP ── */}
        <section className="relative w-full py-20 md:py-28 px-5 md:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none grid grid-cols-4 divide-x divide-white/[0.06]">
            <div /><div /><div /><div />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`${HF} text-[10vw] md:text-[6vw] leading-[0.85] mb-6`}
            >
              LET&apos;S CREATE <br />
              <span className="text-[#ccff00]">SOMETHING BEAUTIFUL</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/40 text-sm font-mono uppercase tracking-widest"
            >
              Rahmani Perfumery — Patna, India
            </motion.p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
