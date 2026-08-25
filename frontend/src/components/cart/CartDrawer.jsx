import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    applyCoupon,
    removeCoupon,
    grandTotal
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoMessage(res);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h3 className="text-lg font-bold text-stone-900 font-display">Your Bag</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-brand-50/70 border-b border-brand-100/60 text-xs text-brand-900">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                {amountLeftForFreeShipping === 0
                  ? '🎉 You have unlocked Free Express Shipping!'
                  : `Add ${formatCurrency(amountLeftForFreeShipping)} more for FREE Express Shipping`}
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-brand-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Drawer Body - Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-stone-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-800">Your bag is empty</h4>
                <p className="text-xs text-stone-500 max-w-[220px] mt-1 mb-6">
                  Explore our latest own-brand collection and fill it with timeless essentials.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const prod = item.product || {};
                const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80';
                const name = prod.name || item.name || 'Apparel Item';
                const price = prod.discountPrice > 0 ? prod.discountPrice : (prod.price || item.price || 0);

                return (
                  <div key={item._id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/shop/${prod._id || prod.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-sm font-semibold text-stone-900 hover:text-brand-700 line-clamp-1"
                          >
                            {name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                            Size: {item.size}
                          </span>
                          {item.color && (
                            <span className="text-[11px] text-stone-500">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-stone-950">
                            {formatCurrency(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/50 space-y-4">
              {/* Promo code */}
              {couponCode ? (
                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Coupon '{couponCode}' applied ({discountPercent}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. FIRST10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p className={`text-[11px] font-medium ${promoMessage.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage.message}
                </p>
              )}

              {/* Subtotal & Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-stone-900 font-semibold">
                    {subtotal > freeShippingThreshold ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatCurrency(150)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-950">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  View Full Shopping Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
