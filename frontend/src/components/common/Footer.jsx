import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, Instagram, Twitter, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050608] text-[#8B95A5] pt-16 pb-12 border-t border-[#1E2430]">
      {/* Reson Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#1E2430]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-5 rounded-3xl bg-[#11141B] border border-[#232A38]">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] flex items-center justify-center text-[#99EEFF]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-display">Complimentary Courier</h4>
              <p className="text-[11px] text-[#8B95A5] mt-0.5">On all domestic atelier drops exceeding ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-5 rounded-3xl bg-[#11141B] border border-[#232A38]">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] flex items-center justify-center text-[#99EEFF]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-display">14-Day Atelier Exchange</h4>
              <p className="text-[11px] text-[#8B95A5] mt-0.5">Doorstep pickup & effortless silhouette adjustment</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-5 rounded-3xl bg-[#11141B] border border-[#232A38]">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] flex items-center justify-center text-[#99EEFF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider font-display">Bespoke Mill Authenticity</h4>
              <p className="text-[11px] text-[#8B95A5] mt-0.5">Custom-spun 480 GSM loops & Okayama selvedge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Identity */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="text-xl text-[#99EEFF] group-hover:rotate-45 transition-transform duration-300 select-none">
                ✦
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white font-display">
                  Harsha's Creation
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#8B95A5] font-semibold uppercase -mt-0.5">
                  Exclusive Atelier • Est. 2024
                </span>
              </div>
            </Link>
            <p className="text-xs text-[#8B95A5] max-w-sm leading-relaxed">
              Founded in 2024 by Harsha. Dedicated to crafting small-batch architectural streetwear with heavyweight organic fabrics, dropped shoulders, and structured lines.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-[#11141B] border border-[#232A38] text-[#8B95A5] hover:text-[#99EEFF] hover:border-[#99EEFF]/50 flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#11141B] border border-[#232A38] text-[#8B95A5] hover:text-[#99EEFF] hover:border-[#99EEFF]/50 flex items-center justify-center transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] font-display mb-4">
              Silhouettes
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/shop?category=Hoodies" className="hover:text-white transition-colors">480 GSM Hoodies</Link></li>
              <li><Link to="/shop?category=T-Shirts" className="hover:text-white transition-colors">Capsule Drop Tees</Link></li>
              <li><Link to="/shop?category=Jackets" className="hover:text-white transition-colors">Technical Outerwear</Link></li>
              <li><Link to="/shop?category=Pants" className="hover:text-white transition-colors">Pleated & Selvedge Pants</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] font-display mb-4">
              Atelier Services
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide & Fit Anatomy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Textile & Care Science</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white text-[11px] font-bold uppercase tracking-[0.15em] font-display mb-4">
              Private Drop Access
            </h5>
            <p className="text-[11px] text-[#8B95A5] mb-3">Subscribe for runway alerts, private archive releases, and studio lookbooks.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 text-xs bg-[#11141B] border border-[#232A38] rounded-full text-white placeholder-[#8B95A5] focus:outline-none focus:border-[#99EEFF]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-[#99EEFF] hover:bg-[#B8F4FF] text-black flex items-center justify-center transition-all shadow-cyan-subtle"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-[#1E2430] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8B95A5] gap-4">
          <p>© 2026 Harsha's Creation Atelier. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Atelier</a>
            <a href="#" className="hover:text-white transition-colors">Global Delivery</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
