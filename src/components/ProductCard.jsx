// ================================================================
// File: smrita/src/components/ProductCard.jsx
// UPDATED: Works with both backend _id (MongoDB) and legacy id
// ================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  // Support both _id (backend) and id (legacy)
  const productId = product._id || product.id;
  const inCart = isInCart(productId);
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }
    try {
      const added = await toggleItem(product);
      toast(added ? 'Added to wishlist' : 'Removed from wishlist', { icon: added ? '♡' : '✕' });
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  // Build image URL — handle both external URLs and backend-served paths
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`
    : null;

  return (
    <Link to={`/products/${productId}`} className="group block">
      <div className="glass-card gold-border overflow-hidden transition-all duration-300 hover:border-yellow-500/40">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-black/40">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle at center, ${product.color || '#b8860b'}20, #0a0a0a)` }}
            >
              <span className="text-5xl">🪔</span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${
              inWishlist
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                : 'bg-black/50 border-yellow-700/30 text-yellow-700 hover:text-yellow-400 hover:border-yellow-400/50'
            }`}
          >
            <Heart size={13} className={inWishlist ? 'fill-yellow-400' : ''} />
          </button>

          {/* Tags */}
          {product.tags?.includes('bestseller') && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
              Bestseller
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-body text-sm text-yellow-700/70 tracking-widest uppercase">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5">
          <p className="font-body text-[10px] tracking-[0.25em] text-yellow-700/50 uppercase mb-1">{product.category}</p>
          <h3 className="font-serif text-xl text-yellow-300 mb-0.5 leading-tight">{product.name}</h3>
          <p className="font-sans text-xs text-yellow-200/30 italic mb-3">{product.subtitle}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-900'} />
              ))}
            </div>
            <span className="font-body text-[10px] text-yellow-700/50">
              {product.rating?.toFixed(1) || '—'} ({product.numReviews || product.reviews || 0})
            </span>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl gold-text">₹{product.price}</span>
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className={`flex items-center gap-1.5 font-body text-xs tracking-wider px-3 py-2 border transition-all duration-200 disabled:opacity-50 ${
                inCart
                  ? 'border-yellow-500/50 bg-yellow-900/20 text-yellow-400'
                  : 'border-yellow-700/40 text-yellow-600 hover:border-yellow-500 hover:text-yellow-400 hover:bg-yellow-900/10'
              }`}
            >
              <ShoppingCart size={12} />
              {inCart ? 'In Cart' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
