'use client';
import { useState } from 'react';
import SmoothScrollHero from '@/components/ui/smooth-scroll-hero';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const [activeMap, setActiveMap] = useState<'phulwari' | 'sabzibagh'>('phulwari');

  const maps = {
    phulwari: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.866834206912!2d85.06393990077616!3d25.57609678791896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a9bcfa4d1d0b%3A0x6579f31439ab90f9!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1776186526756!5m2!1sen!2sin",
    sabzibagh: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.642358292268!2d85.15491527517806!3d25.616797877443123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59956165aef5%3A0xd5cbe379c9c2e72c!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1776186560023!5m2!1sen!2sin"
  };

  return (
    <>
      <div id="contact" style={{
        background: 'linear-gradient(135deg, #050011 0%, #0e0535 18%, #180850 32%, #0b1a55 48%, #081640 62%, #12063a 78%, #040010 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Multi-layer radial bloom glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: [
            'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(120,40,210,0.18) 0%, transparent 65%)',
            'radial-gradient(ellipse 55% 45% at 85% 60%, rgba(20,80,220,0.16) 0%, transparent 60%)',
            'radial-gradient(ellipse 45% 35% at 50% 90%, rgba(0,160,200,0.10) 0%, transparent 55%)',
            'radial-gradient(ellipse 30% 25% at 70% 10%, rgba(180,100,255,0.08) 0%, transparent 50%)',
          ].join(', '),
        }} />
        {/* Arabic geometric / arabesque pattern — low opacity */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='0.7'%3E%3Cpolygon points='40,4 76,22 76,58 40,76 4,58 4,22'/%3E%3Cpolygon points='40,14 66,28 66,52 40,66 14,52 14,28'/%3E%3Cpolygon points='40,24 56,32 56,48 40,56 24,48 24,32'/%3E%3Cline x1='40' y1='4' x2='40' y2='24'/%3E%3Cline x1='76' y1='22' x2='56' y2='32'/%3E%3Cline x1='76' y1='58' x2='56' y2='48'/%3E%3Cline x1='40' y1='76' x2='40' y2='56'/%3E%3Cline x1='4' y1='58' x2='24' y2='48'/%3E%3Cline x1='4' y1='22' x2='24' y2='32'/%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />

        {/* ── Section heading ── */}
        <section className="contact-section" style={{ paddingBottom: 0, position: 'relative', zIndex: 1 }}>
          <div className="contact-container">
            <div className="contact-header">
              <p className="contact-subtitle" style={{ color: 'rgba(255,255,255,0.75)', letterSpacing: '0.3em' }}>VISIT US OR GET IN TOUCH</p>
              <h2 className="contact-title" style={{
                background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 30%, #d4a843 55%, #fce38a 75%, #b8820a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.55)) drop-shadow(0 0 40px rgba(212,175,55,0.25))',
              }}>Experiencing True Luxury</h2>
              <div className="title-divider">
                <span className="line" style={{ background: 'rgba(126,184,255,0.5)' }} />
                <span className="diamond" style={{ color: '#7eb8ff' }}>◆</span>
                <span className="line" style={{ background: 'rgba(126,184,255,0.5)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Smooth scroll clip-path reveal of outlet image ── */}
        <div style={{ width: '100%', marginBottom: '0', position: 'relative', zIndex: 1, padding: '0 20px' }}>
          <SmoothScrollHero
            desktopImage="/assets/visit-outlet.webp"
            mobileImage="/assets/visit-outlet.webp"
            initialClipPercentage={20}
            finalClipPercentage={80}
            label="Come Find Us"
            sublabel="Visit Our Outlet"
          />
        </div>

        {/* ── Form + Map ── */}
        <section className="contact-section" style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
        <div className="contact-container">
        <div className="contact-grid">
          {/* Left: Contact Info & Form */}
          <div className="contact-content">
            <div className="info-cards">
              <div className="info-card">
                <div className="icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                    <path d="M2 4l10 10L22 4"/>
                  </svg>
                </div>
                <div>
                  <h4 className="info-label">Email Us</h4>
                  <a href="mailto:rahmaniperfumery@gmail.com" className="info-value">rahmaniperfumery@gmail.com</a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="info-label">Call or WhatsApp</h4>
                  <a href="tel:+918340783679" className="info-value">+91 8340783679</a>
                </div>
              </div>
            </div>

            <div className="form-wrapper">
              <h3 className="form-title">Send an Inquiry</h3>
              <p className="form-desc">Looking for a specific attar or need a recommendation? Drop us a message.</p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <input type="text" name="name" placeholder="Your Name" required className="form-input" />
                  <input type="tel" name="phone" placeholder="Your Phone Number" required className="form-input" />
                </div>
                <textarea name="message" placeholder="How can we help you?" required className="form-input form-textarea" rows={4}></textarea>
                <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading || success}>
                  {loading ? 'Sending...' : success ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Leaflet Map */}
          <div className="map-wrapper">
            <div className="map-overlay">
              <div className="map-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${activeMap === 'phulwari' ? 'active' : ''}`}
                  onClick={() => setActiveMap('phulwari')}
                >
                  Phulwari
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${activeMap === 'sabzibagh' ? 'active' : ''}`}
                  onClick={() => setActiveMap('sabzibagh')}
                >
                  Sabzibagh
                </button>
              </div>
            </div>
            <iframe
              key={activeMap}
              src={maps[activeMap]}
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${activeMap === 'phulwari' ? 'Phulwari' : 'Sabzibagh'} Location`}
            />
          </div>
        </div>

        {/* Free demo testing tagline */}
        <div style={{
          textAlign: 'center',
          padding: '36px 20px 8px',
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          <p style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#d4af37',
            marginBottom: '8px',
          }}>
            <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(212,175,55,0.5)' }} />
            Free Unlimited Demo Testing
            <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(212,175,55,0.5)' }} />
          </p>
          <p style={{
            fontSize: 'clamp(0.88rem, 1.5vw, 1.05rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Walk into any of our outlets and explore our entire collection — smell, compare, and experience every attar as many times as you like, absolutely free. No rush, no pressure.
          </p>
        </div>

        </div>

        <style>{`
        .contact-section {
          padding: 80px 20px;
          background: transparent;
          font-family: var(--font-sans);
          position: relative;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .contact-subtitle {
          font-size: 0.8rem;
          color: var(--gold);
          letter-spacing: 0.15em;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .contact-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text);
          font-weight: 700;
          margin-bottom: 16px;
        }

        .title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .title-divider .line {
          height: 1px;
          width: 50px;
          background-color: var(--gold);
          opacity: 0.5;
        }

        .title-divider .diamond {
          color: var(--gold);
          font-size: 10px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2px;
          background: rgba(212,175,55,0.12);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          border: 1px solid rgba(212,175,55,0.18);
        }

        .contact-content {
          padding: 50px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          background: #f7f3ec;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-wrap {
          width: 50px;
          height: 50px;
          background: rgba(212,175,55,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b8860b;
          border: 1px solid rgba(212,175,55,0.25);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .info-card:hover .icon-wrap {
          transform: scale(1.08);
          background: var(--gold);
          color: #fff;
          box-shadow: 0 0 16px rgba(212,175,55,0.35);
        }

        .info-label {
          font-size: 0.75rem;
          color: #8a7c6a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .info-value {
          font-size: 1rem;
          color: #2a2420;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .info-value:hover {
          color: #b8860b;
        }

        .form-wrapper {
          border-top: 1px solid rgba(180,150,80,0.2);
          padding-top: 30px;
        }

        .form-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: #2a2420;
          margin-bottom: 8px;
        }

        .form-desc {
          font-size: 0.9rem;
          color: #8a7c6a;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-row {
          display: flex;
          gap: 14px;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid rgba(180,150,80,0.25);
          border-radius: 8px;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          background: #fffdf8;
          transition: all 0.3s;
          color: #2a2420;
        }

        .form-input::placeholder {
          color: #b5a994;
        }

        .form-input:focus {
          outline: none;
          border-color: #d4af37;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          padding: 15px;
          background: linear-gradient(135deg, #bf953f, #d4af37, #f5e27a, #d4af37, #bf953f);
          background-size: 200% auto;
          color: #0a0520;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.4s;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
        }

        .submit-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 6px 28px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .map-wrapper {
          position: relative;
          width: 100%;
          min-height: 500px;
          background: #060412;
        }

        .map-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(8,6,30,0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 5px;
          border-radius: 30px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2);
          z-index: 1000;
        }

        .map-toggle {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          padding: 8px 18px;
          border-radius: 24px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .toggle-btn.active {
          color: #0a0520;
          background: linear-gradient(135deg, #d4af37, #f5e27a);
          box-shadow: 0 2px 12px rgba(212,175,55,0.4);
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .map-wrapper {
            min-height: 380px;
          }

          .contact-content {
            padding: 30px 20px;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
      </section>
      </div>
    </>
  );
}
