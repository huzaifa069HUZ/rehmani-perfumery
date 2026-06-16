'use client';

import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, Area, AreaChart } from "recharts"
import { RefreshCcw, Package, Heart, Gift, ShoppingCart, Info } from "lucide-react"

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
  
  // Dummy data for the aesthetic sparklines and main chart (matching the Shopify visual exactly)
  const mainChartData = [
    { v: 10 }, { v: 12 }, { v: 8 }, { v: 14 }, { v: 11 }, { v: 9 }, { v: 15 },
    { v: 45 }, { v: 18 }, { v: 14 }, { v: 50 }, { v: 16 }, { v: 12 }, { v: 10 },
    { v: 13 }, { v: 9 }, { v: 11 }, { v: 12 }, { v: 10 }
  ];
  
  const sparklineData1 = [{ v: 5 }, { v: 15 }, { v: 8 }, { v: 25 }, { v: 10 }, { v: 15 }, { v: 5 }];
  const sparklineData2 = [{ v: 10 }, { v: 5 }, { v: 20 }, { v: 8 }, { v: 30 }, { v: 12 }, { v: 15 }];

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
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
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
    <div className="min-h-screen bg-[#22242a] text-white p-4 md:p-8 font-sans pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg font-serif">R</span>
            </div>
            <span className="font-semibold tracking-wide text-sm opacity-90">Shopify Data</span>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            className={`text-slate-400 hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN SHOPIFY WIDGET CARD */}
        <Card className="bg-white text-slate-900 border-none shadow-2xl rounded-[32px] overflow-hidden">
          <div className="p-7 md:p-9">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-900">Rahmani Perfumery</h2>
                <p className="text-[0.8rem] text-slate-400 mt-0.5 font-medium">as of {lastUpdated || '--:--'}</p>
              </div>
            </div>
            
            {/* Top row: Total Sales + Bar Chart */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="w-full md:w-auto">
                <h3 className="text-[0.9rem] font-semibold text-slate-500 mb-0.5">Total sales</h3>
                <div className="text-[2.6rem] font-extrabold tracking-tight leading-none text-slate-900">
                  ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[0.85rem] text-slate-400 mt-1.5 font-medium">-</p>
              </div>
              
              <div className="w-full md:w-[220px] h-[55px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mainChartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="v" fill="url(#colorSales)" radius={[6, 6, 6, 6]} barSize={5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub Grid (2 columns on mobile, 2 on desktop as per widget) */}
            <div className="grid grid-cols-2 gap-y-7 gap-x-8 border-t border-slate-100 pt-7">
              
              {/* Sessions */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Sessions</h3>
                    <div className="text-[1.2rem] font-bold text-slate-900 leading-none">{cartUsers.length}</div>
                  </div>
                  <div className="w-[45px] h-[25px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData1}>
                        <defs>
                          <linearGradient id="colorSpark1" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#2dd4bf" />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark1)" strokeWidth={2} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Avg Order Value */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Avg order value</h3>
                    <div className="text-[1.2rem] font-bold text-slate-900 leading-none">
                      ₹{avgOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="w-[45px] h-[25px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData2}>
                        <defs>
                          <linearGradient id="colorSpark2" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#2dd4bf" />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="url(#colorSpark2)" strokeWidth={2} fill="transparent" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Conversion Rate (Wishlist rate used as proxy for engagement) */}
              <div>
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Conversion rate</h3>
                <div className="text-[1.2rem] font-bold text-slate-900 leading-none">{wishlistRate}%</div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Total Orders */}
              <div>
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Total orders</h3>
                <div className="text-[1.2rem] font-bold text-slate-900 leading-none">{totalOrders}</div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Net Sales */}
              <div>
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Net sales</h3>
                <div className="text-[1.2rem] font-bold text-slate-900 leading-none">
                  ₹{netSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

              {/* Visitors */}
              <div>
                <h3 className="text-[0.85rem] font-semibold text-slate-500 mb-0.5">Visitors</h3>
                <div className="text-[1.2rem] font-bold text-slate-900 leading-none">{users.length}</div>
                <p className="text-[0.8rem] text-slate-400 mt-1">-</p>
              </div>

            </div>
          </div>
        </Card>

        <p className="text-center text-sm font-semibold text-slate-400 mt-2 mb-10 tracking-widest">Shopify</p>

        {/* --- ADDITIONAL DATA TABLES STYLED FOR DARK THEME --- */}
        <div className="space-y-6 mt-12">
          
          {/* Active Carts */}
          <Card className="bg-[#2a2c33] border-none shadow-none text-white rounded-[24px] overflow-hidden">
            <CardHeader className="border-b border-[#363942] px-6 py-5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#2dd4bf]" />
                  Active Checkouts
                </CardTitle>
                <Badge variant="outline" className="bg-[#2dd4bf]/10 text-[#2dd4bf] border-[#2dd4bf]/20 border-none font-semibold uppercase text-[10px] tracking-wider px-2">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cartUsers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No active checkouts currently.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#363942] hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium pl-6">Customer</TableHead>
                        <TableHead className="text-slate-400 font-medium text-right">Value</TableHead>
                        <TableHead className="text-slate-400 font-medium pr-6">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartUsers.map((cu) => (
                        <TableRow key={cu.uid} className="border-[#363942] hover:bg-[#32353e] transition-colors">
                          <TableCell className="pl-6">
                            <div className="font-semibold text-sm">{cu.name || cu.googleName || cu.email || 'Guest'}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{cu.phone || cu.email || 'No contact info'}</div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-[#2dd4bf]">
                            ₹{cu.cartTotal.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="text-xs text-slate-300">
                              {cu.cartItemCount} item(s) • {cu.cart[0]?.name.slice(0, 15)}...
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

          {/* Popular Products Leaderboard */}
          <Card className="bg-[#2a2c33] border-none shadow-none text-white rounded-[24px] overflow-hidden">
            <CardHeader className="border-b border-[#363942] px-6 py-5">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8b5cf6]" />
                Most Wished Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {sortedByWishlist.slice(0, 5).map((p, idx) => (
                    <TableRow key={p.id} className="border-[#363942] hover:bg-[#32353e] transition-colors">
                      <TableCell className="pl-6 font-medium text-slate-500 w-12">{idx + 1}</TableCell>
                      <TableCell className="font-semibold text-sm">{p.name}</TableCell>
                      <TableCell className="text-right pr-6 font-bold text-[#8b5cf6]">
                        {p.wishlistCount > 0 ? `${p.wishlistCount} Hearts` : '0'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Popup Leads */}
          <Card className="bg-[#2a2c33] border-none shadow-none text-white rounded-[24px] overflow-hidden">
            <CardHeader className="border-b border-[#363942] px-6 py-5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  Free Attar Leads
                </CardTitle>
                <span className="text-xs font-medium bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">{popupLeads.length} leads</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {popupLeads.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No leads captured yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableBody>
                      {popupLeads.slice(0, 10).map((lead) => (
                        <TableRow key={lead.id} className="border-[#363942] hover:bg-[#32353e] transition-colors">
                          <TableCell className="pl-6">
                            <div className="font-semibold text-sm">{lead.name}</div>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">
                            +91 {lead.phone}
                          </TableCell>
                          <TableCell className="text-right pr-6 text-xs text-slate-400">
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
  );
}
