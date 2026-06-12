'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function ChatbaseWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on admin, login (auth), and profile pages
  const hiddenRoutes = ['/admin', '/auth', '/login', '/profile'];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));

  if (isHidden) return null;

  return (
    <>
      <div className="chatbase-wrapper">
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

        <div className="chatbase-trigger">
          {!isOpen && (
            <span className="chatbase-glowing-text">ASK RAHMANI AI</span>
          )}
          <button 
            className="chatbase-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle AI Chatbot"
          >
            {isOpen ? (
              <div className="chatbase-btn-close-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            ) : (
              <Image src="/assets/ai icon.png" alt="AI Chatbot" width={60} height={60} className="object-contain" />
            )}
          </button>
        </div>
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

        .chatbase-trigger {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .chatbase-glowing-text {
          font-family: var(--font-sans, system-ui), sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #D4AF37;
          text-transform: uppercase;
          text-shadow: 0 0 8px rgba(212,175,55,0.6), 0 0 16px rgba(212,175,55,0.4);
          animation: pulse-glow 2.5s ease-in-out infinite;
          white-space: nowrap;
          pointer-events: none;
          background: rgba(26, 23, 20, 0.7);
          padding: 8px 16px;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        @keyframes pulse-glow {
          0%, 100% { 
            text-shadow: 0 0 8px rgba(212,175,55,0.6), 0 0 16px rgba(212,175,55,0.4);
            box-shadow: 0 0 8px rgba(212,175,55,0.1);
          }
          50% { 
            text-shadow: 0 0 12px rgba(212,175,55,0.9), 0 0 24px rgba(212,175,55,0.7);
            box-shadow: 0 0 16px rgba(212,175,55,0.3);
          }
        }

        .chatbase-btn {
          width: 60px;
          height: 60px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s;
          outline: none;
        }
        .chatbase-btn:hover {
          transform: scale(1.05);
        }
        .chatbase-btn-close-icon {
          width: 60px;
          height: 60px;
          background: #1A1714;
          color: #D4AF37;
          border: 2px solid #D4AF37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          transition: background 0.2s;
        }
        .chatbase-btn:hover .chatbase-btn-close-icon {
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
