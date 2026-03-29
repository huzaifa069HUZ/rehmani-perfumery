import Image from 'next/image';

export default function FeaturedCategories() {
  const categories = [
    {
      img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop',
      label: 'Signature Collection',
      title: 'Royal Oud',
      desc: 'Aged to perfection, sourced from the finest agarwood',
      size: 'large',
    },
    {
      img: 'https://images.unsplash.com/photo-1590156562745-5f4f59b9c7a3?q=80&w=800&auto=format&fit=crop',
      label: 'Best Seller',
      title: 'White Musk',
      desc: '',
      size: 'small',
    },
    {
      img: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=800&auto=format&fit=crop',
      label: 'New Arrival',
      title: 'Rose Garden',
      desc: '',
      size: 'small',
    },
  ];

  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div key={i} className={`category-card${cat.size === 'large' ? ' category-large' : ''}`}>
              <div className="category-img-wrap">
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  sizes={cat.size === 'large' ? '50vw' : '25vw'}
                  className="category-img"
                />
              </div>
              <div className="category-overlay" />
              <div className="category-content">
                <span className="category-label">{cat.label}</span>
                <h3 className="category-title">{cat.title}</h3>
                {cat.desc && <p className="category-desc">{cat.desc}</p>}
                <a href="#collections" className="category-btn">Explore Now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
