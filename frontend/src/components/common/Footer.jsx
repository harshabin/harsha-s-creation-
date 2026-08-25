import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Truck, RotateCcw, ShieldCheck, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Complimentary Express Shipping</h4>
              <p className="text-xs text-stone-400 mt-0.5">On all domestic orders exceeding ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-brand-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">14-Day Seamless Exchanges</h4>
              <p className="text-xs text-stone-400 mt-0.5">Doorstep pickup & hassle-free size swaps</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Own-Brand Authenticity</h4>
              <p className="text-xs text-stone-400 mt-0.5">Heavyweight custom textiles & ethical tailoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Identity */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-white font-display">
                HARSHA'S <span className="text-brand-500 font-light">CREATION</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-stone-400 font-semibold uppercase">
                Since 2024 • Own Brand Cloth Atelier
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Founded in 2024 by Harsha. We craft exclusive small-batch streetwear and modern essentials with heavyweight organic fabrics, dropped shoulders, and architectural cuts.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=Hoodies" className="hover:text-white transition-colors">Hoodies & Sweats</Link></li>
              <li><Link to="/shop?category=T-Shirts" className="hover:text-white transition-colors">Heavyweight Tees</Link></li>
              <li><Link to="/shop?category=Jackets" className="hover:text-white transition-colors">Outerwear & Jackets</Link></li>
              <li><Link to="/shop?category=Pants" className="hover:text-white transition-colors">Pleated & Cargo Pants</Link></li>
              <li><Link to="/shop?category=Dresses" className="hover:text-white transition-colors">Dresses & Knitwear</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide & Fit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fabric & Care Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Stay In The Loop</h5>
            <p className="text-xs text-stone-400 mb-3">Subscribe for exclusive drop alerts, private studio sales, and lookbooks.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-900 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Join Atelier List
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 AURA WEAR Atelier Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-stone-400">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400">Terms of Service</a>
            <a href="#" className="hover:text-stone-400">Merchant Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
