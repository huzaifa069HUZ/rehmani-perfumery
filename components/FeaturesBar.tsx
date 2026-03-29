export default function FeaturesBar() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: 'Free Shipping',
      desc: 'On orders above ₹999',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
      title: '100% Authentic',
      desc: 'Pure essential oils',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
      ),
      title: 'Easy Returns',
      desc: '7-day return policy',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Secure Payment',
      desc: '100% secure checkout',
    },
  ];

  return (
    <section className="features-bar">
      {/* Floral luxury pattern overlay (SVG inline) */}
      <div className="features-floral-overlay" aria-hidden="true">
        <svg className="floral-svg" viewBox="0 0 800 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Repeating floral motif */}
          <defs>
            <pattern id="floral" x="0" y="0" width="200" height="120" patternUnits="userSpaceOnUse">
              {/* Center bloom */}
              <g opacity="0.12" fill="#D4AF37">
                <ellipse cx="100" cy="60" rx="8" ry="20"/>
                <ellipse cx="100" cy="60" rx="20" ry="8"/>
                <ellipse cx="100" cy="60" rx="8" ry="20" transform="rotate(45 100 60)"/>
                <ellipse cx="100" cy="60" rx="8" ry="20" transform="rotate(-45 100 60)"/>
                <circle cx="100" cy="60" r="5"/>
                {/* Small accent petals */}
                <ellipse cx="70" cy="30" rx="5" ry="13"/>
                <ellipse cx="70" cy="30" rx="13" ry="5"/>
                <ellipse cx="70" cy="30" rx="5" ry="13" transform="rotate(45 70 30)"/>
                <circle cx="70" cy="30" r="3"/>
                <ellipse cx="130" cy="90" rx="5" ry="13"/>
                <ellipse cx="130" cy="90" rx="13" ry="5"/>
                <ellipse cx="130" cy="90" rx="5" ry="13" transform="rotate(45 130 90)"/>
                <circle cx="130" cy="90" r="3"/>
                {/* Scrolling vines */}
                <path d="M20 60 Q50 30 80 60 Q110 90 140 60 Q170 30 200 60" stroke="#D4AF37" strokeWidth="0.5" fill="none"/>
                <path d="M0 30 Q25 15 50 30 Q75 45 100 30" stroke="#D4AF37" strokeWidth="0.4" fill="none"/>
                {/* Tiny diamonds */}
                <rect x="35" y="56" width="6" height="6" transform="rotate(45 38 59)" opacity="0.6"/>
                <rect x="157" y="56" width="6" height="6" transform="rotate(45 160 59)" opacity="0.6"/>
              </g>
            </pattern>
          </defs>
          <rect width="800" height="120" fill="url(#floral)"/>
        </svg>
      </div>

      <div className="features-container">
        {features.map((f, i) => (
          <div className="feature-item" key={i}>
            <div className="feature-icon-wrap">
              {f.icon}
            </div>
            <div>
              <h4 className="feature-title">{f.title}</h4>
              <p className="feature-desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
