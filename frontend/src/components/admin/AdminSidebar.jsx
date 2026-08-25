import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-stone-950 text-stone-300 min-h-[calc(100vh-80px)] p-4 flex flex-col justify-between border-r border-stone-800">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center gap-2 text-amber-400 bg-stone-900/80 rounded-xl border border-stone-800">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Atelier Admin</p>
            <p className="text-[10px] text-stone-400">Merchant Operations</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-stone-800">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
