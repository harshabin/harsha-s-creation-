import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CheckCircle, Package, ArrowRight, Truck, MapPin } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Error fetching order receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const estimatedDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        Order Confirmed
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 font-display mt-3">
        Thank You for Your Order!
      </h1>
      <p className="text-sm text-stone-600 max-w-md mx-auto mt-2">
        We’ve received your order and our atelier tailors are currently preparing your package.
      </p>

      {/* Order Info Card */}
      {order && (
        <div className="mt-10 p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 text-left shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-2">
            <div>
              <p className="text-xs text-stone-400">Order Reference</p>
              <p className="text-base font-extrabold text-stone-900 font-mono">
                #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Payment Status</p>
              <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {order.paymentStatus} ({order.paymentMethod})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                Estimated Delivery
              </p>
              <p className="text-stone-600">{formatDate(estimatedDeliveryDate)} via {order.carrier}</p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                Delivery Address
              </p>
              <p className="text-stone-600">
                {order.shippingAddress?.fullName}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Items Ordered ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((itm, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={itm.image} alt="" className="w-12 h-14 rounded-lg object-cover bg-stone-100" />
                    <div>
                      <p className="font-semibold text-stone-900">{itm.name}</p>
                      <p className="text-stone-400">Size: {itm.size} • Qty: {itm.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">{formatCurrency(itm.price * itm.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-between text-sm font-extrabold text-stone-950">
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
