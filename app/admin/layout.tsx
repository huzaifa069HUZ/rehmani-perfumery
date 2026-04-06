'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const ADMIN_EMAIL = 'rahmaniperfumerypatna@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/auth');
      else if (user.email !== ADMIN_EMAIL) router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid rgba(212,175,95,0.2)',
            borderTopColor: '#d4af5f',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>Loading admin panel...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!user || user.email !== ADMIN_EMAIL) return null;

  const handleLogout = async () => { await logout(); router.push('/auth'); };

  const navLinks = [
    {
      name: 'Dashboard', path: '/admin', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      name: 'Products', path: '/admin/products', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      )
    },
    {
      name: 'Orders', path: '/admin/orders', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      )
    },
    {
      name: 'Analytics', path: '/admin/analytics', icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
  ];

  const sidebarWidth = collapsed ? 72 : 250;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f8', display: 'flex', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes pulseGold { 0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,95,0.3); } 50% { box-shadow: 0 0 0 8px rgba(212,175,95,0); } }

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #0d0d1f 0%, #13132b 40%, #0d0d1f 100%);
          border-right: 1px solid rgba(212, 175, 95, 0.12);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          box-shadow: 4px 0 32px rgba(0, 0, 0, 0.4);
        }

        .admin-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(212,175,95,0.3) 30%, rgba(212,175,95,0.1) 70%, transparent);
          pointer-events: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(212,175,95,0.08);
          color: #d4af5f !important;
        }

        .nav-link-active {
          background: linear-gradient(135deg, rgba(212,175,95,0.15), rgba(212,175,95,0.08)) !important;
          color: #d4af5f !important;
          box-shadow: 0 0 0 1px rgba(212,175,95,0.2) inset;
        }

        .nav-link-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: linear-gradient(180deg, #d4af5f, #c9973a);
          border-radius: 0 2px 2px 0;
        }

        .nav-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .admin-topbar {
          height: 66px;
          background: white;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 16px rgba(0,0,0,0.06);
          gap: 16px;
        }

        .view-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: white !important;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid rgba(212,175,95,0.2);
          white-space: nowrap;
        }

        .view-store-btn:hover {
          background: linear-gradient(135deg, #d4af5f, #c9973a) !important;
          color: #0d0d1f !important;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212,175,95,0.35);
        }

        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .collapse-btn:hover {
          background: rgba(212,175,95,0.1);
          color: #d4af5f;
          border-color: rgba(212,175,95,0.2);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.12);
          color: #ef4444;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
        }

        .page-content {
          animation: fadeIn 0.3s ease;
        }

        @media (max-width: 1023px) {
          .admin-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0) !important;
            width: 260px !important;
          }
          .collapse-toggle-desktop {
            display: none;
          }
          .admin-main-content {
            margin-left: 0 !important;
          }
          .page-content {
            padding: 16px !important;
          }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Logo area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '66px',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid rgba(212,175,95,0.1)',
          gap: '12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #d4af5f, #c9973a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 12px rgba(212,175,95,0.4)',
            animation: 'pulseGold 3s ease-in-out infinite',
          }}>
            <span style={{ color: '#0d0d1f', fontWeight: '800', fontSize: '16px', fontFamily: 'Georgia, serif' }}>R</span>
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>Rahmani Perfumery</div>
              <div style={{ fontSize: '10px', color: '#d4af5f', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600', marginTop: '1px' }}>Admin Console</div>
            </div>
          )}
        </div>

        {/* Section label */}
        {!collapsed && (
          <div style={{ padding: '20px 20px 8px', fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Navigation
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 10px' : '0 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {navLinks.map(link => {
            const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
            return (
              <Link key={link.name} href={link.path}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                style={{
                  color: isActive ? '#d4af5f' : 'rgba(255,255,255,0.55)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '10px 12px',
                }}
                title={collapsed ? link.name : undefined}
              >
                <div className="nav-icon" style={{ color: isActive ? '#d4af5f' : 'rgba(255,255,255,0.45)' }}>
                  {link.icon}
                </div>
                {!collapsed && <span style={{ fontSize: '13.5px', fontWeight: '500' }}>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="collapse-toggle-desktop" style={{ padding: '8px 10px 4px' }}>
          <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn" style={{ width: '100%', borderRadius: '8px', height: '36px' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
              <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
            </svg>
            {!collapsed && <span style={{ fontSize: '12px', fontWeight: '500', marginLeft: '4px' }}>Collapse</span>}
          </button>
        </div>

        {/* User / Logout */}
        <div style={{
          borderTop: '1px solid rgba(212,175,95,0.1)',
          padding: '12px 10px',
          background: 'rgba(0,0,0,0.15)',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px 10px', marginBottom: '2px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212,175,95,0.2), rgba(212,175,95,0.1))',
                border: '1px solid rgba(212,175,95,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#d4af5f', fontWeight: '700', fontSize: '13px', flexShrink: 0,
              }}>
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: '10px', color: '#d4af5f', fontWeight: '500', letterSpacing: '0.05em', marginTop: '1px' }}>Administrator</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212,175,95,0.2), rgba(212,175,95,0.1))',
                border: '1px solid rgba(212,175,95,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#d4af5f', fontWeight: '700', fontSize: '13px',
              }}>
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px' : '9px 12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="admin-main-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Top bar */}
        <header className="admin-topbar">
          {/* Mobile menu button */}
          <button
            style={{
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'white', cursor: 'pointer', color: '#64748b',
              flexShrink: 0,
            }}
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Breadcrumb / Page title area */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Admin</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                {navLinks.find(l => l.path === pathname || (l.path !== '/admin' && pathname.startsWith(l.path)))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification bell */}
            <button style={{
              width: '38px', height: '38px', borderRadius: '9px', border: '1px solid rgba(0,0,0,0.07)',
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', flexShrink: 0, transition: 'all 0.2s',
              position: 'relative',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#d4af5f', border: '1.5px solid white',
              }} />
            </button>

            <a href="/" target="_blank" rel="noreferrer" className="view-store-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View store
            </a>
          </div>
        </header>

        <style>{`
          @media (max-width: 1023px) {
            .admin-topbar { padding: 0 16px !important; }  
            .mobile-menu-btn { display: flex !important; }
          }
        `}</style>

        {/* Page content */}
        <main className="page-content" style={{ flex: 1, padding: '32px', background: '#f0f2f8' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
