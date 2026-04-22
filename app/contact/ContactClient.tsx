'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Great_Vibes } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });

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
    size: number; rotation: number; delay: number; duration: number; opacity: number; color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#dcb47b', '#d4af37', '#e6dec8'];
    const els = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      type: (i % 3 === 0 ? 'leaf' : 'petal') as 'petal' | 'leaf',
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 25,
      rotation: Math.random() * 360,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.15,
      color: colors[i % colors.length]
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
            <Petal style={{ width: el.size, height: el.size * 1.6, color: el.color }} />
          ) : (
            <Leaf style={{ width: el.size * 1.8, height: el.size, color: '#1a2415' }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

const HF = "font-['Cinzel',_serif] uppercase tracking-wider";

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

  const inputClass = "w-full bg-transparent border-b border-[#dcb47b]/30 py-4 px-0 text-[#e6dec8] text-sm font-light tracking-wide placeholder:text-[#dcb47b]/40 focus:outline-none focus:border-[#d4af37] transition-colors duration-500";

  return (
    <div className="bg-[#0a0c0a] min-h-screen text-[#e6dec8] selection:bg-[#d4af37] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at top, rgba(26,36,21,0.5) 0%, rgba(10,12,10,1) 50%)' }} />

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

      <main className="relative z-20 w-full pt-32">

        {/* ── HERO ── */}
        <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center text-center px-5 md:px-12">
          
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/assets/floral-transparent-pattern.png")', backgroundSize: '400px' }} />

          <div className="relative z-10 max-w-[1000px] mx-auto w-full flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${greatVibes.className} text-4xl md:text-5xl text-[#dcb47b] mb-4`}
            >
              We would love to hear from you!
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className={`${HF} text-4xl md:text-6xl lg:text-7xl leading-tight text-white mb-6 drop-shadow-lg`}
            >
              GET IN <span className="text-[#d4af37]">TOUCH</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-light text-[#dcb47b]/80 text-sm md:text-base max-w-2xl mx-auto tracking-wide leading-relaxed"
            >
              Ask any query or just drop your doubt. Whether it's about our signature collections or our exclusive <strong className="text-[#d4af37] font-medium">custom blend of attars available</strong>, our experts are here to guide you.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-12"
            />
          </div>
        </section>

        {/* ── CONTACT DETAILS + FORM ── */}
        <section className="relative w-full py-16 md:py-24 px-5 md:px-12">
          
          <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
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
                    className="flex flex-col gap-3 group"
                  >
                    <span className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 origin-left drop-shadow-md">{item.icon}</span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#dcb47b] mb-2">{item.label}</p>
                      <p className="text-[#e6dec8]/80 text-sm whitespace-pre-line leading-relaxed font-light">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social */}
              <div className="pt-8 border-t border-[#dcb47b]/20">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#dcb47b] mb-6">Connect Digitally</p>
                <div className="flex gap-8">
                  {['Instagram', 'WhatsApp', 'Facebook'].map((s) => (
                    <a key={s} href="#" className="text-xs uppercase tracking-widest text-[#e6dec8]/60 hover:text-[#d4af37] transition-all duration-300 border-b border-transparent hover:border-[#d4af37] pb-1">
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
              <div className="bg-[#121612]/60 backdrop-blur-md border border-[#dcb47b]/20 p-8 md:p-12 relative overflow-hidden shadow-2xl rounded-sm">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/60" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/60" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/60" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/60" />

                <h2 className={`${HF} text-2xl md:text-3xl mb-3 text-white`}>
                  SEND AN <span className="text-[#d4af37]">INQUIRY</span>
                </h2>
                <p className="text-[#dcb47b]/70 text-xs font-mono uppercase tracking-widest mb-10">Experience bespoke service</p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 rounded-full border border-[#d4af37] flex items-center justify-center mb-6 bg-[#d4af37]/10"
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <h3 className={`${HF} text-2xl mb-3 text-white`}>MESSAGE RECEIVED</h3>
                      <p className="text-[#e6dec8]/70 text-sm font-light">Thank you. Our artisans will be in touch with you shortly.</p>
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
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="YOUR NAME *" required className={inputClass} />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="EMAIL ADDRESS *" required className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="PHONE NUMBER" className={inputClass} />
                        <select name="subject" value={formData.subject} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                          <option value="" disabled className="bg-[#0a0c0a] text-[#dcb47b]/50">SELECT SUBJECT *</option>
                          <option value="general" className="bg-[#0a0c0a] text-white">General Inquiry</option>
                          <option value="custom" className="bg-[#0a0c0a] text-[#d4af37]">Custom Attar Blend</option>
                          <option value="order" className="bg-[#0a0c0a] text-white">Order Related</option>
                          <option value="bulk" className="bg-[#0a0c0a] text-white">Bulk / Wholesale</option>
                        </select>
                      </div>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        placeholder="YOUR MESSAGE *" required rows={4}
                        className={`${inputClass} resize-none`}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-[#b59530] via-[#d4af37] to-[#b59530] text-black font-semibold uppercase text-xs tracking-[0.2em] py-5 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] rounded-sm"
                      >
                        SUBMIT INQUIRY
                        <span className="w-5 h-5 rounded-full border border-black/40 flex items-center justify-center text-[10px]">↗</span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="relative w-full px-5 md:px-12 pb-20">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#dcb47b]/20 pb-6"
            >
              <div>
                <h2 className={`${HF} text-3xl md:text-4xl text-white drop-shadow-md`}>LOCATE <span className="text-[#d4af37]">US</span></h2>
                <p className={`${greatVibes.className} text-2xl text-[#dcb47b] mt-2`}>Experience the essence in person</p>
              </div>
              <a
                href="https://maps.google.com/?q=Rahmani+Perfumery+Patna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#dcb47b] hover:text-white transition-colors pb-1 w-fit border border-[#dcb47b]/30 px-5 py-3 rounded-full hover:bg-[#dcb47b]/10"
              >
                Open in Maps
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-[400px] md:h-[550px] border border-[#dcb47b]/20 overflow-hidden rounded-sm shadow-2xl shadow-black/50"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.9!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM1JzM4LjgiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'sepia(40%) hue-rotate(60deg) saturate(1.5) brightness(0.6) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rahmani Perfumery Location"
              />
              {/* Map overlay gradient */}
              <div className="absolute inset-0 bg-[#0a0c0a]/20 pointer-events-none" />
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
