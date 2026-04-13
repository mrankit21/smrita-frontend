// ================================================================
// File: smrita/src/pages/OrderSuccess.jsx
// UPDATED: Works with real backend order object structure
// ================================================================

import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) navigate('/');
  }, [order, navigate]);

  if (!order) return null;

  // Backend order uses totalAmount, orderId (virtual), createdAt, items
  const orderId = order.orderId || `SMR-${order._id?.slice(-8).toUpperCase()}`;
  const total = order.totalAmount;

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-yellow-500/30 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
              <CheckCircle size={32} className="text-black" />
            </div>
            <div className="absolute inset-0 rounded-full border border-yellow-500/20 animate-ping" />
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-yellow-400 mb-3">Order Placed!</h1>
        <p className="font-sans text-lg text-yellow-200/50 italic mb-2">Your sacred fragrances are on their way</p>
        <p className="font-body text-sm text-yellow-700/50 mb-8">
          A confirmation email has been sent to your inbox.
        </p>

        {/* Order card */}
        <div className="glass-card gold-border p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-body text-[10px] tracking-[0.2em] text-yellow-700/40 uppercase mb-0.5">Order ID</p>
              <p className="font-body text-sm font-bold text-yellow-400">{orderId}</p>
            </div>
            <div className="flex items-center gap-1 text-green-400 font-body text-xs border border-green-500/30 px-3 py-1.5">
              <Package size={12} /> Confirmed
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between font-body text-sm">
                <span className="text-yellow-300/60 truncate">{item.name} ×{item.quantity}</span>
                <span className="text-yellow-500 shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {order.comboDiscount > 0 && (
            <div className="flex justify-between font-body text-sm text-green-400/70 mb-2">
              <span>Combo Discount</span>
              <span>–₹{order.comboDiscount}</span>
            </div>
          )}

          <div className="border-t border-yellow-600/20 pt-4 flex justify-between">
            <span className="font-body text-sm text-yellow-700/60 uppercase tracking-widest">Total Paid</span>
            <span className="font-serif text-2xl text-yellow-400">₹{total}</span>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="border-t border-yellow-600/10 pt-4 mt-4">
              <p className="font-body text-[10px] tracking-[0.2em] text-yellow-700/40 uppercase mb-1">Shipping To</p>
              <p className="font-body text-xs text-yellow-300/60">
                {order.shippingAddress.name} · {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="btn-gold inline-flex items-center justify-center gap-2">
            <Package size={14} /> View My Orders
          </Link>
          <Link to="/products" className="btn-outline-gold inline-flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>

        {/* Spiritual note */}
        <div className="mt-10 border border-yellow-800/20 bg-yellow-900/5 p-5">
          <p className="text-2xl mb-2">🪔</p>
          <p className="font-sans text-yellow-200/30 italic text-sm leading-relaxed">
            "May these sacred fragrances fill your home with peace, your heart with devotion, and your life with blessings."
          </p>
          <p className="font-body text-xs text-yellow-800/40 mt-2 tracking-widest">— SMRITA</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
