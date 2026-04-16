'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const phoneNumber = '918340783679';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello%20Rahmani%20Perfumery,%20I%20have%20an%20inquiry%20from%20your%20website.`;

  const [showPopup, setShowPopup] = useState(false);

  // Delay the popup so it grabs attention after initial load
  useEffect(() => {
    if (pathname !== '/') return;
    const timer = setTimeout(() => setShowPopup(true), 3500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Only show on homepage
  if (pathname !== '/') return null;

  return (
    <>
      <div className="wa-wrapper">
        {/* Tooltip Popup */}
        <div className={`wa-popup ${showPopup ? 'show' : ''}`}>
          <button 
            className="wa-popup-close" 
            onClick={(e) => { e.preventDefault(); setShowPopup(false); }}
            aria-label="Close message"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <p className="wa-popup-text">
            Still confused what to buy?<br/><strong>Talk to the experts</strong> for the best fragrance for your type.
          </p>
          <div className="wa-popup-arrow" />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-float"
          aria-label="Chat with us on WhatsApp"
        >
          {/* Pulse ring */}
          <span className="wa-pulse" />

          {/* Icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="wa-svg" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          <span className="wa-label">Chat with us</span>
        </a>
      </div>

      <style>{`
        /* ── Wrapper ── */
        .wa-wrapper {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
          pointer-events: none;
        }

        /* ── Popup ── */
        .wa-popup {
          pointer-events: auto;
          position: relative;
          background: #fff;
          color: #333;
          padding: 14px 18px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          width: max-content;
          max-width: 250px;
          opacity: 0;
          transform: translateY(15px) scale(0.95);
          visibility: hidden;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom right;
          border: 1px solid rgba(0,0,0,0.06);
          /* Floating/flicker animation */
          animation: wa-popup-float 3s ease-in-out infinite;
        }

        .wa-popup.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        @keyframes wa-popup-float {
          0% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
          50% { transform: translateY(-4px); box-shadow: 0 15px 35px rgba(37,211,102,0.2); }
          100% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
        }

        .wa-popup-text {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.45;
          font-weight: 500;
          font-family: var(--font-sans, system-ui), sans-serif;
          color: #444;
        }

        .wa-popup-text strong {
          color: #25D366;
          font-weight: 700;
        }

        .wa-popup-close {
          position: absolute;
          top: -8px;
          left: -8px; /* placed on left side to balance the arrow on the right */
          background: #fff;
          border: 1px solid #eaeaea;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }

        .wa-popup-close:hover {
          color: #111;
          border-color: #ccc;
          transform: scale(1.1);
        }

        .wa-popup-arrow {
          position: absolute;
          bottom: -6px;
          right: 20px;
          width: 12px;
          height: 12px;
          background: #fff;
          transform: rotate(45deg);
          border-right: 1px solid rgba(0,0,0,0.06);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        /* ── Base button ── */
        .wa-float {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 5px;
          background: #25D366;
          color: #fff;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(37,211,102,0.45);
          overflow: hidden;
          transition: padding 0.35s cubic-bezier(0.25,1,0.5,1),
                      box-shadow 0.3s ease,
                      transform 0.2s ease,
                      background 0.2s ease;
        }

        /* ── Desktop hover expands label ── */
        @media (hover: hover) {
          .wa-float:hover {
            background: #1db954;
            box-shadow: 0 8px 32px rgba(37,211,102,0.6);
            padding-left: 18px;
            transform: translateY(-2px);
          }
          .wa-float:hover .wa-label {
            max-width: 140px;
            opacity: 1;
            margin-right: 10px;
          }
          .wa-float:hover .wa-svg {
            transform: rotate(5deg) scale(1.05);
          }
        }

        /* ── Icon circle ── */
        .wa-svg {
          position: relative;
          z-index: 2;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          margin: 5px;
          transition: transform 0.3s ease;
        }

        /* ── Label (desktop expand) ── */
        .wa-label {
          max-width: 0;
          opacity: 0;
          white-space: nowrap;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.02em;
          color: #fff;
          font-family: var(--font-sans, system-ui), sans-serif;
          overflow: hidden;
          transition: max-width 0.4s cubic-bezier(0.25,1,0.5,1),
                      opacity 0.35s ease,
                      margin 0.35s ease;
        }

        /* ── Pulse ring ── */
        .wa-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50px;
          background: #25D366;
          z-index: 0;
          animation: wa-pulse-anim 2.2s cubic-bezier(0.215,0.61,0.355,1) infinite;
          opacity: 0;
        }

        @keyframes wa-pulse-anim {
          0%   { transform: scale(1);   opacity: 0.55; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .wa-wrapper {
            bottom: 20px;
            right: 16px;
            gap: 12px;
          }
          .wa-popup {
            max-width: 220px;
            padding: 12px 14px;
          }
          .wa-popup-text {
            font-size: 0.78rem;
          }
          .wa-popup-arrow {
            right: 18px;
          }
          .wa-float {
            width: 52px;
            height: 52px;
            padding: 0;
            justify-content: center;
          }
          .wa-label {
            display: none;
          }
          .wa-svg {
            width: 28px;
            height: 28px;
            margin: 0;
          }
          .wa-float:active {
            transform: scale(0.92);
          }
        }
      `}</style>
    </>
  );
}
