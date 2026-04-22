'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Great_Vibes, Playfair_Display } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import GlobalSearch from '@/components/GlobalSearch';
import Preloader from '@/components/ui/preloader';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

/* ── Floating Petal / Leaf SVG Components ── */
const Petal = ({ style, className }: { style: React.CSSProperties; className?: string }) => (
  <svg viewBox="0 0 30 50" fill="none" className={className} style={style}>
    <path d="M15 0C15 0 30 15 30 30C30 45 15 50 15 50C15 50 0 45 0 30C0 15 15 0 15 0Z" fill="currentColor" />
  </svg>
);

const Leaf = ({ style, className }: { style: React.CSSProperties; className?: string }) => (
  <svg viewBox="0 0 60 30" fill="none" className={className} style={style}>
    <path d="M0 15C0 15 10 0 30 0C50 0 60 15 60 15C60 15 50 30 30 30C10 30 0 15 0 15Z" fill="currentColor" />
    <path d="M5 15C5 15 15 5 30 5" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />
  </svg>
);

/* ── Floating Elements Generator ── */
function FloatingElements() {
  const [elements, setElements] = useState<Array<{
    id: number; type: 'petal' | 'leaf'; x: number; y: number;
    size: number; rotation: number; delay: number; duration: number; opacity: number; color: string;
  }>>([]);

  useEffect(() => {
    // Soft white, pale gold, blush pink
    const colors = ['#ffffff', '#F4E4C6', '#FBEAE7'];
    const els = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      type: (i % 3 === 0 ? 'leaf' : 'petal') as 'petal' | 'leaf',
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      delay: Math.random() * 8,
      duration: 15 + Math.random() * 12,
      opacity: 0.4 + Math.random() * 0.4,
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
            <Leaf style={{ width: el.size * 1.8, height: el.size, color: '#FDF7F5' }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

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
  const inputClass = "w-full bg-[#fcf9f8] border border-[#E8DCCB] rounded-xl py-4 px-6 text-[#5A4A42] text-base font-light placeholder:text-[#A6998F] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300";

  return (
    <div className="bg-[#FAF5F2] min-h-screen text-[#5A4A42] selection:bg-[#D4AF37] selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Soft gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at top, #FFF 0%, #FAF5F2 100%)' }} />

      <AnimatePresence>
        {showPreloader && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {/* Adding a custom class for header if needed to make it light, but using existing Header component */}
      <div className="fixed top-0 w-full z-50 mix-blend-difference">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} onSearchOpen={() => setIsSearchOpen(true)} />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <FloatingElements />

      <main className="relative z-20 w-full pt-36">

        {/* ── HERO ── */}
        <section className="relative w-full flex flex-col items-center justify-center text-center px-5 md:px-12 pb-16">
          <div className="relative z-10 max-w-[1000px] mx-auto w-full flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${greatVibes.className} text-5xl md:text-6xl text-[#C8A97E] mb-6`}
            >
              We would love to hear from you!
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl leading-tight text-[#4A3C34] mb-8 font-serif tracking-tight`}
            >
              Get in <span className="text-[#D4AF37] italic">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-light text-[#736357] text-lg md:text-xl max-w-3xl mx-auto tracking-wide leading-relaxed"
            >
              Ask any query or just drop your doubt. Whether it's about our signature collections or our exclusive <strong className="text-[#C8A97E] font-medium">custom blend of attars available</strong>, our experts are here to guide you.
            </motion.p>
          </div>
        </section>

        {/* ── CONTACT DETAILS + FORM ── */}
        <section className="relative w-full py-12 md:py-20 px-5 md:px-12">
          
          <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

            {/* Left — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-16 lg:sticky lg:top-40"
            >
              
              <div className="space-y-10">
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
                    className="flex items-start gap-6 group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#FAF5F2] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">{item.label}</p>
                      <p className="text-[#5A4A42] text-base whitespace-pre-line leading-relaxed font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social */}
              <div className="pt-8 border-t border-[#E8DCCB]">
                <p className="font-sans text-xs uppercase tracking-widest text-[#C8A97E] mb-6 font-semibold">Connect Digitally</p>
                <div className="flex gap-8">
                  {['Instagram', 'WhatsApp', 'Facebook'].map((s) => (
                    <a key={s} href="#" className="text-sm uppercase tracking-widest text-[#736357] hover:text-[#D4AF37] transition-all duration-300 font-medium">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-8 md:p-14 lg:p-16 rounded-[2rem] shadow-[0_20px_50px_rgba(90,74,66,0.05)] border border-white relative overflow-hidden">
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FFF9F0] to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

                <h2 className={`${playfair.className} text-3xl md:text-5xl mb-4 text-[#4A3C34]`}>
                  Send an <span className="text-[#D4AF37] italic">Inquiry</span>
                </h2>
                <p className="text-[#A6998F] text-sm uppercase tracking-widest mb-12 font-medium">Experience bespoke service</p>

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
                        className="w-24 h-24 rounded-full bg-[#FAF5F2] flex items-center justify-center mb-8"
                      >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <h3 className={`${playfair.className} text-4xl mb-4 text-[#4A3C34]`}>Message Received</h3>
                      <p className="text-[#736357] text-lg font-light max-w-sm">Thank you. Our artisans will be in touch with you shortly.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8 relative z-10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#A6998F] font-semibold pl-2">Your Name *</label>
                          <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#A6998F] font-semibold pl-2">Email Address *</label>
                          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#A6998F] font-semibold pl-2">Phone Number</label>
                          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-[#A6998F] font-semibold pl-2">Subject *</label>
                          <select name="subject" value={formData.subject} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer bg-no-repeat`} style={{ backgroundPosition: 'right 1.5rem center', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A6998F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundSize: '1.2em 1.2em' }}>
                            <option value="" disabled>Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="custom">Custom Attar Blend</option>
                            <option value="order">Order Related</option>
                            <option value="bulk">Bulk / Wholesale</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[#A6998F] font-semibold pl-2">Your Message *</label>
                        <textarea
                          name="message" value={formData.message} onChange={handleChange}
                          placeholder="How can we help you today?" required rows={5}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#4A3C34] text-white font-semibold uppercase text-sm tracking-widest py-5 rounded-xl hover:bg-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#4A3C34]/10 mt-4"
                      >
                        Submit Inquiry
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── MAP SECTION ── */}
        <section className="relative w-full px-5 md:px-12 pb-24 pt-12">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] mb-3 font-bold">Discover</p>
                <h2 className={`${playfair.className} text-4xl md:text-5xl text-[#4A3C34]`}>Our <span className="text-[#D4AF37] italic">Location</span></h2>
              </div>
              <a
                href="https://maps.google.com/?q=Rahmani+Perfumery+Patna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-[#4A3C34] hover:text-[#D4AF37] transition-colors border-b-2 border-[#D4AF37] pb-1 font-semibold"
              >
                Open in Maps
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full h-[450px] md:h-[600px] bg-white p-3 md:p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(90,74,66,0.08)]"
            >
              <div className="w-full h-full overflow-hidden rounded-[1.5rem]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.9!2d85.1376!3d25.5941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM1JzM4LjgiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1) opacity(0.9) hue-rotate(340deg)' }}
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
