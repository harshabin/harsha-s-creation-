import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../utils/formatters';
import { Package, ChevronRight, ShoppingBag, Truck, Calendar } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error loading my orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        <div className="h-8 bg-stone-200 w-48 rounded animate-pulse" />
        <div className="h-36 bg-stone-200 rounded-3xl animate-pulse" />
        <div className="h-36 bg-stone-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-extrabold text-stone-950 font-display">My Orders</h1>
        <p className="text-xs text-stone-500 mt-1">
          Track packages, view delivery receipts, and manage apparel orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 mt-8">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            When you purchase own-brand clothing, your fulfillment status and live tracking will appear here.
          </p>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block">Order Reference</span>
                    <span className="font-mono font-bold text-stone-950 text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="border-l border-stone-200 pl-4">
                    <span className="text-stone-400 block">Date Placed</span>
                    <span className="font-semibold text-stone-800">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="border-l border-stone-200 pl-4">
                    <span className="text-stone-400 block">Total Amount</span>
                    <span className="font-bold text-stone-950">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    ● {order.status}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="p-2 text-stone-600 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors"
                    title="View Order Details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Items Thumbnails in Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 rounded-lg object-cover bg-stone-200 flex-shrink-0"
                    />
                    <div className="text-xs overflow-hidden">
                      <p className="font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-stone-500">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="font-semibold text-stone-800">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer with Tracking and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-500 gap-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-700" />
                  <span>
                    Carrier: <strong className="text-stone-800">{order.carrier}</strong>
                    {order.trackingNumber && (
                      <span className="ml-2 font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                        {order.trackingNumber}
                      </span>
                    )}
                  </span>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="text-xs font-bold uppercase tracking-wider text-brand-700 hover:text-brand-900"
                >
                  View Full Receipt & Progress →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
