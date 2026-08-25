import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../../utils/formatters';
import OrderStatusModal from '../../components/admin/OrderStatusModal';
import { ShoppingBag, Edit3, Truck, Filter, MapPin } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        status: selectedStatus !== 'All' ? selectedStatus : undefined
      });
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display">
          Customer Orders & Fulfillment
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review customer shipments, update fulfillment stages, and attach tracking numbers
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === st
                ? 'bg-stone-950 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading customer orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">No orders found for this filter</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Paid</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Tracking</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-950">
                      #{order._id.slice(-6).toUpperCase()}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-stone-900">{order.user?.name || order.shippingAddress?.fullName}</p>
                      <p className="text-stone-400 text-[11px]">{order.user?.email || order.shippingAddress?.phone}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-stone-800">
                        {order.items.reduce((acc, itm) => acc + itm.quantity, 0)} units
                      </span>
                      <p className="text-[10px] text-stone-400 truncate max-w-[120px]">
                        {order.items[0]?.name}
                        {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                      </p>
                    </td>

                    <td className="p-4 font-extrabold text-stone-950">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(order.status)}`}>
                        ● {order.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-stone-600">
                      {order.trackingNumber ? (
                        <div>
                          <span className="font-semibold text-stone-900">{order.trackingNumber}</span>
                          <span className="block text-[10px] text-stone-400">{order.carrier}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Modal */}
      <OrderStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={fetchOrders}
      />
    </div>
  );
};

export default AdminOrdersPage;
