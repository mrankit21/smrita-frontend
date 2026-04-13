import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Flame, Leaf, Shield } from 'lucide-react';
import { PRODUCTS } from '../utils/products';
import ProductCard from '../components/ProductCard';

// Decorative SVG mandala
const Mandala = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" stroke="#b8860b" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="70" stroke="#b8860b" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="50" stroke="#b8860b" strokeWidth="0.5" />
    <circle cx="100" cy="100" r="30" stroke="#b8860b" strokeWidth="0.5" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 100 100)`}>
        <line x1="100" y1="10" x2="100" y2="30" stroke="#b8860b" strokeWidth="0.5" />
        <circle cx="100" cy="20" r="2" fill="#b8860b" />
        <line x1="100" y1="170" x2="100" y2="190" stroke="#b8860b" strokeWidth="0.5" />
      </g>
    ))}
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 100 100)`}>
        <ellipse cx="100" cy="55" rx="8" ry="20" stroke="#b8860b" strokeWidth="0.3" fill="none" />
      </g>
    ))}
  </svg>
);

const Home = () => {
  const [visible, setVisible] = useState(false);
  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 3);
  const popularProducts = PRODUCTS.slice(0, 6);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: <Leaf size={20} />, title: '100% Natural', desc: 'No synthetic chemicals, only pure herbs and resins.' },
    { icon: <Flame size={20} />, title: 'Hand-Rolled', desc: 'Every stick crafted by skilled artisans with devotion.' },
    { icon: <Shield size={20} />, title: 'Ancient Recipes', desc: 'Formulas preserved and passed down for generations.' },
    { icon: <Star size={20} />, title: 'Temple Grade', desc: 'The same quality used in sacred temples across India.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0800] to-[#0a0a0a]" />

        {/* Mandala decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] mandala-rotate pointer-events-none">
          <Mandala />
        </div>

        {/* Smoke particles */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-20 rounded-full"
              style={{
                background: 'linear-gradient(to top, rgba(180,130,0,0.3), transparent)',
                animation: `smoke ${2.5 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,130,0,0.08) 0%, transparent 70%)' }}
        />

        {/* Hero content */}
        <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-body text-xs tracking-[0.5em] text-yellow-700 uppercase mb-6 animate-fade-in">
            ✦ Sacred Fragrances of India ✦
          </p>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-none mb-4">
            <span className="gold-shimmer-text">SMRITA</span>
          </h1>

          <p className="font-sans text-xl md:text-2xl text-yellow-200/50 italic tracking-[0.15em] mb-4">
            Made with Devotion
          </p>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-700/50" />
            <span className="text-yellow-700/60 text-xs tracking-widest font-body uppercase">Pure · Natural · Sacred</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-700/50" />
          </div>

          <p className="font-body text-yellow-200/40 max-w-lg mx-auto leading-relaxed mb-12 text-sm md:text-base">
            Hand-rolled incense sticks crafted from ancient Vedic recipes. Each breath of smoke carries a prayer, each fragrance a blessing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
              Explore Collection <ArrowRight size={14} />
            </Link>
            <Link to="/products" className="btn-outline-gold inline-flex items-center gap-2">
              View Combo Offer
            </Link>
          </div>

          {/* Combo highlight */}
          <div className="mt-10 inline-block border border-yellow-700/30 bg-yellow-900/10 px-6 py-3">
            <p className="font-body text-xs text-yellow-600/80 tracking-widest">
              🔥 COMBO DEAL · Any 3 Products for ₹250 · Save ₹50
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-yellow-600/50 to-transparent" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 border-y border-yellow-600/10">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 gold-border rounded-full flex items-center justify-center text-yellow-600 group-hover:text-yellow-400 group-hover:border-yellow-400 transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-body text-sm font-bold tracking-widest text-yellow-400 uppercase mb-2">{f.title}</h3>
              <p className="font-body text-xs text-yellow-200/30 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMBO OFFER BANNER ─── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(180,130,0,0.06) 0%, transparent 70%)' }} />
        <div className="container-custom relative z-10">
          <div className="border border-yellow-600/30 bg-gradient-to-r from-yellow-900/10 via-yellow-800/5 to-yellow-900/10 p-8 md:p-12 text-center">
            <p className="font-body text-xs tracking-[0.4em] text-yellow-700 uppercase mb-4">Exclusive Offer</p>
            <h2 className="font-serif text-4xl md:text-6xl gold-shimmer-text mb-4">
              3 for ₹250
            </h2>
            <p className="font-sans text-lg text-yellow-200/50 italic mb-2">
              Pick any 3 incense sticks and save ₹50
            </p>
            <p className="font-body text-xs text-yellow-700/60 mb-8">
              Mix and match freely · Discount applied automatically at checkout
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8">
              {[
                { label: 'Individual Price', value: '₹100 each' },
                { label: 'Combo Price', value: '₹250 for 3' },
                { label: 'Your Savings', value: '₹50 per combo' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="font-body text-[10px] tracking-[0.3em] text-yellow-700/60 uppercase mb-1">{item.label}</p>
                  <p className="font-serif text-2xl text-yellow-400">{item.value}</p>
                </div>
              ))}
            </div>
            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
              Build Your Combo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="section-subtitle mb-3">Our Sacred Selection</p>
            <h2 className="section-title">Featured Fragrances</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-700/50" />
              <span className="text-yellow-700/40 text-lg">✦</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-700/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY SECTION ─── */}
      <section className="py-20 border-y border-yellow-600/10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle mb-3">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl text-yellow-400 mb-6 leading-tight">
                A Prayer Rolled<br />
                <span className="italic text-yellow-300/70">Into Every Stick</span>
              </h2>
              <p className="font-body text-yellow-200/40 leading-relaxed mb-4 text-sm">
                SMRITA was born from a simple belief — that the ancient art of incense-making is not just a craft, but a form of devotion. Our founders, deeply rooted in India's spiritual traditions, set out to preserve the authentic recipes that have been used in temples, homes, and meditation spaces for thousands of years.
              </p>
              <p className="font-body text-yellow-200/40 leading-relaxed mb-8 text-sm">
                Every ingredient is sourced with intention. Every stick is rolled by hand. Every fragrance carries a blessing.
              </p>
              <Link to="/products" className="btn-outline-gold inline-flex items-center gap-2">
                Discover Our Story <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 border border-yellow-600/20" />
              <div className="absolute inset-4 border border-yellow-600/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-4 animate-float">🪔</div>
                  <p className="font-serif text-2xl gold-text">Smrita</p>
                  <p className="font-body text-xs tracking-[0.3em] text-yellow-700/50 uppercase mt-2">Sanskrit · To Remember</p>
                </div>
              </div>
              {/* Corner ornaments */}
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 border-yellow-600/40 ${i < 2 ? 'border-t' : 'border-b'} ${i % 2 === 0 ? 'border-l' : 'border-r'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALL PRODUCTS PREVIEW ─── */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="section-subtitle mb-3">Complete Collection</p>
            <h2 className="section-title">All Fragrances</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 border-t border-yellow-600/10">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="section-subtitle mb-3">Devotees Speak</p>
            <h2 className="section-title">Sacred Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', location: 'Delhi', review: 'The Nagchampa is absolutely divine. My meditation room smells like a temple now. Will never go back to any other brand.', rating: 5 },
              { name: 'Ravi Kumar', location: 'Bangalore', review: 'Ordered the combo pack and received 3 different scents. Each one is better than the last. The Chandan is heavenly.', rating: 5 },
              { name: 'Meera Nair', location: 'Kerala', review: 'As someone who does daily puja, these agarbattis have transformed my practice. The fragrance lingers for hours.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="glass-card gold-border p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={12} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="font-sans text-yellow-200/60 italic leading-relaxed mb-6 text-sm">
                  "{t.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-yellow-400">{t.name}</p>
                    <p className="font-body text-[10px] text-yellow-700/50">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
