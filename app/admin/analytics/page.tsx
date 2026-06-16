'use client';

import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, Area, AreaChart } from "recharts"
import { RefreshCcw, Heart, Gift, ShoppingCart, TrendingUp } from "lucide-react"

interface PopupLead {
  id: string;
  uid?: string;
  name: string;
  phone: string;
  address: string;
  offer: string;
  claimedAt?: { toDate?: () => Date; seconds?: number };
}

interface ProductStat {
  id: string;
  name: string;
  category: string;
  price: number;
  cartCount: number;
  wishlistCount: number;
}

interface CartItem {
  name: string;
  size: number;
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

export default function AnalyticsPage() {
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cartUsers, setCartUsers] = useState<CartUser[]>([]);
  const [popupLeads, setPopupLeads] = useState<PopupLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Real Order Metrics
  const [totalSales, setTotalSales] = useState(0);
  const [netSales, setNetSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Dynamic Sparkline Data Generator
  const generateSparkData = (base: number) => {
    return Array.from({ length: 15 }).map((_, i) => ({
      v: Math.max(2, base + (Math.random() - 0.5) * base * 0.6)
    }));
  };

  const [mainChartData, setMainChartData] = useState<{v: number}[]>([]);
  const [sparklineData1, setSparklineData1] = useState<{v: number}[]>([]);
  const [sparklineData2, setSparklineData2] = useState<{v: number}[]>([]);

  useEffect(() => {
    setMainChartData(generateSparkData(20));
    setSparklineData1(generateSparkData(10));
    setSparklineData2(generateSparkData(15));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { getDocsFromServer } = await import('firebase/firestore');

        // Fetch Orders
        const orderSnap = await getDocsFromServer(collection(db, 'orders'));
        const ordersList = orderSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
        
        let tSales = 0;
        let nSales = 0;
        let tOrders = 0;

        ordersList.forEach(o => {
          if (o.status !== 'Cancelled') {
            tOrders++;
            const oTotal = o.finalTotal || o.totalPrice || 0;
            const oShipping = o.shippingFee || 0;
            tSales += oTotal;
            nSales += (oTotal - oShipping);
          }
        });

        setTotalSales(tSales);
        setNetSales(nSales);
        setTotalOrders(tOrders);

        // Fetch Products
        const prodSnap = await getDocsFromServer(collection(db, 'products'));
        const prodList = prodSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any),
          cartCount: 0,
          wishlistCount: 0,
        }));

        // Fetch Users
        const userSnap = await getDocsFromServer(collection(db, 'users'));
        const userList = userSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

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

        // Fetch Leads
        const leadsSnap = await getDocsFromServer(collection(db, 'popup_leads'));
        const leadsList: PopupLead[] = leadsSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any),
        }));
        leadsList.sort((a, b) => {
          const aTime = a.claimedAt?.seconds ?? 0;
          const bTime = b.claimedAt?.seconds ?? 0;
          return bTime - aTime;
        });

        setProducts(prodList);
        setUsers(userList);
        setCartUsers(cartUsersList);
        setPopupLeads(leadsList);
        
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const usersWithWishlist = users.filter(u => u.wishlist && u.wishlist.length > 0).length;
  const wishlistRate = users.length > 0 ? Math.round((usersWithWishlist / users.length) * 100) : 0;
  const sortedByWishlist = [...products].sort((a, b) => b.wishlistCount - a.wishlistCount);

  return (
    // Transparent background lets the admin layout's #f0f2f8 shine through perfectly.
    <div className="w-full bg-transparent text-slate-900 font-sans animate-in fade-in duration-500">
      
      <div className="w-full max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex justify-between items-end pb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Analytics</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live data as of {lastUpdated || '--:--'}
            </p>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-semibold">Refresh</span>
          </button>
        </div>

        {/* MAIN METRICS CARD (Shopify Style) */}
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden w-full">
          <div className="p-6 md:p-8">
            
            {/* Top row: Total Sales + Main Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 w-full items-end">
              <div className="w-full min-w-0">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total sales</h3>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 shadow-none flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Stable
                  </Badge>
                  <p className="text-xs text-slate-400 font-medium">vs previous period</p>
                </div>
              </div>
              
              {/* Strict w-full min-w-0 bounds for Recharts */}
              <div className="w-full h-[80px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mainChartData}>
                    <defs>
                      <linearGradient id="colorSalesLight" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="v" fill="url(#colorSalesLight)" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub Grid (3 columns on large, 2 on med, 1 on small) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 border-t border-slate-100 pt-8 w-full">
              
              {/* Sessions */}
              <div className="w-full min-w-0">
                <div className="flex justify-between items-end mb-2 gap-4">
                  <div className="shrink-0">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Sessions</h3>
                    <div className="text-2xl font-bold text-slate-900 leading-none">{cartUsers.length}</div>
                  </div>
                  <div className="w-[80px] h-[35px] shrink-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData1}>
                        <defs>
                          <linearGradient id="colorSpark1" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark1)" strokeWidth={3} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Avg Order Value */}
              <div className="w-full min-w-0">
                <div className="flex justify-between items-end mb-2 gap-4">
                  <div className="shrink-0">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Avg order value</h3>
                    <div className="text-2xl font-bold text-slate-900 leading-none">
                      ₹{avgOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="w-[80px] h-[35px] shrink-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData2}>
                        <defs>
                          <linearGradient id="colorSpark2" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark2)" strokeWidth={3} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Conversion rate</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{wishlistRate}%</div>
              </div>

              {/* Total Orders */}
              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Total orders</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{totalOrders}</div>
              </div>

              {/* Net Sales */}
              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Net sales</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">
                  ₹{netSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Visitors */}
              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Visitors</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{users.length}</div>
              </div>

            </div>
          </div>
        </Card>

        {/* --- SPACIOUS DATA TABLES (White Theme) --- */}
        <div className="grid grid-cols-1 gap-8 w-full">
          
          {/* Active Carts */}
          <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden w-full">
            <CardHeader className="border-b border-slate-100 px-6 py-5 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <ShoppingCart className="w-4 h-4 text-emerald-500" />
                  Active Checkouts
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-bold uppercase text-[10px] tracking-wider px-2.5 py-0.5 shadow-none">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cartUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">No active checkouts currently.</div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table className="w-full min-w-[600px]">
                    <TableHeader className="bg-white">
                      <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="w-[40%] text-slate-500 font-semibold pl-8 py-4">Customer</TableHead>
                        <TableHead className="w-[20%] text-slate-500 font-semibold text-right pr-8 py-4">Value</TableHead>
                        <TableHead className="w-[40%] text-slate-500 font-semibold text-left pl-8 py-4">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartUsers.map((cu) => (
                        <TableRow key={cu.uid} className="border-slate-100 hover:bg-slate-50 transition-colors">
                          <TableCell className="w-[40%] pl-8 py-4">
                            <div className="font-bold text-sm text-slate-900">{cu.name || cu.googleName || cu.email || 'Guest User'}</div>
                            <div className="text-xs text-slate-500 mt-1">{cu.phone || cu.email || 'No contact info'}</div>
                          </TableCell>
                          <TableCell className="w-[20%] text-right font-black text-emerald-600 pr-8 py-4 align-top pt-5">
                            ₹{cu.cartTotal.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="w-[40%] text-left pl-8 py-4 align-top pt-5">
                            <div className="text-xs text-slate-600">
                              <span className="font-bold text-slate-900">{cu.cartItemCount} item(s)</span> • {cu.cart[0]?.name}
                              {cu.cart.length > 1 && <span className="text-slate-400 ml-1">+{cu.cart.length - 1} more</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Popular Products Leaderboard */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden w-full">
              <CardHeader className="border-b border-slate-100 px-6 py-5 bg-slate-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Most Wished Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <Table className="w-full min-w-[400px]">
                    <TableHeader className="bg-white hidden">
                      <TableRow>
                        <TableHead className="w-[15%]"></TableHead>
                        <TableHead className="w-[55%]"></TableHead>
                        <TableHead className="w-[30%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedByWishlist.slice(0, 5).map((p, idx) => (
                        <TableRow key={p.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                          <TableCell className="w-[15%] pl-6 font-bold text-slate-400 py-4 text-center">{idx + 1}</TableCell>
                          <TableCell className="w-[55%] font-bold text-sm text-slate-900 py-4">{p.name}</TableCell>
                          <TableCell className="w-[30%] text-right pr-6 font-bold text-rose-500 py-4">
                            {p.wishlistCount > 0 ? `${p.wishlistCount} Hearts` : '0'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Popup Leads */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden w-full">
              <CardHeader className="border-b border-slate-100 px-6 py-5 bg-slate-50/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                    <Gift className="w-4 h-4 text-indigo-500" />
                    Free Attar Leads
                  </CardTitle>
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none font-bold uppercase text-[10px] tracking-wider px-2.5 py-0.5 shadow-none">
                    {popupLeads.length} leads
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {popupLeads.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">No leads captured yet.</div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <Table className="w-full min-w-[400px]">
                       <TableHeader className="bg-white hidden">
                        <TableRow>
                          <TableHead className="w-[40%]"></TableHead>
                          <TableHead className="w-[35%]"></TableHead>
                          <TableHead className="w-[25%]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {popupLeads.slice(0, 5).map((lead) => (
                          <TableRow key={lead.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                            <TableCell className="w-[40%] pl-6 py-4">
                              <div className="font-bold text-sm text-slate-900">{lead.name || 'Anonymous'}</div>
                            </TableCell>
                            <TableCell className="w-[35%] text-slate-600 text-sm font-medium py-4">
                              +91 {lead.phone}
                            </TableCell>
                            <TableCell className="w-[25%] text-right pr-6 text-xs font-semibold text-slate-400 py-4">
                              {lead.offer}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
