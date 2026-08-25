import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await orderService.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-stone-200 w-64 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Gross Revenue',
      value: formatCurrency(stats.totalRevenue),
      desc: 'From fulfilled & paid orders',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Total Customer Orders',
      value: stats.totalOrders,
      desc: `${stats.orderStatusMap?.Processing || 0} currently processing`,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Active Customers',
      value: stats.totalCustomers,
      desc: 'Registered buyer profiles',
      icon: Users,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Apparel Catalog Items',
      value: stats.totalProducts,
      desc: `${stats.lowStockProducts?.length || 0} items low in stock`,
      icon: Package,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display">
          Merchant Executive Dashboard
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Real-time analytics for own-brand clothing inventory, sales velocity, and customer orders
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-950 font-display">
                {card.value}
              </h3>
              <p className="text-xs text-stone-400 mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Funnel Breakdown */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 font-display mb-4">
          Order Status Fulfillment Velocity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(stats.orderStatusMap || {}).map(([st, count]) => (
            <div key={st} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full mb-2 border ${getStatusBadgeColor(st)}`}>
                {st}
              </span>
              <p className="text-2xl font-black text-stone-950 font-display">{count}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Orders in state</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Alerts (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Low Stock Warnings
              </h3>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-brand-700 hover:underline">
              Manage Catalog
            </Link>
          </div>

          {stats.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">All inventory levels healthy</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts?.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.images?.[0]} alt="" className="w-10 h-12 rounded-lg object-cover bg-stone-200" />
                    <div>
                      <p className="font-bold text-stone-900 line-clamp-1">{item.name}</p>
                      <p className="text-stone-500">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-md">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Recent Customer Transactions
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-700 hover:underline">
              View All Orders
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">No orders recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase">
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {stats.recentOrders?.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-stone-950">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 text-stone-700 font-medium truncate max-w-[120px]">
                        {ord.user?.name || 'Guest Customer'}
                      </td>
                      <td className="py-3 font-bold text-stone-950">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadgeColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-stone-400">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
