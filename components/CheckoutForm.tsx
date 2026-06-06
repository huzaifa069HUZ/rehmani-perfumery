'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, CreditCard, Wallet, Banknote, ShieldCheck, MapPin, Truck, AlertCircle } from 'lucide-react';
import { MYSTERY_ATTAR_ID } from '@/components/FreeAttarPopup';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutForm() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  // Contact State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Address State
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  
  // Form handling
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  // Handle Pincode API lookup
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    
    if (val.length === 6) {
      setIsLoadingPincode(true);
      setPincodeError('');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District);
          setState(postOffice.State);
        } else {
          setPincodeError('Invalid Pincode. Please check again.');
          setCity('');
          setState('');
        }
      } catch (err) {
        setPincodeError('Failed to fetch details. Enter manually.');
      } finally {
        setIsLoadingPincode(false);
      }
    } else {
      setCity('');
      setState('');
      setPincodeError('');
    }
  };

  const shippingFee = totalPrice > 999 ? 0 : 60;
  const finalTotal = totalPrice + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save order to Firestore
      const orderData = {
        customerInfo: { name, email, phone },
        shippingAddress: { pincode, city, state, house, area },
        items: cart,
        totalPrice,
        shippingFee,
        finalTotal,
        paymentMethod: 'COD',
        status: 'Pending',
        createdAt: serverTimestamp(),
        userId: user?.uid || 'guest'
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("There was an issue placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-2 font-poppins">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 font-poppins">Looks like you haven't added anything yet.</p>
        <Link href="/store" className="bg-[#0f172a] text-white px-8 py-3 rounded-md font-semibold tracking-wide hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
          START SHOPPING
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc] px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2 font-poppins">Order Placed Successfully!</h2>
          <p className="text-slate-600 mb-6 font-poppins leading-relaxed">
            Thank you for your order. 
          </p>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 text-left">
            <div className="flex gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 font-medium">
                SORRY WE ARE CURRENTLY TAKING ORDERS ONLY IN COD FORM.
              </p>
            </div>
            <p className="text-sm text-slate-600 pl-8">
              Our team will contact you on WhatsApp for payment confirmation.
            </p>
          </div>
          <Link href="/store" className="inline-block w-full bg-[#0f172a] text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#f8fafc] font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/cart" className="hover:text-[#0f172a] transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-[#0f172a]">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-[55%] xl:w-[60%] order-2 lg:order-1">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">1</span>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all placeholder-slate-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all placeholder-slate-400"
                        placeholder="First and Last name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all placeholder-slate-400"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">2</span>
                  Delivery Address
                </h3>
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                        Pincode {isLoadingPincode && <span className="text-blue-500 lowercase normal-case animate-pulse">Fetching...</span>}
                      </label>
                      <input 
                        type="text" 
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={handlePincodeChange}
                        className={`w-full bg-slate-50 border ${pincodeError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-900 focus:ring-blue-900/20'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all placeholder-slate-400`}
                        placeholder="6-digit PIN"
                      />
                      {pincodeError && <p className="text-xs text-red-500 mt-1">{pincodeError}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">City / District</label>
                      <input 
                        type="text" 
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-slate-700"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">State</label>
                      <input 
                        type="text" 
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-slate-700"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">House / Flat / Office No.</label>
                    <input 
                      type="text" 
                      required
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all placeholder-slate-400"
                      placeholder="e.g. Flat 101, Blue Pearl Apartments"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Road Name / Area / Colony</label>
                    <input 
                      type="text" 
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all placeholder-slate-400"
                      placeholder="e.g. MG Road, near City Center"
                    />
                  </div>

                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">3</span>
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  {/* Online / UPI - Disabled */}
                  <div className="relative border border-slate-200 rounded-xl p-4 flex items-center justify-between opacity-50 bg-slate-50 cursor-not-allowed grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">UPI / Online Wallet</p>
                        <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                  </div>

                  {/* Card - Disabled */}
                  <div className="relative border border-slate-200 rounded-xl p-4 flex items-center justify-between opacity-50 bg-slate-50 cursor-not-allowed grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">Credit / Debit Card</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                  </div>

                  {/* Net Banking - Disabled */}
                  <div className="relative border border-slate-200 rounded-xl p-4 flex items-center justify-between opacity-50 bg-slate-50 cursor-not-allowed grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">Net Banking</p>
                        <p className="text-xs text-slate-500">All major Indian banks</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                  </div>

                  {/* COD - Enabled */}
                  <label className="relative border-2 border-blue-900 bg-blue-50/30 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0f172a]">Cash on Delivery (COD)</p>
                        <p className="text-xs text-slate-500">Pay when your order arrives</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-[6px] border-blue-900 bg-white"></div>
                  </label>
                </div>
                
                <div className="mt-6 flex gap-2 items-start text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p>Your privacy is important to us. We will only contact you regarding your order status and shipping updates.</p>
                </div>
              </div>

              {/* Mobile Submit Button (Visible only on mobile, sticky bottom) */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f172a] text-white py-3.5 rounded-lg font-semibold tracking-wide shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    `PLACE ORDER • ₹${finalTotal}`
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[45%] xl:w-[40%] order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-[#0f172a] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-semibold text-[#0f172a] line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.size === 1 ? '1 Box' : `${item.size}ml`}</p>
                    </div>
                    <div className="text-right font-semibold text-sm text-[#0f172a]">
                      {item.id === MYSTERY_ATTAR_ID ? (
                        <span className="text-green-600 uppercase text-xs tracking-wider">Free Gift</span>
                      ) : (
                        `₹${item.price * item.quantity}`
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0f172a]">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#0f172a]">₹{shippingFee}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-5 pt-5 flex justify-between items-center">
                <span className="text-base font-bold text-[#0f172a]">Total</span>
                <span className="text-xl font-bold text-[#0f172a]">₹{finalTotal}</span>
              </div>

              {/* Desktop Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="hidden lg:flex w-full mt-8 bg-[#0f172a] text-white py-4 rounded-xl font-semibold tracking-wide hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'COMPLETE ORDER'
                )}
              </button>
              
              <div className="mt-6 flex justify-center text-slate-400">
                 <ShieldCheck className="w-5 h-5 mr-1.5" />
                 <span className="text-xs font-medium">Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>

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
