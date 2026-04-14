export default function AnnouncementBar() {
  const announcements = [
    "Free shipping on orders above ₹999",
    "Fragrance that your soul desires",
    "Pure Arabian Attars Since 2015",
    "India's Best Original Attars",
    "Cash on Delivery Available"
  ];

  // Join them with a star/diamond and non-breaking spaces
  const content = "\u00A0\u00A0✦\u00A0\u00A0" + announcements.join('\u00A0\u00A0✦\u00A0\u00A0') + "\u00A0\u00A0✦\u00A0\u00A0";

  return (
    <div className="announcement-wrapper">
      <div className="announcement-marquee">
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
      </div>
      <style>{`
        .announcement-wrapper {
          position: relative;
          z-index: 200;
          background: #1a1a1a;
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          letter-spacing: 0.15em;
          font-weight: 600;
          height: var(--announce-h, 40px);
          overflow: hidden;
          display: flex;
          align-items: center;
          text-transform: uppercase;
        }

        .announcement-marquee {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: marqueeScroll 40s linear infinite;
        }

        .announcement-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
