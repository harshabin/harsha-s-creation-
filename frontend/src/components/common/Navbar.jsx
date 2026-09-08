import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Mail,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Collection', path: '/shop' },
    { name: 'Form & Cut', path: '/shop?category=Hoodies' },
    { name: 'Textiles', path: '/shop?isFeatured=true' },
    { name: 'Outerwear', path: '/shop?category=Jackets' },
    { name: 'Lookbook', path: '/#lookbook' }
  ];

  return (
    <>
      {/* Harsha's Creation Top Announcement Banner */}
      <div className="bg-[#050608] text-[#8B95A5] text-[11px] tracking-[0.2em] uppercase py-2 px-4 text-center font-medium border-b border-[#1E2430]/60 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#99EEFF] animate-pulse" />
        <span>HARSHA'S CREATION ATELIER • AUTUMN/WINTER '26 DROP AVAILABLE NOW</span>
      </div>

      {/* Sticky Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#08090C]/85 backdrop-blur-xl border-b border-[#1E2430]/70 text-[#E1E7F0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 xl:gap-8">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Harsha's Creation Brand Logo */}
            <div className="flex-shrink-0 flex items-center pr-2 xl:pr-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <span className="text-xl sm:text-2xl text-[#99EEFF] group-hover:rotate-45 transition-transform duration-300 font-serif select-none">
                  ✦
                </span>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-white group-hover:text-[#99EEFF] transition-colors whitespace-nowrap">
                    Harsha's Creation
                  </span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-[#8B95A5] -mt-0.5 font-semibold">
                    Exclusive Atelier • Est. 2024
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs font-semibold uppercase tracking-[0.14em] transition-all py-1 relative whitespace-nowrap ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-[#8B95A5] hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#99EEFF] rounded-full shadow-cyan-subtle" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Cluster (matching Figma: Search, Wishlist, Bag, Account, Contact Us pill) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
              {/* Search Toggle */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search drops, silhouettes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-48 sm:w-64 pl-4 pr-8 py-2 text-xs bg-[#12151D] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-full focus:outline-none focus:border-[#99EEFF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 text-[#8B95A5] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-[#8B95A5] hover:text-white transition-colors rounded-full hover:bg-white/5"
                    title="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-[#8B95A5] hover:text-white transition-colors relative rounded-full hover:bg-white/5"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#99EEFF] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-cyan-subtle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger (Figma Bag Icon) */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#8B95A5] hover:text-white transition-colors relative rounded-full hover:bg-white/5 group"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 group-hover:text-[#99EEFF] transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#99EEFF] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-cyan-subtle animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account / Profile */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#12151D] border border-[#232A38] hover:border-[#99EEFF]/50 text-white text-xs font-semibold tracking-wide transition-all"
                    >
                      <span className="w-5 h-5 rounded-full overflow-hidden bg-white/10 text-white flex items-center justify-center text-[10px] uppercase flex-shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </span>
                      <span className="hidden md:inline max-w-[85px] truncate text-[11px]">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-[#8B95A5]" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-[#11141B] rounded-2xl shadow-modal border border-[#232A38] py-2 z-50 animate-fade-in"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-[#1E2430]">
                          <p className="text-[10px] uppercase tracking-wider text-[#8B95A5]">Signed in as</p>
                          <p className="text-xs font-bold text-white truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-[#99EEFF]/20 text-[#99EEFF] rounded uppercase tracking-wider">
                              Atelier Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#99EEFF] hover:bg-white/5 font-semibold"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin Atelier
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-300 hover:text-white hover:bg-white/5 font-medium"
                        >
                          <Package className="w-3.5 h-3.5" />
                          My Orders
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-white/5 font-medium text-left border-t border-[#1E2430] mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-[#8B95A5] hover:text-white transition-colors rounded-full hover:bg-white/5 flex items-center justify-center"
                    title="Sign In"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Signature Reson Figma Pill Button: Contact Us ✉ */}
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#232A38] bg-[#12151D] hover:bg-[#161B24] hover:border-[#99EEFF]/60 text-xs font-semibold text-white tracking-wide transition-all shadow-sm group"
              >
                <span>Contact Us</span>
                <Mail className="w-3.5 h-3.5 text-[#8B95A5] group-hover:text-[#99EEFF] transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1E2430] bg-[#08090C] px-5 pt-4 pb-7 space-y-4 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative mb-2">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 text-xs bg-[#12151D] border border-[#232A38] text-white rounded-xl placeholder-[#8B95A5]"
              />
              <button type="submit" className="absolute right-3 top-3 text-[#8B95A5]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#8B95A5] hover:text-white hover:bg-white/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1E2430] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setContactModalOpen(true);
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#99EEFF]"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Atelier</span>
              </button>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg"
                >
                  Admin Atelier
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#11141B] border border-[#232A38] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 text-[#8B95A5] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#99EEFF] font-semibold uppercase tracking-widest">
                <span>✦</span> Harsha's Creation Atelier
              </div>
              <h3 className="text-xl font-bold font-display text-white">Direct Atelier Concierge</h3>
              <p className="text-xs text-[#8B95A5]">
                For bespoke sizing, private showroom appointments, or custom orders with Harsha's Creation.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#232A38] flex items-center justify-between">
                <span className="text-[#8B95A5]">Email</span>
                <span className="text-white font-semibold">atelier@harshascreation.com</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#232A38] flex items-center justify-between">
                <span className="text-[#8B95A5]">Studio Location</span>
                <span className="text-white font-semibold">Bengaluru, India</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#161B24] border border-[#232A38] flex items-center justify-between">
                <span className="text-[#8B95A5]">Lead Craftsperson</span>
                <span className="text-[#99EEFF] font-semibold">Harsha (Founder)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
              className="w-full py-3 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black font-bold font-display text-xs uppercase tracking-widest rounded-full transition-all shadow-cyan-subtle"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
