import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-yellow-600/20 mt-20">
      {/* Gold top line */}
      <div className="h-px gold-gradient" />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl gold-shimmer-text tracking-[0.2em] mb-1">SMRITA</h2>
            <p className="font-body text-xs tracking-[0.4em] text-yellow-600/50 uppercase mb-5">Made with Devotion</p>
            <p className="font-body text-yellow-200/40 text-sm leading-relaxed max-w-sm">
              Every incense stick we craft is a prayer in itself — made with pure ingredients, ancient recipes, and the unwavering devotion of our artisans. We bring the sacred into your home.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-9 h-9 gold-border rounded-full flex items-center justify-center text-yellow-600/60 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 gold-border rounded-full flex items-center justify-center text-yellow-600/60 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 gold-border rounded-full flex items-center justify-center text-yellow-600/60 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Navigate</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Shop All' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/cart', label: 'Cart' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-yellow-200/40 hover:text-yellow-400 transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="tel:+918970202304"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 gold-border rounded-full flex items-center justify-center text-yellow-600/60 group-hover:text-yellow-400 group-hover:border-yellow-400 transition-colors shrink-0">
                  <Phone size={14} />
                </div>
                <span className="font-body text-sm text-yellow-200/40 group-hover:text-yellow-400 transition-colors">
                  +91 89702 02304
                </span>
              </a>
              <a
                href="mailto:smritasacred@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 gold-border rounded-full flex items-center justify-center text-yellow-600/60 group-hover:text-yellow-400 group-hover:border-yellow-400 transition-colors shrink-0">
                  <Mail size={14} />
                </div>
                <span className="font-body text-sm text-yellow-200/40 group-hover:text-yellow-400 transition-colors break-all">
                  smritasacred@gmail.com
                </span>
              </a>
            </div>

            {/* Combo reminder */}
            <div className="mt-6 p-3 border border-yellow-600/20 bg-yellow-600/5">
              <p className="font-body text-xs text-yellow-500/70 leading-relaxed">
                🔥 <strong>Combo Offer:</strong> Pick any 3 for just ₹250
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-yellow-600/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-yellow-900/40 tracking-widest">
            © 2025 SMRITA. All rights reserved.
          </p>
          <p className="font-body text-xs text-yellow-900/40 flex items-center gap-1">
            Crafted with <Heart size={10} className="text-yellow-700 fill-yellow-700" /> and Devotion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
