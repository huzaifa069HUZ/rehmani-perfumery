'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Copy, Mail, Download, Check, Send, X, Users, Clock, ArrowRight } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: any;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Bulk Email State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const subs: Subscriber[] = [];
        querySnapshot.forEach((doc) => {
          subs.push({ id: doc.id, ...doc.data() } as Subscriber);
        });
        setSubscribers(subs);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleCopyAll = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n"
      + subscribers.map(e => `${e.email},${e.subscribedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message || subscribers.length === 0) return;
    
    setSending(true);
    setSendResult(null);
    
    try {
      const response = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          emails: subscribers.map(s => s.email)
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSendResult({ success: true, message: 'Emails sent successfully!' });
        setSubject('');
        setMessage('');
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        setSendResult({ success: false, message: data.error || 'Failed to send emails.' });
      }
    } catch (error: any) {
      setSendResult({ success: false, message: error.message || 'An error occurred.' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-400">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mb-4"></div>
        <p className="text-sm uppercase tracking-widest font-medium">Loading Subscribers</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Subscribers</h1>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            Total: {subscribers.length} Emails
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#d4af37', color: '#ffffff' }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Send size={16} />
            Broadcast Email
          </button>
          
          <button 
            onClick={handleExportCSV}
            style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button 
            onClick={handleCopyAll}
            style={{ backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date Subscribed</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <Mail size={14} />
                      </div>
                      <span className="font-medium text-gray-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {sub.subscribedAt?.toDate?.()?.toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) || 'Just now'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={`mailto:${sub.email}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Send Mail
                    </a>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users size={32} className="mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No subscribers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden transform scale-100 transition-transform">
            <div className="flex justify-between items-center px-8 py-6 border-b border-neutral-100">
              <h3 className="text-xl font-medium text-neutral-900 tracking-tight">Compose Broadcast</h3>
              <button 
                onClick={() => !sending && setIsModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                disabled={sending}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <form onSubmit={handleSendBulkEmail} className="p-8">
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-2">Recipients</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50/80 rounded-xl text-neutral-600 text-sm border border-neutral-100">
                  <Users size={16} className="text-neutral-400" />
                  <span>All <strong>{subscribers.length}</strong> active subscribers (BCC mode)</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-2">Subject Line</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all text-neutral-800 placeholder:text-neutral-300"
                  placeholder="Enter a captivating subject..."
                  disabled={sending}
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-2">Message Body</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all text-neutral-800 placeholder:text-neutral-300 resize-none leading-relaxed"
                  placeholder="Write your email content here..."
                  disabled={sending}
                ></textarea>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 mt-3 flex items-center gap-1.5">
                  <Check size={12} /> Email template automatically includes your branding
                </p>
              </div>

              {sendResult && (
                <div className={`p-4 rounded-xl mb-8 text-sm flex items-center gap-3 ${
                  sendResult.success 
                    ? 'bg-green-50 text-green-800 border border-green-100' 
                    : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${sendResult.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {sendResult.message}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    padding: '10px 24px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: sending ? 'not-allowed' : 'pointer'
                  }}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || subscribers.length === 0}
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                    color: '#ffffff',
                    padding: '10px 28px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: (sending || subscribers.length === 0) ? 'not-allowed' : 'pointer',
                    opacity: (sending || subscribers.length === 0) ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {sending ? (
                    <>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send to {subscribers.length} {subscribers.length === 1 ? 'Person' : 'People'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
