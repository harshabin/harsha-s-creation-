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
    <div className="space-y-6 text-[#E1E7F0]">
      {/* Top Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Customer Orders & Fulfillment
        </h1>
        <p className="text-xs text-[#8B95A5] mt-1">
          Review atelier shipments, update fulfillment stages, and attach tracking credentials
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-display transition-all ${
              selectedStatus === st
                ? 'bg-[#99EEFF] text-black shadow-cyan-subtle'
                : 'bg-[#11141B] text-[#8B95A5] border border-[#232A38] hover:border-[#99EEFF]/40 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#11141B] rounded-3xl border border-[#232A38] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#8B95A5] animate-pulse">Loading atelier orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8B95A5]">No orders found for this filter</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161B24] border-b border-[#1E2430] text-[#8B95A5] font-bold uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#1E2430]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#161B24]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      #{order._id.slice(-6).toUpperCase()}
                      <span className="block text-[10px] text-[#8B95A5] font-normal font-sans">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{order.user?.name || order.shippingAddress?.fullName}</p>
                      <p className="text-[#8B95A5] text-[11px]">{order.user?.email || order.shippingAddress?.phone}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-[#E1E7F0]">
                        {order.items.reduce((acc, itm) => acc + itm.quantity, 0)} units
                      </span>
                      <p className="text-[10px] text-[#8B95A5] truncate max-w-[120px]">
                        {order.items[0]?.name}
                        {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                      </p>
                    </td>

                    <td className="p-4 font-extrabold text-[#99EEFF] font-display">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="block text-[10px] text-[#8B95A5] mt-0.5">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(order.status)}`}>
                        ● {order.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      {order.trackingNumber ? (
                        <div>
                          <span className="font-semibold text-white">{order.trackingNumber}</span>
                          <span className="block text-[10px] text-[#8B95A5] font-sans">{order.carrier}</span>
                        </div>
                      ) : (
                        <span className="text-[#8B95A5] italic font-sans">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order)}
                        className="px-3.5 py-1.5 bg-[#161B24] hover:bg-[#1E2430] border border-[#232A38] text-[#99EEFF] hover:border-[#99EEFF]/40 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-sm font-display"
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
