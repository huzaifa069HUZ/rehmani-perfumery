'use client';

import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { RefreshCcw, Package, Users, Heart, BarChart3, Gift, ShoppingCart, TrendingUp, CircleDollarSign, Repeat, MapPin, Search } from "lucide-react"

interface PopupLead {
  id: string;
  uid?: string;
  name: string;
  phone: string;
  address: string;
  offer: string;
  claimedAt?: { toDate?: () => Date; seconds?: number };
  source?: string;
}

interface ProductStat {
  id: string;
  name: string;
  category: string;
  images?: string[];
  price: number;
  cartCount: number;
  wishlistCount: number;
}

interface CartItem {
  id: string | number;
  name: string;
  size: number;
  price: number;
  quantity: number;
  image?: string;
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

const chartConfig = {
  wishlistCount: {
    label: "Hearts",
    color: "#3b82f6",
  },
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<ProductStat[]>([]);
  const [users, setUsers] = useState<{ id: string; wishlist?: string[] }[]>([]);
  const [cartUsers, setCartUsers] = useState<CartUser[]>([]);
  const [popupLeads, setPopupLeads] = useState<PopupLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { getDocsFromServer } = await import('firebase/firestore');

        const prodSnap = await getDocsFromServer(collection(db, 'products'));
        const prodList = prodSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ProductStat, 'id' | 'cartCount' | 'wishlistCount'>),
          cartCount: 0,
          wishlistCount: 0,
        }));

        const userSnap = await getDocsFromServer(collection(db, 'users'));
        const userList = userSnap.docs.map(d => ({ id: d.id, ...(d.data() as { wishlist?: any[] }) }));

        const cartUsersList: CartUser[] = [];
        userSnap.docs.forEach(d => {
          const data = d.data() as {
            name?: string; phone?: string; email?: string; googleName?: string;
            wishlist?: string[];
            cart?: CartItem[];
          };
          if (data.cart && data.cart.length > 0) {
            const cartTotal = data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartItemCount = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartUsersList.push({
              uid: d.id,
              email: data.email || '',
              name: data.name || '',
              googleName: data.googleName || '',
              phone: data.phone || '',
              cart: data.cart,
              cartTotal,
              cartItemCount,
            });
          }
        });
        cartUsersList.sort((a, b) => b.cartTotal - a.cartTotal);

        userList.forEach(u => {
          if (u.wishlist && Array.isArray(u.wishlist)) {
            u.wishlist.forEach((item: any) => {
              const pid = typeof item === 'object' && item !== null && 'id' in item ? item.id : item;
              const prod = prodList.find(p => p.id === pid);
              if (prod) prod.wishlistCount++;
            });
          }
        });

        const leadsSnap = await getDocsFromServer(collection(db, 'popup_leads'));
        const leadsList: PopupLead[] = leadsSnap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<PopupLead, 'id'>),
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
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalWishlisted = products.reduce((sum, p) => sum + p.wishlistCount, 0);
  const usersWithWishlist = users.filter(u => u.wishlist && u.wishlist.length > 0).length;
  const wishlistRate = totalUsers > 0 ? Math.round((usersWithWishlist / totalUsers) * 100) : 0;
  const avgWishlistPerUser = totalUsers > 0 ? (totalWishlisted / totalUsers).toFixed(1) : '0';
  const sortedByWishlist = [...products].sort((a, b) => b.wishlistCount - a.wishlistCount);
  const chartData = sortedByWishlist.slice(0, 7).map(p => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    wishlistCount: p.wishlistCount,
    fullName: p.name
  }));

  const kpis = [
    { label: 'Total Products', value: totalProducts, sub: 'In catalogue', icon: Package },
    { label: 'Registered Users', value: totalUsers, sub: 'Unique accounts', icon: Users },
    { label: 'Total Hearts', value: totalWishlisted, sub: 'Across all users', icon: Heart },
    { label: 'Wishlist Rate', value: `${wishlistRate}%`, sub: 'Users who engaged', icon: BarChart3 },
    { label: 'Free Attar Leads', value: popupLeads.length, sub: 'Popup submissions', icon: Gift },
  ];

  const popupLeadByUid = new Map(popupLeads.filter(l => l.uid).map(l => [l.uid!, l]));

  const suggestions = [
    { icon: ShoppingCart, title: 'Cart Abandonment', desc: 'Track users who added to cart but never purchased. Industry avg: 70%. Key lever for recovery.', tag: 'HIGH IMPACT', variant: 'destructive' as const },
    { icon: CircleDollarSign, title: 'Revenue by Product', desc: 'Identify top revenue-generating products vs underperformers to focus inventory.', tag: 'CRITICAL', variant: 'default' as const },
    { icon: TrendingUp, title: 'Sales Over Time', desc: 'Weekly/monthly line chart — spot seasonal peaks like Eid or Diwali to stock ahead.', tag: 'RECOMMENDED', variant: 'outline' as const },
    { icon: Repeat, title: 'Repeat Buyer Rate', desc: 'Percentage of customers who ordered 2+ times. Higher = stronger brand loyalty.', tag: 'LOYALTY', variant: 'secondary' as const },
    { icon: MapPin, title: 'Geographic Demand', desc: 'Detect top cities/regions to optimize delivery partners and COD availability.', tag: 'GROWTH', variant: 'default' as const },
    { icon: Search, title: 'Search Behavior', desc: 'What customers search for most reveals gaps in your product catalogue.', tag: 'PRODUCT', variant: 'outline' as const },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Live from Firestore 
            {lastUpdated && <Badge variant="secondary" className="font-mono text-xs">Last updated: {lastUpdated}</Badge>}
          </p>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Fetching...' : 'Refresh Data'}
        </button>
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center h-64 gap-4">
           <RefreshCcw className="w-8 h-8 animate-spin text-slate-400" />
           <p className="text-muted-foreground text-sm">Loading analytics...</p>
         </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <Card key={i} className="border-slate-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-600">{kpi.label}</CardTitle>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                    <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leaderboard Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Most Wished Products
                    </CardTitle>
                    <CardDescription>Top products saved by users</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">LIVE</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Hearts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedByWishlist.slice(0, 8).map((p, idx) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-slate-500">{idx + 1}</TableCell>
                        <TableCell className="font-medium text-slate-900">{p.name}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{p.category || '—'}</TableCell>
                        <TableCell className="text-right font-semibold text-slate-700">
                          {p.wishlistCount > 0 ? (
                            <span className="flex items-center justify-end gap-1 text-red-500">
                              <Heart className="w-3 h-3 fill-current" /> {p.wishlistCount}
                            </span>
                          ) : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Wishlist Distribution
                </CardTitle>
                <CardDescription>Visual breakdown of top 7 saved products</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-4">
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltipContent />} />
                        <Bar dataKey="wishlistCount" fill="var(--color-wishlistCount)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">No data available to display chart.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Carts Panel */}
          <Card className="shadow-sm border-red-100">
            <CardHeader className="bg-red-50/50 rounded-t-xl border-b border-red-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <ShoppingCart className="w-5 h-5" />
                    Active Carts
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 ml-2">REAL-TIME</Badge>
                  </CardTitle>
                  <CardDescription className="text-red-600/80 mt-1">
                    Users with unpurchased items in their cart right now.
                  </CardDescription>
                </div>
                <div className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
                  {cartUsers.length} active cart{cartUsers.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cartUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No logged-in users have items in their cart right now.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-6 w-12">#</TableHead>
                      <TableHead>User Details</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="pr-6">Contents</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartUsers.map((cu, idx) => (
                      <TableRow key={cu.uid} className="hover:bg-slate-50/50">
                        <TableCell className="pl-6 font-medium text-slate-400">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900">
                            {cu.name || cu.googleName || <span className="text-slate-400 font-normal italic">Unknown</span>}
                          </div>
                          {cu.googleName && !cu.name && (
                            <div className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">via Google</div>
                          )}
                          <div className="text-xs text-slate-400 font-mono mt-1">{cu.uid.slice(0, 14)}...</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {cu.email ? (
                              <a href={`mailto:${cu.email}`} className="text-blue-600 text-sm font-medium hover:underline block">
                                {cu.email}
                              </a>
                            ) : (
                              <span className="text-red-500 text-xs font-semibold block">Missing Email</span>
                            )}
                            
                            {(() => {
                              const lead = popupLeadByUid.get(cu.uid);
                              const popupPhone = lead?.phone;
                              const profilePhone = cu.phone;
                              if (popupPhone) return (
                                <div className="flex items-center gap-2">
                                  <a href={`tel:+91${popupPhone}`} className="text-slate-700 text-sm font-medium hover:underline block">
                                    +91 {popupPhone}
                                  </a>
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5 py-0">Lead</Badge>
                                </div>
                              );
                              if (profilePhone) return <span className="text-slate-700 text-sm font-medium block">{profilePhone}</span>;
                              return null;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{cu.cartItemCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          ₹{cu.cartTotal.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex flex-col gap-1">
                            {cu.cart.slice(0, 3).map((item, i) => (
                              <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                <span className="font-medium truncate max-w-[120px]" title={item.name}>{item.name}</span>
                                <span className="text-slate-400">({item.size}ml)</span>
                                <span className="text-slate-400 ml-1">×{item.quantity}</span>
                              </div>
                            ))}
                            {cu.cart.length > 3 && (
                              <div className="text-[10px] text-slate-400 font-medium mt-1">+{cu.cart.length - 3} more items</div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Free Attar Leads Panel */}
          <Card className="shadow-sm border-amber-100">
            <CardHeader className="bg-amber-50/30 rounded-t-xl border-b border-amber-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                    <Gift className="w-5 h-5" />
                    Free 2ml Attar Leads
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 ml-2">PROMO</Badge>
                  </CardTitle>
                  <CardDescription className="text-amber-600/80 mt-1">
                    Users who submitted the popup form.
                  </CardDescription>
                </div>
                <div className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {popupLeads.length} leads
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {popupLeads.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No popup leads yet.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-6 w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Offer</TableHead>
                      <TableHead className="text-right pr-6">Claimed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popupLeads.map((lead, idx) => {
                      let claimedDate = '—';
                      if (lead.claimedAt) {
                        if (lead.claimedAt.toDate) {
                          claimedDate = lead.claimedAt.toDate().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        } else if (lead.claimedAt.seconds) {
                          claimedDate = new Date(lead.claimedAt.seconds * 1000).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        }
                      }
                      return (
                        <TableRow key={lead.id} className="hover:bg-slate-50/50">
                          <TableCell className="pl-6 font-medium text-slate-400">{idx + 1}</TableCell>
                          <TableCell className="font-semibold text-slate-900">{lead.name || '—'}</TableCell>
                          <TableCell>
                            {lead.phone ? (
                              <a href={`tel:+91${lead.phone}`} className="text-slate-700 font-medium hover:underline text-sm">
                                +91 {lead.phone}
                              </a>
                            ) : <span className="text-slate-400 italic text-sm">—</span>}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 max-w-[200px] truncate" title={lead.address}>
                            {lead.address || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">{lead.offer || '2ml Free Attar'}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500 pr-6">
                            {claimedDate}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* User Engagement Breakdown */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                User Engagement Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { v: totalUsers, l: 'Total Accounts' },
                  { v: usersWithWishlist, l: 'Active Wishlists' },
                  { v: totalUsers - usersWithWishlist, l: 'No Wishlist Yet' },
                  { v: `${wishlistRate}%`, l: 'Wishlist Rate' },
                  { v: avgWishlistPerUser, l: 'Avg Per User' },
                  { v: cartUsers.length, l: 'Active Carts Now' },
                ].map((e, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-center text-center justify-center">
                    <div className="text-2xl font-bold text-slate-900">{e.v}</div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">{e.l}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Recommended Analytics Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((s, i) => {
                const SIcon = s.icon;
                return (
                  <Card key={i} className="shadow-none border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                          <SIcon className="w-5 h-5 text-slate-700" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">{s.title}</CardTitle>
                          <Badge variant={s.variant} className="mt-1.5 text-[9px] px-1.5 py-0">{s.tag}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
