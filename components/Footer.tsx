import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-brand">Rahmani Perfumery</h3>

            <div className="footer-socials">
              {['instagram', 'facebook', 'youtube'].map(s => {
                let href = '#';
                if (s === 'instagram') href = 'https://www.instagram.com/rahmaniperfumery/';
                if (s === 'facebook') href = 'https://www.facebook.com/p/Rahmani-Perfumery-100092158337982/';
                if (s === 'youtube') href = 'https://www.youtube.com/@rahmaniperfumery1';
                
                return (
                  <a key={s} href={href} target="_blank" rel="noopener noreferrer" aria-label={s} className="social-link">
                    {s === 'instagram' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    )}
                    {s === 'facebook' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                    )}
                    {s === 'youtube' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link href="/attars">Attars & Oud</Link></li>
              <li><Link href="/perfumes">Perfumes</Link></li>
              <li><Link href="/bakhoor">Bakhoor</Link></li>
              <li><Link href="/incense-sticks">Incense Sticks</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/store">Our Stores</Link></li>
              <li><a href="https://wa.me/919835612345?text=Hello%20Rahmani%20Perfumery,%20I%20have%20a%20question." target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><Link href="/track-order">Track Order</Link></li>
              <li><Link href="/store">Shipping & Returns</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>Khagaul Rd, Fiya Colony, Maulana Azad Nagar, Phulwari Sharif, Patna, Bihar 801505</li>
              <li><a href="tel:+919835612345">+91 98356 12345</a></li>
              <li><a href="mailto:rahmaniperfumerypatna@gmail.com">rahmaniperfumerypatna@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <p>© {new Date().getFullYear()} Rahmani Perfumery. All rights reserved.</p>
          
          {/* Developer Signature */}
          <a 
            href="https://wa.me/917488100344?text=hi%20i%20want%20to%20work%20with%20you%20for%20my%20website%20development" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dev-signature"
          >
            <span className="dev-text">BUILT AND DESIGNED BY</span>
            <span className="dev-name">HUZAIFA</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="dev-arrow">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .dev-signature {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 8px;
        }

        .dev-signature:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(211, 169, 88, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dev-text {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #94a3b8;
        }

        .dev-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.85rem;
          font-weight: 700;
          font-style: italic;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #d4af5f 0%, #f9e596 50%, #d4af5f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .dev-arrow {
          color: #d4af5f;
          transition: transform 0.3s ease;
        }

        .dev-signature:hover .dev-arrow {
          transform: translate(2px, -2px);
        }
      `}</style>
    </footer>
  );
}
