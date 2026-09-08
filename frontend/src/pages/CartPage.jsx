import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountPercent,
    couponCode,
    applyCoupon,
    removeCoupon,
    shippingPrice,
    taxPrice,
    grandTotal
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoMessage(res);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-950 font-display">Your Shopping Bag is Empty</h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto mt-2 mb-8">
          Explore our collection of limited-edition heavyweight hoodies, jackets, tailored trousers, and capsule essentials.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-stone-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-950 font-display">Shopping Bag</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        {/* Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-sm">
            {cartItems.map((item) => {
              const prod = item.product || {};
              const image = prod.images?.[0] || '/assets/products/hoodie_black.jpg';
              const name = prod.name || item.name || 'Apparel Item';
              const price = prod.discountPrice > 0 ? prod.discountPrice : (prod.price || item.price || 0);

              return (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                        {prod.category || 'Atelier'}
                      </span>
                      <Link
                        to={`/shop/${prod._id || prod.slug}`}
                        className="block text-base font-bold text-stone-900 hover:text-brand-700 transition-colors"
                      >
                        {name}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="font-semibold px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md">
                          Size: {item.size}
                        </span>
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Unit Price: <span className="font-bold text-stone-800">{formatCurrency(price)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-stone-600 hover:bg-stone-100 rounded-l-xl disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 text-stone-600 hover:bg-stone-100 rounded-r-xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-base font-extrabold text-stone-950 font-display">
                        {formatCurrency(price * item.quantity)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-600" />
              <div className="text-xs">
                <p className="font-bold text-stone-900">Fast Fulfillment</p>
                <p className="text-stone-500">Dispatched within 24 hours</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              <div className="text-xs">
                <p className="font-bold text-stone-900">14-Day Exchanges</p>
                <p className="text-stone-500">Doorstep return pickup</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <div className="text-xs">
                <p className="font-bold text-stone-900">Razorpay Verified</p>
                <p className="text-stone-500">256-bit encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon Box (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-950 font-display pb-4 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Promo Code Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Have a Promo Code?
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    '{couponCode}' ({discountPercent}% Discount)
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. FIRST10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl uppercase tracking-wider focus:bg-white focus:ring-1 focus:ring-stone-950"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p className={`text-xs font-semibold mt-2 ${promoMessage.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage.message}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-stone-600 pt-4 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE Express</span>
                  ) : (
                    formatCurrency(shippingPrice)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Applicable Taxes (GST 5%)</span>
                <span className="font-semibold text-stone-900">{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-200 text-base font-extrabold text-stone-950 font-display">
                <span>Estimated Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-stone-950 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-stone-400 text-center">
              Tax included. Shipping calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
