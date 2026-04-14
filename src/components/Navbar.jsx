import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-yellow-600/20 shadow-2xl shadow-black/50'
          : 'bg-transparent'
      }`}>
        {/* Top gold line */}
        <div className="h-0.5 gold-gradient" />

        <div className="container-custom flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-xl md:text-2xl gold-shimmer-text tracking-[0.15em] leading-none">
              SMRITA
            </span>
            <span className="font-body text-[9px] tracking-[0.3em] text-yellow-600/60 uppercase mt-0.5">
              Made with Devotion
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'text-yellow-400' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart
                size={20}
                className={`transition-colors duration-300 ${
                  wishlistItems.length > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-200/50 group-hover:text-yellow-400'
                }`}
              />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart
                size={20}
                className="text-yellow-200/50 group-hover:text-yellow-400 transition-colors duration-300"
              />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 gold-gradient text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 glass-card gold-border shadow-2xl shadow-black/50 z-50">
                      <div className="px-4 py-3 border-b border-yellow-600/20">
                        <p className="text-yellow-400 font-body text-sm truncate">{user.name}</p>
                        <p className="text-yellow-900/60 font-body text-xs truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-yellow-200/70 hover:text-yellow-400 hover:bg-yellow-600/5 transition-colors font-body text-sm">
                        <Package size={14} /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-600/5 transition-colors font-body text-sm">
                          <Settings size={14} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-600/5 transition-colors font-body text-sm"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="group">
                  <User size={20} className="text-yellow-200/50 group-hover:text-yellow-400 transition-colors duration-300" />
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-yellow-200/70 hover:text-yellow-400 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/98 border-t border-yellow-600/20 px-6 py-6 flex flex-col gap-5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link text-base py-1"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link text-base py-1 text-yellow-400">
                Admin Panel
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login" className="nav-link text-base py-1">Login</Link>
                <Link to="/signup" className="nav-link text-base py-1">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
