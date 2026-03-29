interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}
      <nav className={`mobile-menu${isOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <a href="#" className="logo-text mb-12 block" onClick={onClose}>
            REHMANI <span className="logo-gold">PERFUMERY</span>
          </a>
          <div className="mobile-nav-links">
            <a href="#" className="mobile-nav-link" onClick={onClose}>HOME</a>
            <a href="#collections" className="mobile-nav-link" onClick={onClose}>COLLECTIONS</a>
            <a href="#attars" className="mobile-nav-link" onClick={onClose}>ATTARS</a>
            <a href="#about" className="mobile-nav-link" onClick={onClose}>ABOUT</a>
          </div>
        </div>
      </nav>
    </>
  );
}
