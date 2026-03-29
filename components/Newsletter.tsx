export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="section-container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Join Our Community</h2>
          <p className="newsletter-text">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="newsletter-input" />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
