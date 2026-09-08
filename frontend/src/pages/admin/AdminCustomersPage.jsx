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
    <div className="space-y-6 text-[#E1E7F0]">
      {/* Top Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Customer Directory & Lifetime Value
        </h1>
        <p className="text-xs text-[#8B95A5] mt-1">
          Registered patrons, purchase history metrics, and customer contact records
        </p>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#11141B] rounded-3xl border border-[#232A38] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#8B95A5] animate-pulse">Loading patrons...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8B95A5]">No registered patrons yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161B24] border-b border-[#1E2430] text-[#8B95A5] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2430]">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#161B24]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#161B24] border border-[#232A38] text-[#99EEFF] flex items-center justify-center font-bold text-xs uppercase font-display">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#8B95A5] font-medium">{c.email}</td>
                    <td className="p-4 text-[#8B95A5]">{c.phone || '-'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#161B24] border border-[#232A38] rounded-full font-bold text-white">
                        {c.orderCount || 0} orders
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#99EEFF] font-display">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>
                    <td className="p-4 text-right text-[#8B95A5]">
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
