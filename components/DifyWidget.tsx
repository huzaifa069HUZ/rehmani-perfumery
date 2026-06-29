'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function DifyWidget() {
  const pathname = usePathname();
  
  // Hide on admin, login (auth), and profile pages
  const hiddenRoutes = ['/admin', '/auth', '/login', '/profile'];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));

  // Dify injects a bubble button and window directly into the DOM.
  // We use CSS to hide it on specific pages so we don't break the script lifecycle.
  useEffect(() => {
    const bubbleBtn = document.getElementById('dify-chatbot-bubble-button');
    const bubbleWin = document.getElementById('dify-chatbot-bubble-window');
    
    if (bubbleBtn) {
      bubbleBtn.style.display = isHidden ? 'none' : ''; 
    }
    if (bubbleWin && isHidden) {
      bubbleWin.style.display = 'none';
    }
  }, [isHidden, pathname]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.difyChatbotConfig = {
              token: 'QZKQs1YGmJ7zSSOQ',
              inputs: {},
              systemVariables: {},
              userVariables: {},
            };
          `,
        }}
      />
      <script
        src="https://udify.app/embed.min.js"
        id="QZKQs1YGmJ7zSSOQ"
        defer
      />
      <style>{`
        #dify-chatbot-bubble-button {
          background-color: #1C64F2 !important;
          ${isHidden ? 'display: none !important;' : ''}
        }
        #dify-chatbot-bubble-window {
          width: 24rem !important;
          height: 40rem !important;
        }
        
        /* Ensure the button doesn't hide behind the mobile bottom nav */
        @media (max-width: 768px) {
          #dify-chatbot-bubble-button {
            bottom: 140px !important;
            right: 20px !important;
          }
        }
      `}</style>
    </>
  );
}
