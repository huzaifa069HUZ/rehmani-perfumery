'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { RefreshCcw, Download, Calendar, ArrowUpRight, ArrowDownRight, Monitor, Smartphone, Tablet, MapPin } from 'lucide-react';
import Image from 'next/image';

// --- Types ---
interface ProductStat {
  id: string;
  name: string;
  category: string;
  price: number;
  cartCount: number;
  wishlistCount: number;
  images?: string[];
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartUser {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  googleName?: string;
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
}

interface Order {
  id: string;
  createdAt: any;
  finalTotal: number;
  totalPrice: number;
  shippingFee: number;
  status: string;
  customerInfo?: { name: string; phone: string; email: string };
  shippingAddress?: { state: string; city: string };
}

// --- Custom Tooltips ---
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ color: '#6B7280', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{label}</div>
        <div style={{ color: '#111827', fontSize: '18px', fontWeight: 800 }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', minWidth: '160px' }}>
        <div style={{ color: '#6B7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
                <span style={{ color: '#4B5563', fontSize: '14px', fontWeight: 500 }}>{entry.name}</span>
              </div>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: 800 }}>
                {entry.name === 'Revenue' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  // Data State
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [cartUsers, setCartUsers] = useState<CartUser[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Chart Data
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [donutData, setDonutData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch Orders
        const orderSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const ordersList = orderSnap.docs.map(d => ({ id: d.id, ...d.data() as any })) as Order[];
        
        let tSales = 0;
        let tOrders = 0;

        // Initialize 30-day timeline
        const last30Days = Array.from({ length: 30 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return {
            dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            key: d.toISOString().split('T')[0],
            revenue: 0,
            orders: 0
          };
        });

        const statusCounts: Record<string, number> = { Pending: 0, Confirmed: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        const stateCounts: Record<string, number> = {};

        ordersList.forEach(o => {
          // Status aggregation
          if (statusCounts[o.status] !== undefined) {
            statusCounts[o.status]++;
          } else {
            statusCounts[o.status] = 1;
          }

          if (o.status !== 'Cancelled') {
            tOrders++;
            const saleVal = (o.finalTotal || o.totalPrice || 0);
            tSales += saleVal;

            // Region aggregation
            if (o.shippingAddress?.state) {
              const s = o.shippingAddress.state;
              stateCounts[s] = (stateCounts[s] || 0) + 1;
            }

            // Timeline aggregation
            if (o.createdAt?.seconds) {
              const d = new Date(o.createdAt.seconds * 1000);
              const key = d.toISOString().split('T')[0];
              const dayObj = last30Days.find(day => day.key === key);
              if (dayObj) {
                dayObj.revenue += saleVal;
                dayObj.orders += 1;
              }
            }
          }
        });

        setTotalSales(tSales);
        setTotalOrders(tOrders);
        setRevenueData(last30Days.map(d => ({ date: d.dateStr, value: d.revenue, orders: d.orders })));

        // Set Donut Data
        const dData = [
          { name: 'Delivered', value: statusCounts.Delivered || 0, color: '#10B981' },
          { name: 'Pending', value: statusCounts.Pending || 0, color: '#F59E0B' },
          { name: 'Shipped', value: statusCounts.Shipped || 0, color: '#3B82F6' },
          { name: 'Confirmed', value: statusCounts.Confirmed || 0, color: '#8B5CF6' },
          { name: 'Cancelled', value: statusCounts.Cancelled || 0, color: '#EF4444' }
        ].filter(d => d.value > 0);
        setDonutData(dData.length > 0 ? dData : [{ name: 'No Orders', value: 1, color: '#E5E7EB' }]);

        // Set Region Data
        const totalValidRegions = Object.values(stateCounts).reduce((a,b)=>a+b, 0) || 1;
        const rData = Object.entries(stateCounts)
          .map(([name, count]) => ({ name, value: Math.round((count / totalValidRegions) * 100) }))
          .sort((a,b) => b.value - a.value)
          .slice(0, 4);
        setRegionData(rData);

        // Recent Orders
        setRecentOrders(ordersList.slice(0, 5));

        // Fetch Products
        const prodSnap = await getDocs(collection(db, 'products'));
        const prodList = prodSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any),
          cartCount: 0,
          wishlistCount: 0,
        }));

        // Fetch Users
        const userSnap = await getDocs(collection(db, 'users'));
        const userList = userSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        setUsersCount(userList.length);

        // Carts & Wishlists
        const cartUsersList: CartUser[] = [];
        userList.forEach(data => {
          if (data.cart && data.cart.length > 0) {
            const cartTotal = data.cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            const cartItemCount = data.cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
            cartUsersList.push({
              uid: data.id,
              email: data.email || '',
              name: data.name || '',
              googleName: data.googleName || '',
              phone: data.phone || '',
              cart: data.cart,
              cartTotal,
              cartItemCount,
            });
          }
          if (data.wishlist && Array.isArray(data.wishlist)) {
            data.wishlist.forEach((item: any) => {
              const pid = typeof item === 'object' && item !== null && 'id' in item ? item.id : item;
              const prod = prodList.find(p => p.id === pid);
              if (prod) prod.wishlistCount++;
            });
          }
        });
        cartUsersList.sort((a, b) => b.cartTotal - a.cartTotal);

        setProducts(prodList);
        setCartUsers(cartUsersList);
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  // Derived Metrics
  const sortedByWishlist = [...products].sort((a, b) => b.wishlistCount - a.wishlistCount);
  const conversionRate = usersCount > 0 ? ((totalOrders / usersCount) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#FAFAFA', color: '#111827', fontFamily: 'system-ui, sans-serif', padding: '32px 0 80px 0' }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ================= SECTION 1: TOP NAVIGATION ================= */}
        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#111827' }}>Analytics</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontWeight: 500 }}>
              Live store performance based on real orders. Last updated {lastUpdated || '--:--'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', backgroundColor: '#fff', border: '1px solid #E5E7EB', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <Calendar size={16} color="#6B7280" />
              Last 30 Days
            </button>
            <button 
              onClick={() => setRefreshKey(k => k + 1)}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', backgroundColor: '#111827', border: 'none', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </header>

        {/* ================= SECTION 2: HERO REVENUE CARD ================= */}
        <div style={{ width: '100%', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', margin: '0 0 8px 0' }}>Total Revenue (30 Days)</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827', lineHeight: 1 }}>
                  ₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#ECFDF5', color: '#047857', fontSize: '14px', fontWeight: 700, border: '1px solid #D1FAE5' }}>
                  <ArrowUpRight size={16} /> Real Data
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '320px', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} dx={-10} />
                <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: '#D1D5DB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#colorRevenue)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= SECTION 3: KPI GRID ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', margin: '0 0 12px 0' }}>Orders</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{totalOrders}</span>
            </div>
            <div style={{ height: '40px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-10)}><Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', margin: '0 0 12px 0' }}>Active Sessions</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{cartUsers.length}</span>
            </div>
            <div style={{ height: '40px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-10)}><Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', margin: '0 0 12px 0' }}>Total Visitors</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{usersCount}</span>
            </div>
            <div style={{ height: '40px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-10)}><Line type="step" dataKey="orders" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', margin: '0 0 12px 0' }}>Conversion Rate</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{conversionRate}%</span>
            </div>
            <div style={{ height: '40px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-10)}><Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ================= SECTION 4: BREAKDOWN ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Left: Line Chart */}
          <div style={{ gridColumn: '1 / -1', '@media (min-width: 1024px)': { gridColumn: 'span 2' }, backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' } as any}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 32px 0' }}>Sales vs Orders</h3>
            <div style={{ width: '100%', height: '320px', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} minTickGap={30} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dx={10} />
                  <Tooltip content={<CustomLineTooltip />} cursor={{ fill: '#F9FAFB' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500, color: '#4B5563' }} />
                  <Line yAxisId="left" type="monotone" dataKey="value" name="Revenue" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }} animationDuration={1500} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }} animationDuration={1500} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Donut Chart */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 16px 0' }}>Order Status Breakdown</h3>
            <div style={{ flex: 1, minHeight: '250px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="45%" innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                    {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#111827', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                {donutData.map((src, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: src.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginLeft: 'auto' }}>{src.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: ACTIVE CHECKOUTS ================= */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Active Checkouts</h3>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#047857', backgroundColor: '#ECFDF5', padding: '4px 12px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
              {cartUsers.length} Carts
            </div>
          </div>
          
          <div style={{ width: '100%' }}>
            {cartUsers.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>No active checkouts.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {cartUsers.map((cu, idx) => {
                  const displayName = cu.name || cu.googleName || cu.email || 'Guest User';
                  const displayContact = cu.phone || cu.email || 'No contact info';
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <div key={cu.uid} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '16px 32px', borderBottom: idx !== cartUsers.length - 1 ? '1px solid #F3F4F6' : 'none', gap: '16px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 250px', minWidth: 0 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0, border: '1px solid #E5E7EB' }}>
                          {initial}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                          <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{displayContact}</div>
                        </div>
                      </div>

                      <div style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ fontWeight: 800, color: '#111827' }}>{cu.cartItemCount} items</span>
                          <span style={{ color: '#D1D5DB', margin: '0 8px' }}>/</span>
                          {cu.cart[0]?.name}
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, minWidth: '100px', textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#111827' }}>
                          ₹{cu.cartTotal.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, minWidth: '100px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                          In Checkout
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 6: BOTTOM INSIGHTS ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 24px 0' }}>Top Wished Products</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sortedByWishlist.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', overflow: 'hidden', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontWeight: 800, fontSize: '14px' }}>
                    {p.images && p.images[0] ? <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="48px" /> : (i + 1)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{p.category || 'Product'}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                    {p.wishlistCount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 24px 0' }}>Recent Real Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recentOrders.length === 0 ? (
                <div style={{ fontSize: '14px', color: '#6B7280' }}>No recent orders.</div>
              ) : (
                recentOrders.map((o) => {
                  const date = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today';
                  const name = o.customerInfo?.name || 'Customer';
                  return (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#111827' }}>₹{(o.finalTotal || o.totalPrice || 0).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px', color: o.status === 'Delivered' ? '#059669' : '#D97706' }}>{o.status}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 24px 0' }}>Top Delivery Regions</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
              {regionData.length === 0 ? <div style={{ fontSize: '14px', color: '#6B7280' }}>No data available.</div> : null}
              {regionData.map((reg) => (
                <div key={reg.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                      <MapPin size={16} />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{reg.name}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>{reg.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', backgroundColor: '#111827', width: `${reg.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
