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
        className="whatsapp-floatbtn group"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="wa-text">Chat with us</span>
        <div className="wa-icon-container">
          <div className="wa-pulse-ring"></div>
          <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </div>
      </a>

      <style>{`
        .whatsapp-floatbtn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          background-color: #25D366;
          color: white;
          border-radius: 50px;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          text-decoration: none;
          padding: 5px;
          gap: 0;
          overflow: hidden;
        }

        .whatsapp-floatbtn:hover {
          background-color: #1ebe59;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
          padding-left: 20px; /* Expands to show text */
        }

        .wa-text {
          max-width: 0;
          opacity: 0;
          white-space: nowrap;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.02em;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          color: #fff;
          font-family: var(--font-sans), sans-serif;
        }

        .whatsapp-floatbtn:hover .wa-text {
          max-width: 150px; /* Reveal text */
          opacity: 1;
          margin-right: 12px;
        }

        .wa-icon-container {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #25D366;
          border-radius: 50%;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .whatsapp-floatbtn:hover .wa-icon-container {
           transform: rotate(5deg) scale(1.05);
        }

        .wa-icon {
          width: 32px;
          height: 32px;
          fill: currentColor;
          z-index: 2;
        }

        .wa-pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #fff;
          z-index: 1;
          animation: wa-pulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          opacity: 0.4;
        }

        @keyframes wa-pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .whatsapp-floatbtn {
            bottom: 20px;
            right: 20px;
            width: 54px;
            height: 54px;
          }
          .wa-icon {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
}
