// ================================================================
// File: smrita/src/pages/Wishlist.jsx
// UPDATED: Works with real backend wishlist (products have _id)
// ================================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Loader } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { items, toggleItem, loading } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Heart size={60} className="text-yellow-800/30 mb-6" />
        <h2 className="font-serif text-3xl text-yellow-600/50 mb-3">Sign in to view wishlist</h2>
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

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Heart size={60} className="text-yellow-800/30 mb-6" />
        <h2 className="font-serif text-3xl text-yellow-600/50 mb-3">Your wishlist is empty</h2>
        <p className="font-body text-sm text-yellow-800/50 mb-8">Save your favourite fragrances here for later.</p>
        <Link to="/products" className="btn-gold">Explore Fragrances</Link>
      </div>
    );
  }

  const handleMoveToCart = async (product) => {
    addItem(product);
    try {
      await toggleItem(product); // removes from wishlist
      toast.success(`${product.name} moved to cart`);
    } catch {
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleRemove = async (product) => {
    try {
      await toggleItem(product);
      toast('Removed from wishlist', { icon: '✕' });
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Saved for Later</p>
          <h1 className="section-title">My Wishlist</h1>
          <p className="font-body text-xs text-yellow-700/40 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(product => {
            const productId = product._id || product.id;
            const imageUrl = product.image?.startsWith('http')
              ? product.image
              : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`;

            return (
              <div key={productId} className="glass-card gold-border overflow-hidden group">
                <Link to={`/products/${productId}`} className="block">
                  <div className="h-48 overflow-hidden bg-black/40">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-4xl">🪔</div>
                  </div>
                  <div className="p-4">
                    <p className="font-body text-[10px] tracking-[0.2em] text-yellow-700/50 uppercase mb-1">{product.category}</p>
                    <h3 className="font-serif text-lg text-yellow-300 mb-1">{product.name}</h3>
                    <p className="font-serif text-xl text-yellow-400 mb-4">₹{product.price}</p>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 btn-gold flex items-center justify-center gap-2 py-2 text-xs"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product)}
                    className="w-10 h-10 flex items-center justify-center border border-red-500/30 text-red-400/60 hover:text-red-400 hover:border-red-400/50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
