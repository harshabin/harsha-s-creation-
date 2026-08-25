import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeColor } from '../utils/formatters';
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  CreditCard,
  Printer
} from 'lucide-react';

const ORDER_STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-6 bg-stone-200 w-32 rounded animate-pulse" />
        <div className="h-48 bg-stone-200 rounded-3xl animate-pulse" />
        <div className="h-64 bg-stone-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <h3 className="text-xl font-bold text-stone-900 font-display">Order Not Found</h3>
        <p className="text-xs text-stone-500 mt-2 mb-6">Could not locate the requested order record.</p>
        <Link to="/orders" className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 uppercase tracking-wider mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Official Order Document</span>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-mono mt-1">
              #{order._id.toUpperCase()}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="self-start sm:self-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Status Lifecycle Progress Bar */}
        {!isCancelled ? (
          <div className="py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-6">
              Fulfillment Journey
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-stone-950 text-white shadow-md'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      } ${isCurrent ? 'ring-4 ring-brand-500/20 scale-110' : ''}`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs mt-2 font-bold ${isCompleted ? 'text-stone-950' : 'text-stone-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
            ⚠️ This order has been marked as Cancelled.
          </div>
        )}

        {/* Tracking & Carrier Banner */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-brand-700" />
            <div>
              <p className="font-bold text-stone-900">Courier Logistics: {order.carrier}</p>
              <p className="text-stone-500">
                Tracking Number:{' '}
                <strong className="font-mono text-stone-900">
                  {order.trackingNumber || 'Pending Courier Scan'}
                </strong>
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-white rounded-xl border border-stone-200 text-stone-700">
            Payment: {order.paymentStatus} ({order.paymentMethod})
          </span>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
          <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h5 className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              Delivery Destination
            </h5>
            <p className="font-semibold text-stone-800">{order.shippingAddress?.fullName}</p>
            <p className="text-stone-600">{order.shippingAddress?.street}</p>
            <p className="text-stone-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
            </p>
            <p className="text-stone-500">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h5 className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-600" />
              Payment & Transaction
            </h5>
            <p className="text-stone-600">Gateway: <strong className="text-stone-800">{order.paymentMethod}</strong></p>
            <p className="text-stone-600">Status: <strong className="text-emerald-700">{order.paymentStatus}</strong></p>
            {order.paymentResult?.id && (
              <p className="text-stone-500 font-mono text-[11px]">Txn ID: {order.paymentResult.id}</p>
            )}
            {order.paidAt && (
              <p className="text-stone-500">Paid on: {formatDateTime(order.paidAt)}</p>
            )}
          </div>
        </div>

        {/* Itemized Products Table */}
        <div className="pt-6 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-4">
            Items in this Shipment
          </h4>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt="" className="w-14 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200" />
                  <div>
                    <Link
                      to={`/shop/${item.product?._id || item.product}`}
                      className="font-bold text-sm text-stone-900 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                    <p className="text-stone-500 mt-0.5">Size: <strong className="text-stone-800">{item.size}</strong> {item.color ? `• Color: ${item.color}` : ''}</p>
                    <p className="text-stone-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="font-extrabold text-stone-950 text-sm">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-6 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">{formatCurrency(order.itemsPrice)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discount</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Express Courier Shipping</span>
            <span className="font-semibold text-stone-900">{formatCurrency(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="font-semibold text-stone-900">{formatCurrency(order.taxPrice)}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-stone-200 text-base font-extrabold text-stone-950 font-display">
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
