'use client';

import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, Area, AreaChart } from "recharts"
import { RefreshCcw, Heart, Gift, ShoppingCart } from "lucide-react"

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
    // Generate charts once on mount to avoid hydration mismatch
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
    <div className="min-h-screen bg-[#0e1015] text-white p-4 md:p-8 font-sans w-full max-w-[100vw] overflow-x-hidden">
      
      {/* 
        CRITICAL FIX: Override the parent layout padding and background.
        This allows the dark background to reach edge-to-edge seamlessly.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .page-content {
          padding: 0 !important;
          background: #0e1015 !important;
        }
      `}} />

      <div className="w-full max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center px-2 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2dd4bf] rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
              <span className="text-[#0e1015] font-bold text-xl font-serif">R</span>
            </div>
            <span className="font-semibold tracking-wide text-sm text-slate-200">Store Analytics</span>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1f26] border border-[#2a2d36] text-slate-300 hover:text-white hover:bg-[#2a2d36] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-medium">Sync Data</span>
          </button>
        </div>

        {/* MAIN SHOPIFY WIDGET CARD */}
        <Card className="bg-white text-slate-900 border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-[28px] overflow-hidden w-full relative z-10">
          <div className="p-6 sm:p-8 md:p-10">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-[1.4rem] font-bold tracking-tight text-slate-900">Rahmani Perfumery</h2>
                <p className="text-[0.8rem] text-slate-500 mt-1 font-medium">as of {lastUpdated || '--:--'}</p>
              </div>
            </div>
            
            {/* Top row: Total Sales + Bar Chart */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 w-full">
              <div className="w-full md:w-auto shrink-0">
                <h3 className="text-[0.95rem] font-semibold text-slate-500 mb-1">Total sales</h3>
                <div className="text-[2.8rem] sm:text-[3.2rem] font-extrabold tracking-tighter leading-none text-slate-900">
                  ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[0.85rem] text-slate-400 mt-2 font-medium">-</p>
              </div>
              
              {/* Responsive container wrapped in a min-w-0 to prevent flexbox blowout */}
              <div className="w-full md:w-[280px] h-[65px] shrink-0 min-w-0 self-end">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mainChartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="v" fill="url(#colorSales)" radius={[6, 6, 6, 6]} barSize={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 border-t border-slate-100 pt-8 w-full">
              
              {/* Sessions */}
              <div className="w-full min-w-0">
                <div className="flex justify-between items-end mb-2 gap-2">
                  <div className="shrink-0">
                    <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Sessions</h3>
                    <div className="text-[1.3rem] font-bold text-slate-900 leading-none">{cartUsers.length}</div>
                  </div>
                  <div className="w-[60px] h-[28px] shrink-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData1}>
                        <defs>
                          <linearGradient id="colorSpark1" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#2dd4bf" />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark1)" strokeWidth={2.5} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Avg Order Value */}
              <div className="w-full min-w-0">
                <div className="flex justify-between items-end mb-2 gap-2">
                  <div className="shrink-0">
                    <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Avg order value</h3>
                    <div className="text-[1.3rem] font-bold text-slate-900 leading-none">
                      ₹{avgOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="w-[60px] h-[28px] shrink-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData2}>
                        <defs>
                          <linearGradient id="colorSpark2" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#2dd4bf" />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark2)" strokeWidth={2.5} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Conversion Rate */}
              <div className="w-full">
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Conversion rate</h3>
                <div className="text-[1.3rem] font-bold text-slate-900 leading-none">{wishlistRate}%</div>
                <p className="text-[0.8rem] text-slate-400 mt-2">-</p>
              </div>

              {/* Total Orders */}
              <div className="w-full">
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Total orders</h3>
                <div className="text-[1.3rem] font-bold text-slate-900 leading-none">{totalOrders}</div>
                <p className="text-[0.8rem] text-slate-400 mt-2">-</p>
              </div>

              {/* Net Sales */}
              <div className="w-full">
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Net sales</h3>
                <div className="text-[1.3rem] font-bold text-slate-900 leading-none">
                  ₹{netSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-2">-</p>
              </div>

              {/* Visitors */}
              <div className="w-full">
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-1">Visitors</h3>
                <div className="text-[1.3rem] font-bold text-slate-900 leading-none">{users.length}</div>
                <p className="text-[0.8rem] text-slate-400 mt-2">-</p>
              </div>

            </div>
          </div>
        </Card>

        <div className="flex justify-center mt-4 mb-12">
          <Badge variant="outline" className="bg-[#1c1f26] text-slate-400 border-[#2a2d36] uppercase tracking-widest text-[10px] px-3 py-1 font-semibold">
            Shopify Engine
          </Badge>
        </div>

        {/* --- ADDITIONAL DATA TABLES STYLED FOR PREMIUM DARK SAAS --- */}
        <div className="space-y-8">
          
          {/* Active Carts */}
          <Card className="bg-[#1c1f26] border border-[#2a2d36] shadow-xl text-white rounded-[24px] overflow-hidden w-full">
            <CardHeader className="border-b border-[#2a2d36] px-6 md:px-8 py-6 bg-[#181a20]">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-100">
                  <ShoppingCart className="w-4 h-4 text-[#2dd4bf]" />
                  Active Checkouts
                </CardTitle>
                <Badge className="bg-[#2dd4bf]/15 text-[#2dd4bf] hover:bg-[#2dd4bf]/20 border-none font-semibold uppercase text-[10px] tracking-wider px-2.5 py-0.5">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cartUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">No active checkouts currently.</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <Table className="w-full min-w-[600px]">
                    <TableHeader className="bg-[#1c1f26]">
                      <TableRow className="border-[#2a2d36] hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium pl-6 md:pl-8 py-4">Customer</TableHead>
                        <TableHead className="text-slate-400 font-medium text-right pr-6 py-4 w-[150px]">Value</TableHead>
                        <TableHead className="text-slate-400 font-medium text-left pl-6 py-4">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartUsers.map((cu) => (
                        <TableRow key={cu.uid} className="border-[#2a2d36] hover:bg-[#22252d] transition-colors">
                          <TableCell className="pl-6 md:pl-8 py-4">
                            <div className="font-semibold text-sm text-slate-200">{cu.name || cu.googleName || cu.email || 'Guest User'}</div>
                            <div className="text-xs text-slate-500 mt-1">{cu.phone || cu.email || 'No contact info'}</div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-[#2dd4bf] pr-6 py-4 align-top pt-5">
                            ₹{cu.cartTotal.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-left pl-6 py-4 align-top pt-5">
                            <div className="text-xs text-slate-400">
                              <span className="text-slate-300 font-medium">{cu.cartItemCount} item(s)</span> • {cu.cart[0]?.name}
                              {cu.cart.length > 1 && <span className="text-slate-500 ml-1">+{cu.cart.length - 1} more</span>}
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
            <Card className="bg-[#1c1f26] border border-[#2a2d36] shadow-xl text-white rounded-[24px] overflow-hidden w-full">
              <CardHeader className="border-b border-[#2a2d36] px-6 py-6 bg-[#181a20]">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-100">
                  <Heart className="w-4 h-4 text-[#8b5cf6]" />
                  Most Wished Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <Table className="w-full min-w-[300px]">
                    <TableBody>
                      {sortedByWishlist.slice(0, 5).map((p, idx) => (
                        <TableRow key={p.id} className="border-[#2a2d36] hover:bg-[#22252d] transition-colors">
                          <TableCell className="pl-6 font-medium text-slate-500 w-12 py-4">{idx + 1}</TableCell>
                          <TableCell className="font-semibold text-sm text-slate-200 py-4">{p.name}</TableCell>
                          <TableCell className="text-right pr-6 font-bold text-[#8b5cf6] py-4">
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
            <Card className="bg-[#1c1f26] border border-[#2a2d36] shadow-xl text-white rounded-[24px] overflow-hidden w-full">
              <CardHeader className="border-b border-[#2a2d36] px-6 py-6 bg-[#181a20]">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-100">
                    <Gift className="w-4 h-4 text-amber-400" />
                    Free Attar Leads
                  </CardTitle>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-full">{popupLeads.length} leads</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {popupLeads.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">No leads captured yet.</div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full min-w-[300px]">
                      <TableBody>
                        {popupLeads.slice(0, 5).map((lead) => (
                          <TableRow key={lead.id} className="border-[#2a2d36] hover:bg-[#22252d] transition-colors">
                            <TableCell className="pl-6 py-4">
                              <div className="font-semibold text-sm text-slate-200">{lead.name || 'Anonymous'}</div>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm py-4">
                              +91 {lead.phone}
                            </TableCell>
                            <TableCell className="text-right pr-6 text-xs text-slate-500 py-4">
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
