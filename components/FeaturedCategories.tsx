import Image from 'next/image';

export default function FeaturedCategories() {
  const categories = [
    {
      img: '/category_gifts.png',
      label: 'Perfect Present',
      title: 'Gifts',
      desc: 'Exquisite fragrances wrapped in luxury — the gift they\'ll never forget',
      size: 'large',
      href: '/attars',
    },
    {
      img: '/category_for_him.png',
      label: 'Men\'s Collection',
      title: 'For Him',
      desc: '',
      size: 'small',
      href: '/attars',
    },
    {
      img: '/category_for_her.png',
      label: 'Women\'s Collection',
      title: 'For Her',
      desc: '',
      size: 'small',
      href: '/perfumes',
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
                <a href={cat.href} className="category-btn">Explore Now</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
