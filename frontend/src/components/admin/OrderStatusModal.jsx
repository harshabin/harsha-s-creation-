import React, { useState, useEffect } from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services/orderService';

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const OrderStatusModal = ({ isOpen, onClose, order, onUpdateSuccess }) => {
  const [status, setStatus] = useState('Processing');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState("Harsha's Creation Express");
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'Placed');
      setPaymentStatus(order.paymentStatus || 'Pending');
      setTrackingNumber(order.trackingNumber || '');
      setCarrier(order.carrier || "Harsha's Creation Express");
      setNotes(order.notes || '');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUpdating(true);

    try {
      await orderService.updateOrderStatus(order._id, {
        status,
        paymentStatus,
        trackingNumber,
        carrier,
        notes
      });
      onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#E1E7F0]">
      <div className="bg-[#11141B] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#232A38] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2430]">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Update Order #{order._id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-[#8B95A5]">Customer: {order.user?.name || order.shippingAddress?.fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8B95A5] hover:text-white rounded-full hover:bg-[#161B24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-rose-950/60 border border-rose-800/60 text-rose-400 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1.5">
              Fulfillment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] rounded-xl font-medium text-white focus:border-[#99EEFF] focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#11141B] text-white">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1.5">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] rounded-xl font-medium text-white focus:border-[#99EEFF] focus:outline-none"
            >
              {PAYMENT_STATUSES.map((ps) => (
                <option key={ps} value={ps} className="bg-[#11141B] text-white">{ps}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1.5">
                Logistics Carrier
              </label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#161B24] border border-[#232A38] rounded-xl text-white focus:border-[#99EEFF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1.5">
                Tracking Number
              </label>
              <input
                type="text"
                placeholder="e.g. HC-EXP-9921"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#161B24] border border-[#232A38] rounded-xl text-white placeholder-[#8B95A5] focus:border-[#99EEFF] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1.5">
              Internal Fulfillment Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Dispatched from Bengaluru atelier via express priority air"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#161B24] border border-[#232A38] rounded-xl text-white placeholder-[#8B95A5] focus:border-[#99EEFF] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2430]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black text-xs font-bold uppercase tracking-widest font-display rounded-full transition-all shadow-cyan-subtle disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderStatusModal;
