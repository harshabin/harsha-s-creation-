import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoModal from './ProfilePhotoModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
  ShieldCheck,
  Camera,
  Edit3
} from 'lucide-react';

const AdminSidebar = () => {
  const { user } = useAuth();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
  ];

  return (
    <>
      <aside className="w-64 bg-stone-950 text-stone-300 min-h-[calc(100vh-80px)] p-4 flex flex-col justify-between border-r border-stone-800">
        <div className="space-y-6">
          {/* Admin Profile Card */}
          <div className="p-3.5 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-stone-800 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-white uppercase">
                    {user?.name ? user.name.charAt(0) : 'H'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">
                  {user?.name || 'Harsha'}
                </p>
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="text-stone-400 hover:text-amber-400 transition-colors p-0.5"
                  title="Edit Picture"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="inline-block text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider mt-0.5">
                Owner • Admin
              </span>
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

    <ProfilePhotoModal
      isOpen={photoModalOpen}
      onClose={() => setPhotoModalOpen(false)}
    />
  </>
  );
};

export default AdminSidebar;
