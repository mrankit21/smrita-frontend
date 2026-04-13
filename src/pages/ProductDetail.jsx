// ================================================================
// File: smrita/src/pages/ProductDetail.jsx
// UPDATED: Fetches single product from backend API
// NOTE: product._id is now used (MongoDB ObjectId) instead of product.id
// ================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowLeft, Clock, Package, Flame, ChevronRight, Loader } from 'lucide-react';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await productAPI.getOne(id);
        if (data.success) {
          setProduct(data.product);
          // Fetch related products (same category)
          const relRes = await productAPI.getAll({ category: data.product.category });
          if (relRes.data.success) {
            setRelated(relRes.data.products.filter(p => p._id !== data.product._id).slice(0, 3));
          }
        }
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
      <Loader size={36} className="text-yellow-600 animate-spin" />
    </div>
  );

  if (error || !product) return (
    <div className="pt-32 pb-20 text-center min-h-screen">
      <div className="text-5xl mb-4">🪔</div>
      <h2 className="font-serif text-3xl text-yellow-600/50 mb-4">Product not found</h2>
      <Link to="/products" className="btn-outline-gold">Back to Shop</Link>
    </div>
  );

  const inWishlist = isInWishlist(product._id);
  const inCart = isInCart(product._id);
  const cartQty = getItemQuantity(product._id);

  const handleAddToCart = () => {
    setAdding(true);
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty}× ${product.name} added to cart`);
    setTimeout(() => setAdding(false), 600);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
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

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 font-body text-xs text-yellow-700/50">
          <Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-yellow-500 transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-yellow-600/70">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-yellow-900/10 to-black border border-yellow-600/15">
              {product.image && !imgError ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{ background: `radial-gradient(circle at center, ${product.color || '#b8860b'}25, #0a0a0a)` }}
                >
                  <div className="text-8xl mb-4 animate-float">🪔</div>
                  <p className="font-body text-xs text-yellow-600/40 tracking-widest uppercase">{product.category}</p>
                </div>
              )}
            </div>
            {product.tags?.includes('bestseller') && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 tracking-widest uppercase">
                Bestseller
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="font-body text-xs tracking-[0.3em] text-yellow-700 uppercase mb-2">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-yellow-300 leading-tight mb-2">{product.name}</h1>
            <p className="font-sans text-xl text-yellow-200/40 italic mb-5">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-900'} />
                ))}
              </div>
              <span className="font-body text-sm text-yellow-600">{product.rating?.toFixed(1) || '—'}</span>
              <span className="font-body text-xs text-yellow-800">({product.numReviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-yellow-600/15">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-5xl gold-text">₹{product.price}</span>
                <span className="font-body text-sm text-yellow-700/50">per pack of {product.quantity} sticks</span>
              </div>
              <p className="font-body text-xs text-yellow-600/50 mt-2">
                🔥 Pick any 3 for ₹250 — save ₹50 with combo deal
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: <Flame size={14} />, label: 'Scent', value: product.scent },
                { icon: <Clock size={14} />, label: 'Burn Time', value: product.burnTime },
                { icon: <Package size={14} />, label: 'Quantity', value: `${product.quantity} sticks` },
              ].map((item, i) => (
                <div key={i} className="glass-card gold-border p-3 text-center">
                  <div className="text-yellow-600/60 flex justify-center mb-1">{item.icon}</div>
                  <p className="font-body text-[9px] tracking-[0.2em] text-yellow-700/50 uppercase">{item.label}</p>
                  <p className="font-body text-xs text-yellow-300/70 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="font-body text-yellow-200/40 leading-relaxed text-sm mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Stock status */}
            {!product.inStock && (
              <div className="mb-4 border border-red-500/30 bg-red-500/5 px-4 py-2">
                <p className="font-body text-sm text-red-400">Out of Stock</p>
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase">Quantity:</span>
              <div className="flex items-center gold-border">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-yellow-600 hover:text-yellow-400 transition-colors border-r border-yellow-600/30">−</button>
                <span className="w-12 text-center font-body text-yellow-300">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-yellow-600 hover:text-yellow-400 transition-colors border-l border-yellow-600/30">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.inStock}
                className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <ShoppingCart size={15} />
                {inCart ? `Add More (${cartQty} in cart)` : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={!product.inStock} className="btn-outline-gold flex-1 disabled:opacity-70">
                Buy Now
              </button>
            </div>

            <button
              onClick={handleWishlist}
              className={`flex items-center gap-2 font-body text-sm transition-colors ${inWishlist ? 'text-yellow-400' : 'text-yellow-700/50 hover:text-yellow-400'}`}
            >
              <Heart size={14} className={inWishlist ? 'fill-yellow-400' : ''} />
              {inWishlist ? 'In your wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <p className="section-subtitle mb-2">You May Also Like</p>
              <h2 className="font-serif text-3xl text-yellow-400">Related Fragrances</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
