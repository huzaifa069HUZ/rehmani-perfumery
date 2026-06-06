'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Package, User, MapPin, Search, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-400">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mb-4"></div>
        <p className="text-sm uppercase tracking-widest font-medium">Loading Orders</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders Management</h1>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Package size={16} className="text-gray-400" />
            Total Orders: {orders.length}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      }) || 'N/A'}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        {order.createdAt?.toDate?.()?.toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          {order.customerInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block text-sm">{order.customerInfo.name}</span>
                          <span className="text-xs text-gray-500 block">{order.customerInfo.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₹{order.finalTotal}</span>
                      <span className="text-xs text-gray-500 block mt-0.5">{order.items.length} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedOrderId === order.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={6} className="px-6 py-6 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Shipping Details */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin size={16} className="text-blue-600" /> Shipping Details
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 space-y-2">
                              <p><strong className="text-gray-900">Name:</strong> {order.customerInfo.name}</p>
                              <p><strong className="text-gray-900">Email:</strong> {order.customerInfo.email}</p>
                              <p><strong className="text-gray-900">Phone:</strong> {order.customerInfo.phone}</p>
                              <div className="h-px bg-gray-100 my-2"></div>
                              <p><strong className="text-gray-900">Address:</strong></p>
                              <p>{order.shippingAddress.house}, {order.shippingAddress.area}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Package size={16} className="text-blue-600" /> Order Items
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-500">Size: {item.size === 1 ? '1 Box' : `${item.size}ml`} | Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 ml-4">
                                      {item.price === 0 ? <span className="text-green-600 text-xs">FREE</span> : `₹${item.price * item.quantity}`}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-500">
                                  <span>Subtotal</span>
                                  <span>₹{order.totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                  <span>Shipping</span>
                                  <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 pt-1 mt-1 border-t border-gray-50">
                                  <span>Total</span>
                                  <span>₹{order.finalTotal}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                          <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                            Mark as Shipped
                          </button>
                          <a href={`https://wa.me/91${order.customerInfo.phone}?text=Hi%20${order.customerInfo.name},%20we%20have%20received%20your%20order%20for%20%E2%82%B9${order.finalTotal}%20at%20Rahmani%20Perfumery.%20Please%20confirm%20your%20order.`} 
                             target="_blank" rel="noreferrer"
                             className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2">
                            Contact on WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Package size={32} className="mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}
