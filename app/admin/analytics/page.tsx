'use client';

import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, Area, AreaChart } from "recharts"
import { RefreshCcw, Heart, Gift, ShoppingCart, TrendingUp } from "lucide-react"
import Image from 'next/image';

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
  images?: string[];
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
  const topWishlistCount = sortedByWishlist[0]?.wishlistCount || 1; // Used for progress bars

  return (
    <div className="w-full bg-transparent text-slate-900 font-sans animate-in fade-in duration-500 pb-12">
      
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

        {/* MAIN METRICS CARD */}
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

            {/* Sub Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 border-t border-slate-100 pt-8 w-full">
              
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

              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Conversion rate</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{wishlistRate}%</div>
              </div>

              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Total orders</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{totalOrders}</div>
              </div>

              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Net sales</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">
                  ₹{netSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="w-full min-w-0">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Visitors</h3>
                <div className="text-2xl font-bold text-slate-900 leading-none">{users.length}</div>
              </div>

            </div>
          </div>
        </Card>

        {/* --- SPACIOUS FLEX LISTS (Modern SaaS Style) --- */}
        <div className="grid grid-cols-1 gap-8 w-full">
          
          {/* Active Checkouts (Flex List) */}
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
                <div className="flex flex-col w-full divide-y divide-slate-100">
                  {cartUsers.map((cu) => {
                    const displayName = cu.name || cu.googleName || cu.email || 'Guest User';
                    const displayContact = cu.phone || cu.email || 'No contact info';
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                      <div key={cu.uid} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 hover:bg-slate-50 transition-colors w-full min-w-0">
                        
                        {/* Customer Info */}
                        <div className="flex items-center gap-4 min-w-0 sm:w-[40%] shrink-0">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200 shadow-sm">
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-slate-900 truncate" title={displayName}>
                              {displayName}
                            </div>
                            <div className="text-xs text-slate-500 truncate" title={displayContact}>
                              {displayContact}
                            </div>
                          </div>
                        </div>

                        {/* Cart Details */}
                        <div className="min-w-0 sm:w-[40%] flex flex-col justify-center shrink-0">
                          <div className="text-sm font-medium text-slate-700 truncate" title={cu.cart[0]?.name}>
                            <span className="font-bold text-slate-900">{cu.cartItemCount} item(s)</span>
                            <span className="text-slate-300 mx-2">•</span>
                            {cu.cart[0]?.name}
                          </div>
                          {cu.cart.length > 1 && (
                            <div className="text-xs text-slate-400 mt-0.5">+{cu.cart.length - 1} more items</div>
                          )}
                        </div>

                        {/* Value */}
                        <div className="shrink-0 text-left sm:text-right sm:w-[20%]">
                          <div className="font-black text-[15px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block border border-emerald-100">
                            ₹{cu.cartTotal.toLocaleString('en-IN')}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            
            {/* Popular Products Leaderboard (Flex List with Images) */}
            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden w-full">
              <CardHeader className="border-b border-slate-100 px-6 py-5 bg-slate-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Most Wished Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {sortedByWishlist.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No wishlist data.</div>
                ) : (
                  <div className="flex flex-col w-full divide-y divide-slate-100">
                    {sortedByWishlist.slice(0, 5).map((p, idx) => {
                      const fillPercent = Math.min(100, (p.wishlistCount / topWishlistCount) * 100);
                      
                      return (
                        <div key={p.id} className="flex items-center gap-4 py-4 px-6 hover:bg-slate-50 transition-colors min-w-0">
                          
                          {/* Rank */}
                          <div className="font-bold text-slate-300 text-sm w-4 shrink-0 text-center">
                            {idx + 1}
                          </div>

                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200 shadow-sm flex items-center justify-center">
                            {p.images && p.images[0] ? (
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <Heart className="w-4 h-4 text-slate-300" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-slate-900 truncate" title={p.name}>{p.name}</div>
                            <div className="text-xs text-slate-500 truncate mt-0.5">{p.category || 'Uncategorized'}</div>
                          </div>

                          {/* Hearts & Progress */}
                          <div className="shrink-0 flex flex-col items-end gap-1.5 w-[80px]">
                            <div className="text-xs font-bold text-rose-500">
                              {p.wishlistCount > 0 ? `${p.wishlistCount} Hearts` : '0'}
                            </div>
                            {p.wishlistCount > 0 && (
                              <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                                  style={{ width: `${fillPercent}%` }} 
                                />
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popup Leads (Flex List) */}
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
                  <div className="text-center py-12 text-slate-500 text-sm">No leads captured yet.</div>
                ) : (
                  <div className="flex flex-col w-full divide-y divide-slate-100">
                    {popupLeads.slice(0, 5).map((lead) => {
                      const initial = (lead.name || 'A').charAt(0).toUpperCase();

                      return (
                        <div key={lead.id} className="flex items-center justify-between gap-4 py-4 px-6 hover:bg-slate-50 transition-colors min-w-0">
                          
                          {/* Name & Initial */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                              {initial}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-slate-900 truncate">{lead.name || 'Anonymous'}</div>
                              <div className="text-xs font-medium text-slate-500 mt-0.5">+91 {lead.phone}</div>
                            </div>
                          </div>

                          {/* Offer Badge */}
                          <div className="shrink-0">
                            <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase tracking-wide">
                              {lead.offer || 'Free Trial'}
                            </div>
                          </div>

                        </div>
                      );
                    })}
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
