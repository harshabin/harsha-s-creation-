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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Collections', path: '/shop' },
    { name: 'Men', path: '/shop?gender=Men' },
    { name: 'Women', path: '/shop?gender=Women' },
    { name: 'Hoodies', path: '/shop?category=Hoodies' },
    { name: 'Jackets', path: '/shop?category=Jackets' },
    { name: 'Best Sellers', path: '/shop?sort=rating' }
  ];

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-stone-900 text-stone-200 text-xs tracking-wider uppercase py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Autumn / Winter '26 Drop Live • Free Express Delivery on orders above ₹1,999 • Code: <strong className="text-white font-bold tracking-widest">FIRST10</strong> for 10% OFF</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex flex-col items-start group">
                <span className="text-xl sm:text-2xl font-extrabold tracking-widest text-stone-950 font-display group-hover:text-stone-800 transition-colors">
                  HARSHA'S <span className="text-brand-600 font-light">CREATION</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] text-stone-500 font-semibold uppercase -mt-0.5">
                  Since 2024 • Own Brand Atelier
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium tracking-wide transition-colors py-1 relative ${
                      isActive
                        ? 'text-stone-950 font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions (Search, Wishlist, User, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Toggle / Form */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search hoodies, jackets, sizes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-sm bg-stone-100 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-950"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2.5 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-stone-700 hover:text-stone-950 transition-colors"
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-stone-700 hover:text-stone-950 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-stone-950 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-stone-700 hover:text-stone-950 transition-colors relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold tracking-wide transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center text-xs uppercase">
                        {user.name.charAt(0)}
                      </span>
                      <span className="hidden md:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-modal border border-stone-200 py-2 z-50 animate-fade-in"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs text-stone-400">Signed in as</p>
                          <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-md uppercase">
                              Admin Access
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 font-medium"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left border-t border-stone-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wide hover:bg-stone-800 transition-all shadow-sm"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-stone-100 border border-stone-300 rounded-xl"
              />
              <button type="submit" className="absolute right-3 top-3 text-stone-500">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-stone-100">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-amber-800 bg-amber-50 rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
