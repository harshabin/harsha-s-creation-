import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Users, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await orderService.getCustomers();
        if (res.success) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display">
          Customer Directory & Lifetime Value
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Registered patrons, purchase history metrics, and customer contact records
        </p>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">No registered customers yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-stone-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-stone-600 font-medium">{c.email}</td>
                    <td className="p-4 text-stone-600">{c.phone || '-'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-stone-100 rounded-full font-bold text-stone-800">
                        {c.orderCount || 0} orders
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>
                    <td className="p-4 text-right text-stone-400">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;
