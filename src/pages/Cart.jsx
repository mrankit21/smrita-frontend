import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ComboBanner from '../components/ComboBanner';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem, actualTotal, regularTotal, savings, hasCombo, combos, totalQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="text-7xl mb-6 animate-float">🛒</div>
        <h2 className="font-serif text-3xl text-yellow-600/50 mb-3">Your cart is empty</h2>
        <p className="font-body text-sm text-yellow-800/50 mb-8 max-w-sm">
          Add some sacred fragrances to your cart. Remember — pick 3 for ₹250!
        </p>
        <Link to="/products" className="btn-gold inline-flex items-center gap-2">
          <ShoppingBag size={14} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Your Selection</p>
          <h1 className="section-title">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <ComboBanner />

            {items.map(item => (
              <div key={item.id} className="glass-card gold-border p-4 md:p-5 flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden bg-black/40 border border-yellow-600/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-2xl">🪔</div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg text-yellow-300 leading-tight">{item.name}</h3>
                      <p className="font-body text-xs text-yellow-700/50 tracking-wide">{item.category}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast('Item removed from cart', { icon: '✕' });
                      }}
                      className="text-red-500/40 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center border border-yellow-700/30">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-yellow-600 hover:text-yellow-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-body text-sm text-yellow-300">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-yellow-600 hover:text-yellow-400 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl text-yellow-400">₹{item.price * item.quantity}</p>
                      <p className="font-body text-[10px] text-yellow-800/50">₹{item.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-2 font-body text-xs text-yellow-700/50 hover:text-yellow-500 transition-colors tracking-widest uppercase mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="glass-card gold-border p-6">
              <h2 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-yellow-700/60">Subtotal ({totalQuantity} items)</span>
                  <span className="text-yellow-400">₹{regularTotal}</span>
                </div>

                {hasCombo && (
                  <div className="flex justify-between text-green-400/80">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} /> Combo Discount ({combos}×)
                    </span>
                    <span>–₹{savings}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-yellow-700/60">Shipping</span>
                  <span className="text-green-400/70 text-xs">FREE</span>
                </div>
              </div>

              <div className="border-t border-yellow-600/20 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-sm text-yellow-600 tracking-widest uppercase">Total</span>
                  <div className="text-right">
                    <span className="font-serif text-3xl text-yellow-400">₹{actualTotal}</span>
                    {savings > 0 && (
                      <p className="font-body text-xs text-green-400/70 mt-1">You save ₹{savings}!</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>
            </div>

            {/* Combo info */}
            {!hasCombo && totalQuantity < 3 && (
              <div className="border border-yellow-700/20 bg-yellow-900/5 p-4">
                <p className="font-body text-xs text-yellow-700/60 leading-relaxed">
                  <strong className="text-yellow-600">Add {3 - totalQuantity} more item{3 - totalQuantity > 1 ? 's' : ''}</strong> to unlock the 3-for-₹250 combo deal and save ₹50!
                </p>
                <Link to="/products" className="font-body text-xs text-yellow-500 hover:text-yellow-400 mt-2 inline-block transition-colors">
                  Browse more →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
