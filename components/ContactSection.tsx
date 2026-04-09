'use client';
import { useState } from 'react';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };
  const [activeMap, setActiveMap] = useState<'phulwari' | 'sabzibagh'>('phulwari');

  const maps = {
    phulwari: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.8668345210626!2d85.06325047539423!3d25.576096777468965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a9bcfa4d1d0b%3A0x6579f31439ab90f9!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1775753313594!5m2!1sen!2sin",
    sabzibagh: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.6423600433177!2d85.15261928021742!3d25.61679781928205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59956165aef5%3A0xd5cbe379c9c2e72c!2sRahmani%20Perfumery!5e0!3m2!1sen!2sin!4v1775753440030!5m2!1sen!2sin"
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <p className="contact-subtitle">VISIT US OR GET IN TOUCH</p>
          <h2 className="contact-title">Experiencing True Luxury</h2>
          <div className="title-divider">
            <span className="line" />
            <span className="diamond">◆</span>
            <span className="line" />
          </div>
        </div>

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
                  <input type="text" placeholder="Your Name" required className="form-input" />
                  <input type="tel" placeholder="Your Phone Number" required className="form-input" />
                </div>
                <textarea placeholder="How can we help you?" required className="form-input form-textarea" rows={4}></textarea>
                <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading || success}>
                  {loading ? 'Sending...' : success ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Map */}
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
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="google-map"
              title={`${activeMap === 'phulwari' ? 'Phulwari' : 'Sabzibagh'} Location`}
            />
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 80px 20px;
          background-color: #fbfbf9;
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
          gap: 40px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .contact-content {
          padding: 50px;
          display: flex;
          flex-direction: column;
          gap: 40px;
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
          background: #fbfbf9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          border: 1px solid rgba(212, 175, 95, 0.2);
          transition: transform 0.3s ease;
        }

        .info-card:hover .icon-wrap {
          transform: scale(1.05);
          background: var(--gold);
          color: #fff;
        }

        .info-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          font-weight: 600;
        }

        .info-value {
          font-size: 1.05rem;
          color: var(--text);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .info-value:hover {
          color: var(--gold);
        }

        .form-wrapper {
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 30px;
        }

        .form-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--text);
          margin-bottom: 8px;
        }

        .form-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          background: #fafaf8;
          transition: all 0.3s;
          color: var(--text);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(212, 175, 95, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          padding: 16px;
          background: var(--charcoal, #1a1a1a);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--gold);
        }

        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .map-wrapper {
          position: relative;
          width: 100%;
          min-height: 500px;
          background: #e9e9de;
        }

        .google-map {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          filter: contrast(1.1) saturate(1.1);
        }

        .map-overlay {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 6px;
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          z-index: 10;
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
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .toggle-btn.active {
          color: var(--text);
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .map-wrapper {
            min-height: 400px;
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
  );
}
