// ================================================================
// File: smrita/src/pages/Products.jsx
// UPDATED: Fetches products from backend API (not hardcoded data)
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Loader } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Sandalwood', 'Floral', 'Classic', 'Luxury', 'Herbal', 'Resin', 'Vedic'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchProducts = useCallback(async (searchVal, categoryVal, sortVal) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchVal) params.search = searchVal;
      if (categoryVal && categoryVal !== 'All') params.category = categoryVal;
      if (sortVal && sortVal !== 'default') params.sort = sortVal;

      const { data } = await productAPI.getAll(params);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts('', 'All', 'default');
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      fetchProducts(search, category, sortBy);
    }, 400);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [search, category, sortBy]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Sacred Collection</p>
          <h1 className="section-title">All Fragrances</h1>
          <p className="font-body text-yellow-200/30 text-sm mt-4 max-w-lg mx-auto">
            Each incense stick — ₹100 · Pick any 3 for ₹250 and save ₹50
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-700/40" />
            <span className="text-yellow-700/40">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-700/40" />
          </div>
        </div>

        {/* Combo reminder */}
        <div className="border border-yellow-600/30 bg-yellow-900/5 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="font-body text-sm text-yellow-400 font-bold">Combo Deal Active</p>
              <p className="font-body text-xs text-yellow-700/60">Any 3 products = ₹250 · Save ₹50 automatically</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-body text-[10px] text-yellow-700/40 uppercase tracking-wider">Single</p>
              <p className="font-serif text-lg text-yellow-600">₹100</p>
            </div>
            <div>
              <p className="font-body text-[10px] text-yellow-500/60 uppercase tracking-wider">Combo</p>
              <p className="font-serif text-lg text-yellow-400">₹250/3</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-700" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, category, or scent..."
              className="input-gold pl-10 pr-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-700 hover:text-yellow-400">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-gold md:w-48 cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">A–Z</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline-gold flex items-center gap-2 md:w-auto"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200 ${
                  category === cat
                    ? 'gold-gradient text-black border-transparent'
                    : 'border-yellow-700/40 text-yellow-600 hover:border-yellow-500 hover:text-yellow-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader size={32} className="text-yellow-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24">
            <p className="font-body text-red-400 mb-4">{error}</p>
            <button onClick={() => fetchProducts(search, category, sortBy)} className="btn-outline-gold">
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <p className="font-body text-xs text-yellow-700/50 tracking-widest uppercase mb-6">
              {products.length} fragrance{products.length !== 1 ? 's' : ''} found
            </p>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🪔</div>
                <p className="font-serif text-2xl text-yellow-600/50 mb-2">No fragrances found</p>
                <p className="font-body text-sm text-yellow-800/50">Try a different search term or category</p>
                <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline-gold mt-6">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
