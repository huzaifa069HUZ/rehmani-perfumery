'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ChatbaseWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Hide on admin, login (auth), and profile pages
  const hiddenRoutes = ['/admin', '/auth', '/login', '/profile'];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));

  if (isHidden) return null;

  return (
    <>
      <div className="chatbase-wrapper">
        {showPopup && !isOpen && (
          <div className="chatbase-popup">
            <button 
              className="chatbase-popup-close" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPopup(false); }}
              aria-label="Close message"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <p className="chatbase-popup-text">
              Ask Rahmani AI for attar guide
            </p>
            <div className="chatbase-popup-arrow" />
          </div>
        )}

        {isOpen && (
          <div className="chatbase-window">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/tkuuOLB8DEa7L9cOxR3z_"
              width="100%"
              style={{ height: "100%", minHeight: "500px" }}
              frameBorder="0"
              allow="microphone"
            />
          </div>
        )}

        <button 
          className="chatbase-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Chatbot"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <Image src="/assets/ai icon.png" alt="AI Chatbot" width={38} height={38} className="object-contain" style={{ borderRadius: '50%' }} />
          )}
        </button>
      </div>

      <style>{`
        .chatbase-wrapper {
          position: fixed;
          bottom: 140px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }

        .chatbase-window {
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 200px);
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          overflow: hidden;
          position: relative;
          animation: cb-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom right;
          border: 1px solid rgba(0,0,0,0.1);
        }

        @keyframes cb-pop {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .chatbase-popup {
          position: relative;
          background: #fff;
          color: #333;
          padding: 12px 16px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          width: max-content;
          max-width: 220px;
          border: 1px solid rgba(0,0,0,0.06);
          animation: cb-popup-float 3s ease-in-out infinite, cb-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: bottom right;
        }

        @keyframes cb-popup-float {
          0% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
          50% { transform: translateY(-4px); box-shadow: 0 15px 35px rgba(212,175,55,0.2); }
          100% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
        }

        .chatbase-popup-text {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.45;
          font-weight: 600;
          font-family: var(--font-sans, system-ui), sans-serif;
          color: #444;
        }

        .chatbase-popup-close {
          position: absolute;
          top: -8px;
          left: -8px;
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

        .chatbase-popup-close:hover {
          color: #111;
          border-color: #ccc;
          transform: scale(1.1);
        }

        .chatbase-popup-arrow {
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

        .chatbase-btn {
          width: 60px;
          height: 60px;
          background: #1A1714;
          color: #D4AF37;
          border: 2px solid #D4AF37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transition: transform 0.2s, background 0.2s;
        }
        .chatbase-btn:hover {
          transform: scale(1.05);
          background: #000;
        }

        @media (max-width: 768px) {
          .chatbase-wrapper {
            bottom: 200px;
            right: 16px;
            gap: 12px;
          }
          .chatbase-window {
            width: calc(100vw - 32px);
            height: 500px;
            max-height: calc(100vh - 220px);
          }
          .chatbase-btn {
            width: 52px;
            height: 52px;
          }
        }
      `}</style>
    </>
  );
}
