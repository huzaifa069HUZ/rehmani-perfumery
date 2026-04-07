export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-brand">rahmani</h3>
            <p className="footer-text">Premium Arabian attars crafted with pure essential oils since 2015.</p>
            <div className="footer-socials">
              {['instagram', 'facebook', 'twitter'].map(s => (
                <a key={s} href="#" aria-label={s} className="social-link">
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
              {['New Arrivals', 'Best Sellers', 'Gift Sets', 'Sale'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              {['Contact Us', 'Shipping', 'Returns', 'FAQ'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>Old City, Hyderabad</li>
              <li>+91 98765 43210</li>
              <li>hello@rahmani.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 rahmani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
