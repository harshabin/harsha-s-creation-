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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E1117] text-[#E1E7F0] shadow-2xl flex flex-col justify-between border-l border-[#232A38]">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#232A38] flex items-center justify-between bg-[#11141B]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#99EEFF]" />
              <h3 className="text-lg font-bold text-white font-display">Atelier Bag</h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#161B24] border border-[#232A38] text-[#99EEFF]">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/5 text-[#8B95A5] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#12151D] border-b border-[#232A38] text-xs text-[#8B95A5]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-medium flex items-center gap-1.5 text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#99EEFF]" />
                {amountLeftForFreeShipping === 0
                  ? 'Unlocked: Complimentary Atelier Courier!'
                  : `Add ${formatCurrency(amountLeftForFreeShipping)} for Free Express Courier`}
              </span>
              <span className="font-bold text-[#99EEFF]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#1A202C] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#99EEFF] h-full rounded-full transition-all duration-300 shadow-cyan-subtle"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Drawer Body - Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#1E2430]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#161B24] border border-[#232A38] flex items-center justify-center text-[#8B95A5]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Your bag is empty</h4>
                <p className="text-xs text-[#8B95A5] max-w-[240px]">
                  Explore Harsha's Creation limited autumn/winter drop and curate your architectural wardrobe.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black rounded-full text-xs font-bold uppercase tracking-widest font-display transition-all shadow-cyan-subtle"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const prod = item.product || {};
                const image = prod.images?.[0] || '/assets/products/hoodie_black.jpg';
                const name = prod.name || item.name || 'Apparel Item';
                const price = prod.discountPrice > 0 ? prod.discountPrice : (prod.price || item.price || 0);

                return (
                  <div key={item._id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-[#161B24] flex-shrink-0 border border-[#232A38]">
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
                            className="text-xs sm:text-sm font-bold text-white hover:text-[#99EEFF] line-clamp-1 font-display"
                          >
                            {name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="text-[#8B95A5] hover:text-rose-400 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#161B24] border border-[#232A38] text-white rounded-md">
                            Size: {item.size}
                          </span>
                          {item.color && (
                            <span className="text-[10px] text-[#8B95A5]">
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#232A38] rounded-full overflow-hidden bg-[#161B24]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-[#8B95A5] hover:text-white disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-2 py-1 text-[#8B95A5] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-white font-display">
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
            <div className="p-6 border-t border-[#232A38] bg-[#11141B] space-y-4">
              {/* Promo code */}
              {couponCode ? (
                <div className="flex items-center justify-between px-3 py-2 bg-[#99EEFF]/10 border border-[#99EEFF]/30 rounded-xl text-xs">
                  <span className="font-semibold text-[#99EEFF] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#99EEFF]" />
                    Coupon '{couponCode}' applied ({discountPercent}% OFF)
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-400 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Atelier code (e.g. FIRST10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-[#161B24] border border-[#232A38] rounded-full uppercase tracking-wider text-white placeholder-[#8B95A5] focus:outline-none focus:border-[#99EEFF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E2430] hover:bg-[#232A38] text-white text-xs font-bold rounded-full uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p className={`text-[11px] font-medium ${promoMessage.success ? 'text-[#99EEFF]' : 'text-rose-400'}`}>
                  {promoMessage.message}
                </p>
              )}

              {/* Subtotal & Breakdown */}
              <div className="space-y-1.5 text-xs text-[#8B95A5] pt-2">
                <div className="flex justify-between">
                  <span>Atelier Subtotal</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#99EEFF] font-medium">
                    <span>Atelier Privilege</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier</span>
                  <span className="text-white font-semibold">
                    {subtotal > freeShippingThreshold ? (
                      <span className="text-[#99EEFF] font-bold">COMPLIMENTARY</span>
                    ) : (
                      formatCurrency(150)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#1E2430] text-sm font-extrabold text-white font-display">
                  <span>Estimated Total</span>
                  <span className="text-[#99EEFF]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black text-xs font-extrabold uppercase tracking-widest font-display rounded-full transition-all flex items-center justify-center gap-2 shadow-cyan-glow hover:scale-[1.02]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-2 text-xs font-semibold text-[#8B95A5] hover:text-white transition-colors"
                >
                  Review Full Order Summary
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
