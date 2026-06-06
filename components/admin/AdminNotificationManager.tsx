'use client';

import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Bell, BellOff, X, ShoppingBag } from 'lucide-react';

export default function AdminNotificationManager() {
  const [enabled, setEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [toast, setToast] = useState<{ id: string, amount: number, time: Date } | null>(null);
  
  // We record the exact time the component mounts. 
  // We ONLY want to trigger alerts for orders placed AFTER this time.
  const mountTimeRef = useRef(new Date().getTime());
  const isInitialLoadRef = useRef(true);

  // ─── WEB AUDIO API: Generate a beautiful "Ding-Ding" sound ───
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // First tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.5);

      // Second tone (higher, delayed)
      setTimeout(() => {
        if (ctx.state === 'closed') return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.8);
      }, 150);
    } catch (e) {
      console.error("Audio API error:", e);
    }
  };

  const handleEnable = async () => {
    try {
      // Request native notification permission
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
      
      // We must play a silent sound or standard sound immediately to unlock Web Audio on mobile
      playChime(); 
      
      setEnabled(true);
      setShowPrompt(false);
      localStorage.setItem('admin_notifications_enabled', 'true');
    } catch (e) {
      console.error("Failed to enable notifications", e);
    }
  };

  const handleDismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('admin_notifications_enabled', 'false');
  };

  // Check previous preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_notifications_enabled');
    if (saved === 'true') {
      setEnabled(true);
      setShowPrompt(false);
    } else if (saved === 'false') {
      setShowPrompt(false);
    }
  }, []);

  // ─── Firebase Listener ───
  useEffect(() => {
    if (!enabled) return;

    // Listen to the most recent orders
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Ignore the very first snapshot because it contains past data
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = change.doc.data();
          const createdAt = order.createdAt?.toMillis ? order.createdAt.toMillis() : Date.now();
          
          // Only alert if the order is genuinely new (created after we opened the page)
          if (createdAt > mountTimeRef.current) {
            triggerAlert(order);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [enabled]);

  const triggerAlert = (order: any) => {
    // 1. Play Sound
    playChime();

    const title = 'New Order Received! 🛍️';
    const body = `Order #${order.orderId} for ₹${order.finalTotal}`;

    // 2. Native Browser Notification (Desktop)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }

    // 3. Custom In-App Toast Notification (Mobile Fallback / Highly Visible)
    setToast({
      id: order.orderId || Math.random().toString(),
      amount: order.finalTotal || 0,
      time: new Date()
    });

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  return (
    <>
      {/* ── Setup Prompt (Floats Bottom Right) ── */}
      {showPrompt && (
        <div className="admin-notif-prompt">
          <div className="anp-icon">
            <Bell size={20} />
          </div>
          <div className="anp-content">
            <h4>Enable Order Alerts</h4>
            <p>Get instant sound and pop-up notifications when a new order arrives.</p>
            <div className="anp-actions">
              <button onClick={handleEnable} className="anp-btn-allow">Enable Alerts</button>
              <button onClick={handleDismissPrompt} className="anp-btn-deny">Not Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Control Toggle (Always visible in corner or header if integrated) ── */}
      {!showPrompt && (
        <button 
          onClick={() => {
            if (!enabled) handleEnable();
            else { setEnabled(false); localStorage.setItem('admin_notifications_enabled', 'false'); }
          }} 
          className={`admin-notif-toggle ${enabled ? 'ant-on' : 'ant-off'}`}
          title={enabled ? "Notifications Active" : "Notifications Disabled"}
        >
          {enabled ? <Bell size={16} /> : <BellOff size={16} />}
        </button>
      )}

      {/* ── Custom In-App Toast (Drops from top) ── */}
      {toast && (
        <div className="admin-toast-overlay">
          <div className="admin-toast">
            <div className="at-icon"><ShoppingBag size={24} /></div>
            <div className="at-content">
              <h4>New Order Arrived!</h4>
              <p>Order <strong>#{toast.id}</strong> for <strong>₹{toast.amount}</strong></p>
            </div>
            <button className="at-close" onClick={() => setToast(null)}><X size={18} /></button>
          </div>
        </div>
      )}

      <style>{CSS}</style>
    </>
  );
}

const CSS = `
/* ── Setup Prompt ── */
.admin-notif-prompt {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  padding: 1.25rem;
  gap: 1rem;
  max-width: 340px;
  z-index: 9999;
  border: 1px solid #E2E8F0;
  animation: anp-slide-up 0.4s cubic-bezier(0.16,1,0.3,1);
}
@media (max-width: 600px) {
  .admin-notif-prompt {
    bottom: 0; right: 0; left: 0; max-width: 100%;
    border-radius: 20px 20px 0 0; border: none;
    border-top: 1px solid #E2E8F0;
  }
}
@keyframes anp-slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.anp-icon {
  background: #EEF2FF;
  color: #4F46E5;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.anp-content h4 { margin: 0 0 4px; font-size: 0.95rem; color: #0F172A; font-weight: 700; }
.anp-content p { margin: 0 0 12px; font-size: 0.8rem; color: #64748B; line-height: 1.4; }
.anp-actions { display: flex; gap: 8px; }
.anp-btn-allow {
  background: #4F46E5; color: #fff; border: none; padding: 6px 12px;
  border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
  flex: 1;
}
.anp-btn-deny {
  background: #F1F5F9; color: #64748B; border: none; padding: 6px 12px;
  border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
  flex: 1;
}

/* ── Toggle Button ── */
.admin-notif-toggle {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: none; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 9998;
  transition: all 0.2s;
}
@media (max-width: 600px) {
  .admin-notif-toggle { bottom: auto; top: 12px; right: 12px; left: auto; box-shadow: none; border: 1px solid #E2E8F0; }
}
.ant-on { background: #10B981; color: #fff; }
.ant-off { background: #fff; color: #94A3B8; border: 1px solid #E2E8F0; }

/* ── Custom In-App Toast ── */
.admin-toast-overlay {
  position: fixed;
  top: 0; left: 0; right: 0;
  pointer-events: none;
  display: flex; justify-content: center;
  padding-top: 24px;
  z-index: 10000;
}
@media (max-width: 600px) {
  .admin-toast-overlay { padding-top: 12px; padding-left: 12px; padding-right: 12px; }
}
.admin-toast {
  pointer-events: auto;
  background: #1E293B;
  color: #fff;
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px 12px 12px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  animation: at-drop 0.5s cubic-bezier(0.16,1,0.3,1) both;
  max-width: 400px; width: 100%;
}
@keyframes at-drop {
  0% { transform: translateY(-100px) scale(0.9); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.at-icon {
  background: linear-gradient(135deg, #10B981, #059669);
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.at-content { flex: 1; }
.at-content h4 { margin: 0 0 2px; font-size: 0.95rem; font-weight: 700; color: #F8FAFC; }
.at-content p { margin: 0; font-size: 0.85rem; color: #94A3B8; }
.at-content strong { color: #fff; }
.at-close {
  background: none; border: none; color: #64748B; cursor: pointer;
  padding: 4px; display: flex; align-items: center; justify-content: center;
  border-radius: 6px; transition: background 0.2s;
}
.at-close:hover { background: #334155; color: #fff; }
`;
