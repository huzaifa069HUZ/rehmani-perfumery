import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero">
      {/* Background Image — using Next.js Image for reliable rendering */}
      <Image
        src="/canvabg.png"
        alt="Hero Background"
        fill
        priority
        quality={90}
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-title-block fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="hero-title-main">rahmani  <br /> PERFUMERY</h1>
        </div>

        <div className="hero-arabic fade-in" style={{ animationDelay: '0.5s' }} dir="rtl">
          عطر رحماني
        </div>

        <p className="hero-tagline fade-in" style={{ animationDelay: '0.7s' }}>
          Pure Attar. Pure Identity.
        </p>

        <div className="hero-actions fade-in" style={{ animationDelay: '0.9s' }}>
          <a href="#collections" className="btn-primary">
            DISCOVER COLLECTION →
          </a>
          <a href="#story" className="btn-ghost">
            OUR STORY
          </a>
        </div>

        <div className="hero-stats fade-in" style={{ animationDelay: '1.1s' }}>
          <div className="hero-stat">
            <span className="stat-value">25+</span>
            <span className="stat-label">SIGNATURE ATTARS</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">PURE OILS</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">SINCE 1999</span>
            <span className="stat-label">TRUSTED HERITAGE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
