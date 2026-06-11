'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

        <button 
          className="chatbase-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Chatbot"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        .chatbase-wrapper {
          position: fixed;
          bottom: 100px;
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
            bottom: 150px;
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
