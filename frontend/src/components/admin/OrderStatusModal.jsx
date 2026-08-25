import React, { useState, useEffect } from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services/orderService';

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const OrderStatusModal = ({ isOpen, onClose, order, onUpdateSuccess }) => {
  const [status, setStatus] = useState('Processing');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Aura Logistics Express');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'Placed');
      setPaymentStatus(order.paymentStatus || 'Pending');
      setTrackingNumber(order.trackingNumber || '');
      setCarrier(order.carrier || 'Aura Logistics Express');
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h3 className="text-lg font-bold text-stone-950 font-display">
              Update Order #{order._id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-stone-500">Customer: {order.user?.name || order.shippingAddress?.fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Fulfillment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-medium focus:bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl font-medium focus:bg-white"
            >
              {PAYMENT_STATUSES.map((ps) => (
                <option key={ps} value={ps}>{ps}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Logistics Carrier
              </label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                placeholder="e.g. AURA-EXP-9921"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Internal Fulfillment Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Dispatched from Indiranagar hub via Bluedart air"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
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
