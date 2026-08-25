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
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=120&q=80',
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
      <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping Bag</span>
      </Link>

      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-extrabold text-stone-950 font-display">Secure Atelier Checkout</h1>
        <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted 256-bit payment gateway transaction</span>
        </p>
      </div>

      {error && (
        <div className="my-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        {/* Left Side: Shipping & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
              <Truck className="w-5 h-5 text-stone-900" />
              <h3 className="text-lg font-bold text-stone-950 font-display">1. Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Street Address / Flat / Building *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 402 Highline Residency, 14th Road"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Postal Code / PIN *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with concierge / Gate code 1234"
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
              <CreditCard className="w-5 h-5 text-stone-900" />
              <h3 className="text-lg font-bold text-stone-950 font-display">2. Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razorpay Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'Razorpay'
                    ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-950'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-stone-950 focus:ring-stone-950"
                    />
                    <span className="text-sm font-bold text-stone-900">Razorpay Online</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-900 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  UPI, Cards (Visa, Mastercard, RuPay), NetBanking, Cred & Wallets
                </p>
              </label>

              {/* COD Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-950'
                    : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-stone-950 focus:ring-stone-950"
                  />
                  <span className="text-sm font-bold text-stone-900">Cash on Delivery</span>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Pay with cash or UPI QR upon courier arrival at doorstep
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Items & Pay CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-950 font-display pb-4 border-b border-stone-100">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Compact Item Thumbnails List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => {
                const prod = item.product || {};
                const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80';
                const name = prod.name || item.name || 'Apparel Item';
                const price = prod.discountPrice > 0 ? prod.discountPrice : (prod.price || item.price || 0);

                return (
                  <div key={item._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={image} alt="" className="w-12 h-14 rounded-lg object-cover bg-stone-100" />
                      <div>
                        <p className="font-semibold text-stone-900 line-clamp-1">{name}</p>
                        <p className="text-stone-500">Size: {item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatCurrency(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-4 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatCurrency(shippingPrice)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Applicable GST (5%)</span>
                <span className="font-semibold text-stone-900">{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-200 text-lg font-extrabold text-stone-950 font-display">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-950 hover:bg-stone-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • {formatCurrency(grandTotal)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Razorpay Gateway Simulator Modal */}
      {simulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  RZP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Razorpay Payment Simulator</h4>
                  <p className="text-[10px] text-stone-400">Sandbox Test Mode</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Active Test Mode
              </span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Merchant</span>
                <span className="font-bold text-stone-900">HARSHA'S CREATION ATELIER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount Due</span>
                <span className="font-extrabold text-stone-950 text-base">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction Ref</span>
                <span className="font-mono text-[11px] text-stone-600">{simulatorModal.razorpayOrderId}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSimulatorPay}
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatorModal(null)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
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
