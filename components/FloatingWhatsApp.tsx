'use client';

export default function FloatingWhatsApp() {
  const phoneNumber = '918340783679';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello%20Rahmani%20Perfumery,%20I%20have%20an%20inquiry%20from%20your%20website.`;

  return (
    <>
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

        {/* Label — hidden on mobile, shown on hover on desktop */}
        <span className="wa-label">Chat with us</span>
      </a>

      <style>{`
        /* ── Base button ── */
        .wa-float {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 1000;
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
                      background 0.2s ease;
        }

        /* ── Desktop hover expands label ── */
        @media (hover: hover) {
          .wa-float:hover {
            background: #1db954;
            box-shadow: 0 8px 28px rgba(37,211,102,0.55);
            padding-left: 18px;
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

        /* ── MOBILE: clean pill, no expand, perfect size ── */
        @media (max-width: 768px) {
          .wa-float {
            bottom: 20px;
            right: 16px;
            width: 52px;
            height: 52px;
            padding: 0;
            border-radius: 50%;
            justify-content: center;
            box-shadow: 0 4px 18px rgba(37,211,102,0.5);
          }

          /* Keep label hidden on mobile */
          .wa-label {
            display: none;
          }

          .wa-svg {
            width: 28px;
            height: 28px;
            margin: 0;
          }

          .wa-pulse {
            border-radius: 50%;
          }

          /* Tap feedback */
          .wa-float:active {
            transform: scale(0.92);
          }
        }
      `}</style>
    </>
  );
}
