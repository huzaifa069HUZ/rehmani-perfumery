'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  Package, ChevronDown, ChevronUp, MapPin, Truck, Phone,
  Mail, Clock, CheckCircle, XCircle, AlertCircle, Search,
  RefreshCw, MessageCircle, Filter
} from 'lucide-react';

interface OrderItem {
  id: string | number;
  name: string;
  size: number;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerInfo: { name: string; email: string; phone: string };
  shippingAddress: { pincode: string; city: string; state: string; house: string; area: string };
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  finalTotal: number;
  paymentMethod: string;
  status: string;
  createdAt: any;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  Pending:   { label: 'Pending',   bg: '#FEF9C3', text: '#854D0E', dot: '#EAB308' },
  Confirmed: { label: 'Confirmed', bg: '#DCFCE7', text: '#166534', dot: '#16A34A' },
  Shipped:   { label: 'Shipped',   bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  Delivered: { label: 'Delivered', bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  Cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data: Order[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      setOrders(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'All') result = result.filter(o => o.status === statusFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.customerInfo?.name?.toLowerCase().includes(q) ||
        o.customerInfo?.phone?.includes(q) ||
        o.customerInfo?.email?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [searchTerm, statusFilter, orders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.finalTotal || 0), 0),
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #F1F5F9', borderTopColor: '#6366F1', animation: 'ao-spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Loading Orders</p>
        <style>{`@keyframes ao-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>{adminCSS}</style>

      {/* ── Stats Bar ── */}
      <div className="ao-stats">
        <div className="ao-stat">
          <p className="ao-stat-label">Total Orders</p>
          <p className="ao-stat-val">{stats.total}</p>
        </div>
        <div className="ao-stat ao-stat-yellow">
          <p className="ao-stat-label">Pending</p>
          <p className="ao-stat-val ao-yellow">{stats.pending}</p>
        </div>
        <div className="ao-stat ao-stat-green">
          <p className="ao-stat-label">Confirmed</p>
          <p className="ao-stat-val ao-green">{stats.confirmed}</p>
        </div>
        <div className="ao-stat ao-stat-blue">
          <p className="ao-stat-label">Revenue</p>
          <p className="ao-stat-val ao-blue">₹{stats.revenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="ao-toolbar">
        <div className="ao-search-wrap">
          <Search size={15} className="ao-search-ico" />
          <input
            className="ao-search"
            placeholder="Search by name, phone, email or order ID…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ao-filter-wrap">
          <Filter size={14} />
          <select className="ao-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className="ao-refresh" onClick={fetchOrders} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── Orders ── */}
      <div className="ao-list">
        {filtered.length === 0 ? (
          <div className="ao-empty">
            <Package size={36} />
            <p>No orders found</p>
          </div>
        ) : filtered.map(order => {
          const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
          const isOpen = expandedId === order.id;
          const dateStr = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          }) || '—';
          const timeStr = order.createdAt?.toDate?.()?.toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
          }) || '';
          const displayOrderId = (order as any).orderId || order.id;

          return (
            <div key={order.id} className={`ao-card ${isOpen ? 'ao-card-open' : ''}`}>

              {/* ── Row ── */}
              <div className="ao-row" onClick={() => setExpandedId(isOpen ? null : order.id)}>

                <div className="ao-avatar">
                  {(order.customerInfo?.name || 'G')[0].toUpperCase()}
                </div>

                <div className="ao-col ao-col-customer">
                  <p className="ao-name">{order.customerInfo?.name || 'Guest'} <span style={{fontSize: '0.7rem', color: '#94A3B8', marginLeft: 4}}>#{displayOrderId}</span></p>
                  <p className="ao-sub">{order.customerInfo?.phone}</p>
                </div>

                <div className="ao-col ao-col-date">
                  <p className="ao-name">{dateStr}</p>
                  <p className="ao-sub">{timeStr}</p>
                </div>

                <div className="ao-col ao-col-items">
                  <p className="ao-name">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                  <p className="ao-sub">{order.paymentMethod}</p>
                </div>

                <div className="ao-col ao-col-amount">
                  <p className="ao-amount">₹{order.finalTotal?.toLocaleString('en-IN')}</p>
                </div>

                <div className="ao-col ao-col-status">
                  <span className="ao-badge" style={{ background: sc.bg, color: sc.text }}>
                    <span className="ao-dot" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                </div>

                <button className="ao-chevron" aria-label="Expand">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* ── Expanded ── */}
              {isOpen && (
                <div className="ao-detail">

                  <div className="ao-detail-grid">

                    {/* Contact */}
                    <div className="ao-detail-section">
                      <p className="ao-detail-title"><Mail size={13} />Contact Details</p>
                      <div className="ao-info-card">
                        <div className="ao-info-row">
                          <span>Name</span>
                          <span>{order.customerInfo?.name || '—'}</span>
                        </div>
                        <div className="ao-info-row">
                          <span>Email</span>
                          <span className="ao-email-val">{order.customerInfo?.email || '—'}</span>
                        </div>
                        <div className="ao-info-row">
                          <span>Phone</span>
                          <span>{order.customerInfo?.phone || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="ao-detail-section">
                      <p className="ao-detail-title"><MapPin size={13} />Shipping Address</p>
                      <div className="ao-info-card">
                        <div className="ao-info-row"><span>House</span><span>{order.shippingAddress?.house || '—'}</span></div>
                        <div className="ao-info-row"><span>Area</span><span>{order.shippingAddress?.area || '—'}</span></div>
                        <div className="ao-info-row"><span>City</span><span>{order.shippingAddress?.city || '—'}</span></div>
                        <div className="ao-info-row"><span>State</span><span>{order.shippingAddress?.state || '—'}</span></div>
                        <div className="ao-info-row"><span>Pincode</span><span>{order.shippingAddress?.pincode || '—'}</span></div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="ao-detail-section ao-detail-wide">
                      <p className="ao-detail-title"><Package size={13} />Order Items</p>
                      <div className="ao-items-table">
                        <div className="ao-items-head">
                          <span>Product</span><span>Size</span><span>Qty</span><span>Price</span>
                        </div>
                        {order.items?.map((item, i) => (
                          <div key={i} className="ao-items-row">
                            <span className="ao-item-name">{item.name}</span>
                            <span>{item.size === 1 ? '1 Box' : `${item.size}ml`}</span>
                            <span>×{item.quantity}</span>
                            <span className="ao-item-price">
                              {item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}
                            </span>
                          </div>
                        ))}
                        <div className="ao-items-footer">
                          <span>Subtotal</span><span></span><span></span><span>₹{order.totalPrice}</span>
                        </div>
                        <div className="ao-items-footer">
                          <span>Shipping</span><span></span><span></span>
                          <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                        </div>
                        <div className="ao-items-total">
                          <span>Total</span><span></span><span></span>
                          <span>₹{order.finalTotal}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="ao-actions">
                    <div className="ao-status-actions">
                      <span className="ao-actions-label">Update Status:</span>
                      {['Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
                        const isActive = order.status === s;
                        const isLoading = updatingId === order.id;
                        return (
                          <button
                            key={s}
                            disabled={isActive || isLoading}
                            onClick={() => updateStatus(order.id, s)}
                            className={`ao-status-btn ${
                              s === 'Delivered' ? 'ao-btn-green' :
                              s === 'Cancelled' ? 'ao-btn-red' :
                              s === 'Shipped'   ? 'ao-btn-blue' :
                              'ao-btn-yellow'
                            } ${isActive ? 'ao-btn-active' : ''}`}
                          >
                            {isLoading ? '…' : s === 'Delivered' ? <><CheckCircle size={12}/>{s}</> :
                              s === 'Cancelled' ? <><XCircle size={12}/>{s}</> :
                              s === 'Shipped' ? <><Truck size={12}/>{s}</> :
                              <><AlertCircle size={12}/>{s}</>}
                          </button>
                        );
                      })}
                    </div>

                    <a
                      href={`https://wa.me/91${order.customerInfo?.phone}?text=${encodeURIComponent(
                        `Hi ${order.customerInfo?.name}! 👋\n\nWe've received your order at *Rahmani Perfumery* for *₹${order.finalTotal}*.\n\nPlease confirm your order for COD processing. Thank you! 🌹`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ao-wa-btn"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const adminCSS = `
/* ── Stats ── */
.ao-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 640px) { .ao-stats { grid-template-columns: repeat(2, 1fr); } }

.ao-stat {
  background: #fff;
  border: 1px solid #F1F5F9;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.ao-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
.ao-stat-yellow { border-top: 3px solid #EAB308; }
.ao-stat-green  { border-top: 3px solid #16A34A; }
.ao-stat-blue   { border-top: 3px solid #6366F1; }

.ao-stat-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #94A3B8; margin: 0 0 0.4rem;
}
.ao-stat-val {
  font-size: 1.6rem; font-weight: 800;
  color: #0F172A; margin: 0; line-height: 1;
  font-family: system-ui;
}
.ao-yellow { color: #CA8A04; }
.ao-green  { color: #16A34A; }
.ao-blue   { color: #4F46E5; }

/* ── Toolbar ── */
.ao-toolbar {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1.25rem; flex-wrap: wrap;
}
.ao-search-wrap {
  flex: 1; min-width: 200px;
  position: relative; display: flex; align-items: center;
}
.ao-search-ico {
  position: absolute; left: 12px; color: #94A3B8; flex-shrink: 0;
}
.ao-search {
  width: 100%; height: 40px;
  padding: 0 1rem 0 2.25rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.85rem; color: #0F172A;
  background: #fff; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.ao-search:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.ao-filter-wrap {
  display: flex; align-items: center; gap: 6px;
  color: #64748B;
}
.ao-filter {
  height: 40px; padding: 0 0.85rem;
  border: 1.5px solid #E2E8F0; border-radius: 8px;
  font-size: 0.82rem; font-weight: 500; color: #374151;
  background: #fff; outline: none; cursor: pointer;
  transition: border-color 0.18s;
}
.ao-filter:focus { border-color: #6366F1; }
.ao-refresh {
  width: 40px; height: 40px; border-radius: 8px;
  border: 1.5px solid #E2E8F0; background: #fff;
  display: flex; align-items: center; justify-content: center;
  color: #64748B; cursor: pointer;
  transition: all 0.18s; flex-shrink: 0;
}
.ao-refresh:hover { border-color: #6366F1; color: #6366F1; background: #EEF2FF; }

/* ── Order List ── */
.ao-list { display: flex; flex-direction: column; gap: 0.6rem; }
.ao-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 0.75rem;
  padding: 4rem; color: #CBD5E1;
  background: #fff; border-radius: 12px; border: 1px solid #F1F5F9;
}
.ao-empty p { font-size: 0.9rem; font-weight: 600; color: #94A3B8; }

/* ── Order Card ── */
.ao-card {
  background: #fff;
  border: 1px solid #F1F5F9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.ao-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
.ao-card-open { border-color: #E0E7FF; box-shadow: 0 4px 24px rgba(99,102,241,0.1); }

/* ── Summary Row ── */
.ao-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.25rem; cursor: pointer;
  transition: background 0.15s;
}
.ao-row:hover { background: #FAFBFF; }

.ao-avatar {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff; font-weight: 800; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  font-family: system-ui;
}

.ao-col { display: flex; flex-direction: column; gap: 2px; }
.ao-col-customer { flex: 1.5; min-width: 0; }
.ao-col-date     { flex: 1; }
.ao-col-items    { flex: 0.8; }
.ao-col-amount   { flex: 0.8; }
.ao-col-status   { flex: 0.8; }

.ao-name { font-size: 0.84rem; font-weight: 700; color: #0F172A; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ao-sub  { font-size: 0.72rem; color: #94A3B8; margin: 0; font-weight: 500; }
.ao-amount { font-size: 0.92rem; font-weight: 800; color: #0F172A; margin: 0; font-family: system-ui; }
.ao-email-val { font-size: 0.75rem !important; }

.ao-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em;
  white-space: nowrap;
}
.ao-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.ao-chevron {
  background: none; border: none; cursor: pointer;
  color: #94A3B8; padding: 4px; border-radius: 6px;
  flex-shrink: 0; transition: all 0.18s;
  display: flex; align-items: center;
}
.ao-chevron:hover { background: #F1F5F9; color: #475569; }

@media (max-width: 768px) {
  .ao-col-date, .ao-col-items { display: none; }
  .ao-row { gap: 0.75rem; }
}

/* ── Detail Panel ── */
.ao-detail {
  border-top: 1px solid #F1F5F9;
  padding: 1.5rem 1.25rem;
  background: #FAFBFF;
  animation: ao-open 220ms cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes ao-open { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

.ao-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.6fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 900px) { .ao-detail-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .ao-detail-grid { grid-template-columns: 1fr; } }
.ao-detail-wide { grid-column: span 1; }
@media (min-width: 900px) { .ao-detail-wide { grid-column: 3 / 4; grid-row: 1 / 3; } }

.ao-detail-section {}
.ao-detail-title {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.68rem; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #64748B; margin: 0 0 0.6rem;
}

.ao-info-card {
  background: #fff; border: 1px solid #E2E8F0;
  border-radius: 8px; overflow: hidden;
}
.ao-info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.55rem 0.85rem;
  font-size: 0.8rem; border-bottom: 1px solid #F8FAFC;
}
.ao-info-row:last-child { border-bottom: none; }
.ao-info-row span:first-child { color: #94A3B8; font-weight: 500; }
.ao-info-row span:last-child  { color: #0F172A; font-weight: 600; text-align: right; max-width: 60%; word-break: break-word; }

/* ── Items Table ── */
.ao-items-table {
  background: #fff; border: 1px solid #E2E8F0;
  border-radius: 8px; overflow: hidden;
}
.ao-items-head, .ao-items-row, .ao-items-footer, .ao-items-total {
  display: grid; grid-template-columns: 2fr 1fr 0.5fr 1fr;
  gap: 0.5rem; padding: 0.55rem 0.85rem;
  font-size: 0.78rem; align-items: center;
}
.ao-items-head {
  background: #F8FAFC; font-weight: 700;
  color: #64748B; text-transform: uppercase;
  font-size: 0.65rem; letter-spacing: 0.07em;
  border-bottom: 1px solid #E2E8F0;
}
.ao-items-row { border-bottom: 1px solid #F8FAFC; color: #374151; }
.ao-items-row:last-of-type { border-bottom: 1px solid #E2E8F0; }
.ao-item-name { font-weight: 600; color: #0F172A; }
.ao-item-price { font-weight: 700; color: #0F172A; }
.ao-items-footer { color: #64748B; font-size: 0.78rem; border-bottom: 1px solid #F8FAFC; }
.ao-items-total {
  font-weight: 800; color: #0F172A;
  background: #F0FDF4;
  border-top: 2px solid #BBF7D0;
  font-size: 0.88rem;
}
.ao-items-total span:last-child { color: #16A34A; }

/* ── Actions Bar ── */
.ao-actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  padding-top: 1.1rem;
  border-top: 1px solid #E2E8F0;
}
.ao-status-actions {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
}
.ao-actions-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #94A3B8; margin-right: 0.25rem;
}

.ao-status-btn {
  display: inline-flex; align-items: center; gap: 5px;
  height: 32px; padding: 0 0.85rem;
  border: 1.5px solid transparent;
  border-radius: 6px;
  font-size: 0.73rem; font-weight: 700;
  cursor: pointer; transition: all 0.18s;
  white-space: nowrap;
}
.ao-status-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.ao-btn-green  { background: #F0FDF4; color: #16A34A; border-color: #86EFAC; }
.ao-btn-green:hover:not(:disabled) { background: #16A34A; color: #fff; border-color: #16A34A; }
.ao-btn-red    { background: #FFF1F2; color: #E11D48; border-color: #FCA5A5; }
.ao-btn-red:hover:not(:disabled) { background: #E11D48; color: #fff; border-color: #E11D48; }
.ao-btn-blue   { background: #EFF6FF; color: #2563EB; border-color: #93C5FD; }
.ao-btn-blue:hover:not(:disabled) { background: #2563EB; color: #fff; border-color: #2563EB; }
.ao-btn-yellow { background: #FEF9C3; color: #854D0E; border-color: #FDE047; }
.ao-btn-yellow:hover:not(:disabled) { background: #CA8A04; color: #fff; border-color: #CA8A04; }
.ao-btn-active { opacity: 0.45; cursor: default; }

.ao-wa-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 1.1rem;
  background: #25D366; color: #fff;
  border: none; border-radius: 8px;
  font-size: 0.78rem; font-weight: 700;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 2px 10px rgba(37,211,102,0.3);
  transition: all 0.18s;
}
.ao-wa-btn:hover {
  background: #20BA58;
  box-shadow: 0 4px 18px rgba(37,211,102,0.4);
  transform: translateY(-1px);
}
`;
