import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoModal from '../../components/admin/ProfilePhotoModal';
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
  CheckCircle2,
  Camera,
  Sparkles
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
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
      <div className="space-y-8 animate-pulse text-[#E1E7F0]">
        <div className="h-8 bg-[#161B24] border border-[#232A38] w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#11141B] border border-[#232A38] rounded-3xl" />
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
      color: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
    },
    {
      title: 'Total Customer Orders',
      value: stats.totalOrders,
      desc: `${stats.orderStatusMap?.Processing || 0} currently processing`,
      icon: ShoppingBag,
      color: 'bg-[#99EEFF]/10 text-[#99EEFF] border-[#99EEFF]/30'
    },
    {
      title: 'Active Customers',
      value: stats.totalCustomers,
      desc: 'Registered buyer profiles',
      icon: Users,
      color: 'bg-violet-950/60 text-violet-400 border-violet-800/50'
    },
    {
      title: 'Apparel Catalog Items',
      value: stats.totalProducts,
      desc: `${stats.lowStockProducts?.length || 0} items low in stock`,
      icon: Package,
      color: 'bg-amber-950/60 text-amber-400 border-amber-800/50'
    }
  ];

  return (
    <div className="space-y-8 text-[#E1E7F0]">
      {/* Admin Profile Welcome Banner */}
      <div className="bg-[#11141B] text-white rounded-3xl p-6 sm:p-8 border border-[#232A38] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#99EEFF]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-[#99EEFF] bg-[#161B24] shadow-cyan-subtle flex items-center justify-center">
              <img
                src={user?.avatar || '/assets/founder_harsha_avatar.jpg'}
                alt={user?.name || 'Harsha'}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change Profile Picture"
            >
              <Camera className="w-5 h-5 text-[#99EEFF]" />
            </button>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                {user?.name || 'Harsha'}
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#99EEFF]/15 text-[#99EEFF] border border-[#99EEFF]/30 rounded-full font-display">
                Founder & Creative Director
              </span>
            </div>
            <p className="text-xs text-[#8B95A5]">
              Harsha's Creation Atelier • Established 2024
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPhotoModalOpen(true)}
          className="px-5 py-2.5 bg-[#161B24] hover:bg-[#1E2430] text-white border border-[#232A38] hover:border-[#99EEFF]/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md relative z-10 font-display"
        >
          <Camera className="w-4 h-4 text-[#99EEFF]" />
          <span>Update Profile Photo</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
          Sales & Operations Overview
        </h1>
        <p className="text-xs text-[#8B95A5] mt-0.5">
          Real-time analytics for Harsha's Creation catalog, sales velocity, and customer orders
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 shadow-xl space-y-4 hover:border-[#99EEFF]/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B95A5]">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                {card.value}
              </h3>
              <p className="text-xs text-[#8B95A5] mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Funnel Breakdown */}
      <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white font-display mb-4">
          Order Status Fulfillment Velocity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(stats.orderStatusMap || {}).map(([st, count]) => (
            <div key={st} className="p-4 rounded-2xl bg-[#161B24] border border-[#232A38] text-center">
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full mb-2 border ${getStatusBadgeColor(st)}`}>
                {st}
              </span>
              <p className="text-2xl font-black text-white font-display">{count}</p>
              <p className="text-[10px] text-[#8B95A5] mt-0.5">Orders in state</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Alerts (5 Cols) */}
        <div className="lg:col-span-5 bg-[#11141B] rounded-3xl border border-[#232A38] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2430]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                Low Stock Warnings
              </h3>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-[#99EEFF] hover:underline">
              Manage Catalog
            </Link>
          </div>

          {stats.lowStockProducts?.length === 0 ? (
            <p className="text-xs text-[#8B95A5] py-4 text-center">All inventory levels healthy</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts?.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-2.5 bg-[#161B24] rounded-2xl border border-[#232A38] text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.images?.[0]} alt="" className="w-10 h-12 rounded-lg object-cover bg-stone-900 border border-[#232A38]" />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{item.name}</p>
                      <p className="text-[#8B95A5]">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400 bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-md">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-[#11141B] rounded-3xl border border-[#232A38] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2430]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
              Recent Customer Transactions
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#99EEFF] hover:underline">
              View All Orders
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <p className="text-xs text-[#8B95A5] py-4 text-center">No orders recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E2430] text-[#8B95A5] font-bold uppercase tracking-wider">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2430]">
                  {stats.recentOrders?.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#161B24]/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-white">
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 text-[#E1E7F0] font-medium truncate max-w-[120px]">
                        {ord.user?.name || 'Guest Customer'}
                      </td>
                      <td className="py-3 font-bold text-[#99EEFF] font-display">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadgeColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#8B95A5]">
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

      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardPage;
