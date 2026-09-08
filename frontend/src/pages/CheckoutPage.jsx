import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { formatCurrency } from '../utils/formatters';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Banknote,
  Building2,
  Sparkles
} from 'lucide-react';

const CheckoutPage = () => {
  const { user } = useAuth();
  const {
    cartItems,
    clearCart,
    subtotal,
    discountAmount,
    shippingPrice,
    taxPrice,
    grandTotal
  } = useCart();

  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simulatorModal, setSimulatorModal] = useState(null);

  // Pre-fill default address if user has saved addresses
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFullName(defaultAddr.fullName || user.name);
      setPhone(defaultAddr.phone || user.phone || '');
      setStreet(defaultAddr.street || '');
      setCity(defaultAddr.city || '');
      setState(defaultAddr.state || 'Maharashtra');
      setPostalCode(defaultAddr.postalCode || '');
      setCountry(defaultAddr.country || 'India');
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <h3 className="text-xl font-bold text-stone-900 font-display">Your Bag is Empty</h3>
        <p className="text-xs text-stone-500 mt-2 mb-6">Please add items to your shopping bag before checking out.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Handle Order Placement & Razorpay Payment
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!fullName || !street || !city || !state || !postalCode || !phone) {
      setError('Please fill in all required shipping address fields');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order in Backend
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product?._id || item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          postalCode,
          country,
          phone
        },
        paymentMethod,
        itemsPrice: subtotal,
        discountAmount,
        shippingPrice,
        taxPrice,
        totalAmount: grandTotal,
        notes
      };

      const orderRes = await orderService.createOrder(orderPayload);
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to place order');
      }

      const createdOrder = orderRes.data;

      // 2. Handle Payment
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${createdOrder._id}`);
        return;
      }

      // Razorpay Payment Flow
      const paymentInitRes = await paymentService.initiatePayment(createdOrder._id);
      if (!paymentInitRes.success || !paymentInitRes.data) {
        throw new Error('Failed to initiate payment gateway');
      }

      const { razorpayOrderId, amount, currency, keyId, isSimulator } = paymentInitRes.data;

      // If test keys or Razorpay SDK unavailable, launch interactive simulator modal
      if (isSimulator || !window.Razorpay) {
        setSimulatorModal({
          orderId: createdOrder._id,
          razorpayOrderId,
          amount,
          currency,
          keyId
        });
        setLoading(false);
        return;
      }

      // Standard Razorpay Client-Side SDK Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Harsha's Creation Atelier",
        description: `Order #${createdOrder._id.slice(-6).toUpperCase()}`,
        image: '/assets/products/hoodie_black.jpg',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await paymentService.verifyPayment({
              orderId: createdOrder._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isSimulator: false
            });

            if (verifyRes.success) {
              clearCart();
              navigate(`/order-success/${createdOrder._id}`);
            }
          } catch (verifyErr) {
            setError('Payment verification failed. Please contact customer support.');
          }
        },
        prefill: {
          name: fullName,
          email: user.email,
          contact: phone
        },
        theme: {
          color: '#1c1917'
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (resp) {
        setError(`Payment failed: ${resp.error.description}`);
      });
      rzpInstance.open();
      setLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong with checkout');
      setLoading(false);
    }
  };

  // Complete Payment via Simulator
  const handleSimulatorPay = async () => {
    if (!simulatorModal) return;
    setLoading(true);
    try {
      const verifyRes = await paymentService.verifyPayment({
        orderId: simulatorModal.orderId,
        razorpay_order_id: simulatorModal.razorpayOrderId,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
        razorpay_signature: `sig_sim_${Date.now()}`,
        isSimulator: true
      });

      if (verifyRes.success) {
        clearCart();
        setSimulatorModal(null);
        navigate(`/order-success/${simulatorModal.orderId}`);
      }
    } catch (err) {
      setError('Simulator payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-[#8B95A5] hover:text-[#99EEFF] uppercase tracking-wider mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping Bag</span>
      </Link>

      <div className="pb-6 border-b border-[#232A38]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">Secure Atelier Checkout</h1>
        <p className="text-xs text-[#8B95A5] mt-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#99EEFF]" />
          <span>Encrypted 256-bit payment gateway transaction • Harsha's Creation Concierge</span>
        </p>
      </div>

      {error && (
        <div className="my-6 p-4 bg-rose-950/40 border border-rose-800/80 text-rose-300 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        {/* Left Side: Shipping & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-[#1E2430]">
              <div className="w-9 h-9 rounded-xl bg-[#99EEFF]/10 border border-[#99EEFF]/20 flex items-center justify-center text-[#99EEFF]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">1. Delivery Destination</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Harsha Vardhan"
                  className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                Street Address / Flat / Landmark *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 108 Atelier Avenue, Indiranagar"
                className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                  Postal Code / PIN *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560038"
                  className="w-full px-4 py-3 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with security / Contact upon arrival"
                className="w-full px-4 py-2.5 text-sm bg-[#0B0D13] border border-[#232A38] text-white placeholder-[#8B95A5] rounded-xl focus:outline-none focus:border-[#99EEFF] focus:ring-1 focus:ring-[#99EEFF] transition-all"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-[#1E2430]">
              <div className="w-9 h-9 rounded-xl bg-[#99EEFF]/10 border border-[#99EEFF]/20 flex items-center justify-center text-[#99EEFF]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">2. Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razorpay Option */}
              <label
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#99EEFF] bg-[#161B24] shadow-cyan-subtle ring-1 ring-[#99EEFF]'
                    : 'border-[#232A38] bg-[#0B0D13] hover:border-[#99EEFF]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#99EEFF] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-white">Razorpay Online</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#99EEFF]/15 text-[#99EEFF] border border-[#99EEFF]/30 px-2.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#8B95A5] mt-3 leading-relaxed">
                  UPI (GPay, PhonePe, Paytm), Cards (Visa, Mastercard, RuPay), NetBanking & Wallets
                </p>
              </label>

              {/* COD Option */}
              <label
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-[#99EEFF] bg-[#161B24] shadow-cyan-subtle ring-1 ring-[#99EEFF]'
                    : 'border-[#232A38] bg-[#0B0D13] hover:border-[#99EEFF]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#99EEFF] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-white">Cash on Delivery</span>
                </div>
                <p className="text-xs text-[#8B95A5] mt-3 leading-relaxed">
                  Pay via cash or UPI scan directly upon courier arrival at your doorstep
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Items & Pay CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white font-display pb-4 border-b border-[#1E2430]">
              Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Compact Item Thumbnails List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => {
                const prod = item.product || {};
                const image = prod.images?.[0] || '/assets/products/hoodie_black.jpg';
                const name = prod.name || item.name || 'Apparel Item';
                const price = prod.discountPrice > 0 ? prod.discountPrice : (prod.price || item.price || 0);

                return (
                  <div key={item._id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#1E2430]/60 last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={image} alt="" className="w-12 h-14 rounded-lg object-cover bg-[#161B24] border border-[#232A38]" />
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{name}</p>
                        <p className="text-[#8B95A5]">Size: <span className="text-stone-300 font-semibold">{item.size}</span> × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white font-mono">{formatCurrency(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-[#8B95A5] pt-4 border-t border-[#1E2430]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#99EEFF] font-semibold">
                  <span>Discount Applied</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Atelier Shipping</span>
                <span className="font-semibold text-white font-mono">
                  {shippingPrice === 0 ? <span className="text-[#99EEFF] font-bold">COMPLIMENTARY</span> : formatCurrency(shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Applicable GST (5%)</span>
                <span className="font-semibold text-white font-mono">{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#232A38] text-lg font-extrabold text-white font-display items-center">
                <span>Grand Total</span>
                <span className="text-[#99EEFF] font-mono text-xl">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#99EEFF] hover:bg-[#80E8FF] text-[#08090C] rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-subtle flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#08090C]" />
                  <span>Place Order • {formatCurrency(grandTotal)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Razorpay Gateway Simulator Modal */}
      {simulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#11141B] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#232A38] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2430]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#99EEFF] text-[#08090C] flex items-center justify-center font-bold text-xs font-mono">
                  RZP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Razorpay Payment Simulator</h4>
                  <p className="text-[10px] text-[#8B95A5]">Sandbox Test Mode</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Active Sandbox
              </span>
            </div>

            <div className="p-4 bg-[#0B0D13] border border-[#232A38] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8B95A5]">Merchant</span>
                <span className="font-bold text-white">HARSHA'S CREATION ATELIER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B95A5]">Amount Due</span>
                <span className="font-extrabold text-[#99EEFF] text-base font-mono">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B95A5]">Transaction Ref</span>
                <span className="font-mono text-[11px] text-stone-400">{simulatorModal.razorpayOrderId}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSimulatorPay}
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#08090C] rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#08090C]" />
                <span>Simulate Successful Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatorModal(null)}
                className="w-full py-2.5 text-xs font-semibold text-[#8B95A5] hover:text-white transition-colors cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
