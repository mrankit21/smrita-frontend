// ================================================================
// File: smrita/src/pages/Orders.jsx
// UPDATED: Fetches real orders from backend API
// ================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, XCircle, Truck, Loader, RotateCcw } from 'lucide-react';
import { orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Status badge config
const STATUS_CONFIG = {
  Pending:    { color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',  icon: <Clock size={11} /> },
  Confirmed:  { color: 'text-blue-400 border-blue-500/30 bg-blue-500/5',        icon: <CheckCircle size={11} /> },
  Processing: { color: 'text-purple-400 border-purple-500/30 bg-purple-500/5',  icon: <RotateCcw size={11} /> },
  Shipped:    { color: 'text-orange-400 border-orange-500/30 bg-orange-500/5',  icon: <Truck size={11} /> },
  Delivered:  { color: 'text-green-400 border-green-500/30 bg-green-500/5',     icon: <CheckCircle size={11} /> },
  Cancelled:  { color: 'text-red-400 border-red-500/30 bg-red-500/5',           icon: <XCircle size={11} /> },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMyOrders();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(orderId);
      const { data } = await orderAPI.cancel(orderId);
      if (data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot cancel this order';
      toast.error(msg);
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Package size={60} className="text-yellow-800/30 mb-6" />
        <h2 className="font-serif text-3xl text-yellow-600/50 mb-3">Sign in to view orders</h2>
        <Link to="/login" className="btn-gold mt-4">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <Loader size={36} className="text-yellow-600 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Package size={60} className="text-yellow-800/30 mb-6" />
        <h2 className="font-serif text-3xl text-yellow-600/50 mb-3">No orders yet</h2>
        <p className="font-body text-sm text-yellow-800/50 mb-8">Your order history will appear here.</p>
        <Link to="/products" className="btn-gold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Your Journey</p>
          <h1 className="section-title">My Orders</h1>
          <p className="font-body text-xs text-yellow-700/40 mt-2">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div className="space-y-6">
          {orders.map(order => {
            const statusConf = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

            return (
              <div key={order._id} className="glass-card gold-border p-6">
                {/* Order header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="font-body text-xs tracking-[0.2em] text-yellow-700/50 uppercase mb-1">Order ID</p>
                    <p className="font-body text-sm text-yellow-400 font-bold">{order.orderId || `SMR-${order._id.slice(-8).toUpperCase()}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs tracking-[0.2em] text-yellow-700/50 uppercase mb-1">Date</p>
                    <p className="font-body text-sm text-yellow-300/70">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className={`flex items-center gap-1.5 border font-body text-xs px-3 py-1.5 tracking-widest uppercase ${statusConf.color}`}>
                      {statusConf.icon} {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking ID */}
                {order.trackingId && (
                  <div className="mb-4 border border-yellow-700/20 bg-yellow-900/5 px-4 py-2">
                    <p className="font-body text-xs text-yellow-600/60">
                      Tracking ID: <span className="text-yellow-400 font-bold">{order.trackingId}</span>
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/40 border border-yellow-600/10 overflow-hidden shrink-0">
                        <img
                          src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-yellow-300/80 truncate">{item.name}</p>
                        <p className="font-body text-[10px] text-yellow-800/50">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-body text-sm text-yellow-500 shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-yellow-600/15 pt-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-body text-[10px] text-yellow-700/40 uppercase tracking-widest">Order Total</p>
                    <p className="font-serif text-2xl text-yellow-400">₹{order.totalAmount}</p>
                    {order.comboDiscount > 0 && (
                      <p className="font-body text-xs text-green-400/60">Saved ₹{order.comboDiscount}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling === order._id}
                        className="font-body text-xs text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                    <div className="flex items-center gap-1 font-body text-xs text-yellow-700/40">
                      <Clock size={12} /> Est. delivery: 3–5 days
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
