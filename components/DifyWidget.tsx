'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DifyWidget() {
  const pathname = usePathname();
  
  // Hide on admin, login (auth), and profile pages
  const hiddenRoutes = ['/admin', '/auth', '/login', '/profile'];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));

  // Initialize the Dify script on mount
  useEffect(() => {
    // @ts-expect-error Dify global config
    window.difyChatbotConfig = {
      token: 'QZKQs1YGmJ7zSSOQ',
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    const existingScript = document.getElementById('QZKQs1YGmJ7zSSOQ');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://udify.app/embed.min.js";
      script.id = "QZKQs1YGmJ7zSSOQ";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Handle hiding/showing on specific routes without destroying the iframe
  useEffect(() => {
    const bubbleBtn = document.getElementById('dify-chatbot-bubble-button');
    const bubbleWin = document.getElementById('dify-chatbot-bubble-window');
    
    if (bubbleBtn) {
      bubbleBtn.style.display = isHidden ? 'none' : 'flex'; 
    }
    if (bubbleWin && isHidden) {
      bubbleWin.style.display = 'none';
    }
  }, [isHidden, pathname]);

  return (
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
  );
}
