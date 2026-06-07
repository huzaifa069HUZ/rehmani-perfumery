import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-brand">Rahmani Perfumery</h3>
            <p className="footer-text">Premium Arabian attars, oud, and perfumes crafted with pure concentrated oils since 2023. Recognized as one of the best attar shops in Patna, Bihar.</p>
            <div className="footer-socials">
              {['instagram', 'facebook', 'twitter'].map(s => (
                <a key={s} href={s === 'instagram' ? 'https://www.instagram.com/rahmaniperfumery/' : '#'} target={s === 'instagram' ? '_blank' : undefined} rel={s === 'instagram' ? 'noopener noreferrer' : undefined} aria-label={s} className="social-link">
                  {s === 'instagram' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  )}
                  {s === 'facebook' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                  )}
                  {s === 'twitter' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                  )}
                </a>
              ))}
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

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rahmani Perfumery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
